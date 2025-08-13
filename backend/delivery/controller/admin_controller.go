package controller

import (
	"log"
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
)

type AdminController struct {
	adminUsecase usecases.AdminUsecase
}

func NewAdminController(adminUsecase usecases.AdminUsecase) *AdminController {
	return &AdminController{
		adminUsecase: adminUsecase,
	}
}

func (ac *AdminController) SendEmailToUsers(c *gin.Context) {

	var email models.Email
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email data"})
		return
	}

	if email.Subject == "" || email.Body == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email subject and body cannot be empty"})
		return
	}

	if err := ac.adminUsecase.SendEmailToUsers(c.Request.Context(), email); err != nil {
		log.Println("Error sending email:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email: " + err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"message": "Email sent successfully",
	})
}

func (ac *AdminController) ImproveEmail(c *gin.Context) {
	var email models.Email
	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email data"})
		return
	}

	if email.Subject == "" || email.Body == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email subject and body cannot be empty"})
		return
	}

	improvedEmail, err := ac.adminUsecase.ImproveEmail(c, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to improve email: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"improved_email": improvedEmail,
	})
}
