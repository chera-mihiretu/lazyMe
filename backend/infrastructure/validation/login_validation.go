package validation

import (
	"errors"
	"regexp"

	"github.com/chera-mihiretu/IKnow/domain/models"
)

func ValidateLoginInput(user models.User) error {

	if user.Email == "" {
		return errors.New("email is required")
	}

	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	if !emailRegex.MatchString(user.Email) {
		return errors.New("invalid email format")
	}

	if user.PasswordHash == "" {
		return errors.New("password is required")
	}

	return nil

}
