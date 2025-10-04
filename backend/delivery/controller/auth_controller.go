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

// LoginWithGoogle godoc
// @Summary Login with Google
// @Description Redirects user to Google OAuth2 login page
// @Tags Auth
// @Produce json
// @Router /api/auth/google/login [get]
func (auth *AuthController) LoginWithGoogle(c *gin.Context) {

	gothic.BeginAuthHandler(c.Writer, c.Request)

}

// HandleCallback godoc
// @Summary Handle Google OAuth2 callback
// @Description Complete authentication after Google login
// @Tags Auth
// @Produce json
// @Success 302 "Redirects to front-end with token"
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/auth/google/callback [get]
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

// LoginWithEmail godoc
// @Summary Login with email
// @Description Authenticate user using email and password
// @Tags Auth
// @Accept json
// @Produce json
// @Param user body models.User true "User Credentials"
// @Success 200 {object} map[string]string "Returns JWT token"
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /api/auth/email/login [post]
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

// RegisterWithEmail godoc
// @Summary Register new user with email
// @Description Create a new account and send verification email
// @Tags Auth
// @Accept json
// @Produce json
// @Param user body models.User true "User Registration Info"
// @Success 201 {object} map[string]string "User created successfully"
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /api/auth/email/register [post]
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

// VerifyEmail godoc
// @Summary Verify user email
// @Description Verify email using token
// @Tags Auth
// @Produce json
// @Param token query string true "Verification token"
// @Success 302 "Redirects to front-end after verification"
// @Failure 400 {object} map[string]string
// @Router /api/auth/email/verify-email [get]
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

// ForgotPassword godoc
// @Summary Request password reset
// @Description Send reset password email
// @Tags Auth
// @Accept json
// @Produce json
// @Param user body models.User true "User Email"
// @Success 200 {object} map[string]string "Reset email sent"
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/auth/email/forgot-password [post]
func (auth *AuthController) ForgotPassword(ctx *gin.Context) {
	var user models.User

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if user.Email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})
		return
	}

	err := auth.authUseCase.ForgotPassword(ctx, user)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset password email: " + err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Reset password email sent successfully"})
}

// ResetPassword godoc
// @Summary Reset password
// @Description Reset password using token
// @Tags Auth
// @Accept json
// @Produce json
// @Param token query string true "Password reset token"
// @Param user body models.User true "New Password"
// @Success 200 {object} map[string]string "Password reset successfully"
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/auth/email/reset-password [post]
func (auth *AuthController) ResetPassword(ctx *gin.Context) {
	token := ctx.DefaultQuery("token", "")

	var user models.User
	var tokenModel models.EmailVerification

	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokenModel.Token = token

	email, err := middleware.VerificationTokenValidate(tokenModel.Token)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token: " + err.Error()})
		return
	}

	tokenModel.UserEmail = email

	err = auth.authUseCase.ResetPassword(ctx, user, tokenModel)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password: " + err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
