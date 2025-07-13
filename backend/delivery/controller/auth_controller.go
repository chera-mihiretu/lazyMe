package controller

import (
	"fmt"
	"net/http"
	"net/url"
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

func (auth *AuthController) LoginWithGoogle(c *gin.Context) {

	gothic.BeginAuthHandler(c.Writer, c.Request)

}

func (auth *AuthController) HandleCallback(c *gin.Context) {
	// Complete the OAuth2 authentication
	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to authenticate with Google: " + err.Error()})
		return
	}

	verified := helpers.VerifyCallback(user)
	if !verified {
		c.JSON(400, gin.H{"error": "Google authentication failed"})
		return
	}

	user_email := user.Email
	if user_email == "" {
		c.JSON(400, gin.H{"error": "Email not provided by Google"})
		return
	}

	var myUser models.User

	myUser.Email = user.Email
	myUser.Name = user.Name
	myUser.ProfileImageURL = user.AvatarURL

	token, err := auth.authUseCase.SignInWithGoogle(c, myUser)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to register user with Google: " + err.Error()})
		return
	}
	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s", os.Getenv("FRONT_BASE_URL"), url.QueryEscape(token))
	fmt.Println("Redirecting to:", redirectURL)

	c.Redirect(http.StatusFound, redirectURL)
}

func (auth *AuthController) LoginWithEmail(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := validation.ValidateLoginInput(user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input " + err.Error()})
		return
	}

	token, err := auth.authUseCase.LoginWithEmail(ctx, user)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func (auth *AuthController) RegisterWithEmail(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(user)

	err := validation.RegisterValidationEmail(user)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input " + err.Error()})
		return
	}

	hashedPassword, err := hashing.HashPassword(user.PasswordHash)

	if err != nil {

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Something Went Wrong Please Try again "})
		return
	}

	user.PasswordHash = hashedPassword

	err = auth.authUseCase.RegisterUserEmail(ctx, user)

	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User Created Successfully, Please Verify Your account"})
}

func (auth *AuthController) VerifyEmail(ctx *gin.Context) {
	token := ctx.DefaultQuery("token", "")
	front_url, exist := os.LookupEnv("FRONT_BASE_URL")
	if !exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Front Url Token is required"})
		return
	}

	var tokenModel models.EmailVerification

	email, err := middleware.VerificationTokenValidate(token)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token: " + err.Error()})
		return
	}

	tokenModel.UserEmail = email
	tokenModel.Token = token

	err = auth.authUseCase.VerifyEmail(ctx, tokenModel)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.Redirect(http.StatusFound, front_url+"/auth/verified")
}
