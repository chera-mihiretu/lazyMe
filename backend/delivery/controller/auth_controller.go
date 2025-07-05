package controller

import (
	"log"
	"net/http"
	"os"

	"github.com/chera-mihiretu/IKnow/delivery/helpers"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/infrastructure/hashing"
	"github.com/chera-mihiretu/IKnow/infrastructure/middleware"
	"github.com/chera-mihiretu/IKnow/infrastructure/validation"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

type AuthController struct {
	authUseCase usecases.AuthUseCase
}

func NewAuthController(authUseCase usecases.AuthUseCase) *AuthController {
	return &AuthController{
		authUseCase: authUseCase,
	}
}

// Helper for error responses
func respondWithError(ctx *gin.Context, code int, errMsg string) {
	ctx.JSON(code, gin.H{"error": errMsg})
}

func (auth *AuthController) LoginWithGoogle(c *gin.Context) {

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

func (auth *AuthController) HandleCallback(c *gin.Context) {
	// Complete the OAuth2 authentication
	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		respondWithError(c, 500, "Failed to authenticate with Google: "+err.Error())
		return
	}

	verified := helpers.VerifyCallback(user)
	if !verified {
		respondWithError(c, 400, "Google authentication failed")
		return
	}

	user_email := user.Email
	if user_email == "" {
		respondWithError(c, 400, "Email not provided by Google")
		return
	}

	var myUser models.User

	myUser.Email = user.Email
	myUser.Name = user.Name
	myUser.ProfileImageURL = user.AvatarURL

	token, err := auth.authUseCase.SignInWithGoogle(c, myUser)

	if err != nil {
		respondWithError(c, 500, "Failed to register user with Google: "+err.Error())
		return
	}

	c.JSON(200, gin.H{
		"message": "Google authentication successful",
		"token":   token,
	})
}

func (auth *AuthController) LoginWithEmail(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		respondWithError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	err := validation.ValidateLoginInput(user)

	if err != nil {
		respondWithError(ctx, http.StatusBadRequest, "Invalid input "+err.Error())
		return
	}

	token, err := auth.authUseCase.LoginWithEmail(ctx, user)

	if err != nil {
		respondWithError(ctx, http.StatusUnauthorized, err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func (auth *AuthController) RegisterWithEmail(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		respondWithError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	err := validation.RegisterValidationEmail(user)

	if err != nil {
		respondWithError(ctx, http.StatusBadRequest, "Invalid input "+err.Error())
		return
	}

	hashedPassword, err := hashing.HashPassword(user.PasswordHash)

	if err != nil {
		log.Println("Error hashing password: ", err)
		respondWithError(ctx, http.StatusInternalServerError, "Something Went Wrong Please Try again ")
		return
	}

	user.PasswordHash = hashedPassword

	err = auth.authUseCase.RegisterUserEmail(ctx, user)

	if err != nil {
		log.Println("Error creating user: ", err)
		respondWithError(ctx, http.StatusConflict, err.Error())
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User Created Successfully, Please Verify Your account"})
}

func (auth *AuthController) VerifyEmail(ctx *gin.Context) {
	token := ctx.DefaultQuery("token", "")
	front_url, exist := os.LookupEnv("FRONT_BASE_URL")
	if !exist {
		respondWithError(ctx, http.StatusBadRequest, "Front Url Token is required")
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Verifying Email"})

	var tokenModel models.EmailVerification

	email, err := middleware.VerificationTokenValidate(token)

	if err != nil {
		respondWithError(ctx, http.StatusBadRequest, "Invalid token: "+err.Error())
		return
	}

	tokenModel.UserEmail = email
	tokenModel.Token = token

	err = auth.authUseCase.VerifyEmail(ctx, tokenModel)

	if err != nil {
		respondWithError(ctx, http.StatusBadRequest, err.Error())
		return
	}
	ctx.Redirect(http.StatusFound, front_url)
}
