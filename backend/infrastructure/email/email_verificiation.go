package email

import (
	"errors"
	"fmt"
	"log"
	"os"

	"gopkg.in/gomail.v2"
)

func SendVerificationEmail(to, token string) error {

	from := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	base_url := os.Getenv("BASE_URL")

	subject := "Email Verification - IKnow"
	body := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>IKnow - Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
					<!-- Header with gradient bar -->
					<tr>
						<td style="height: 6px; background: linear-gradient(90deg, #9333ea 0%%, #3b82f6 100%%);"></td>
					</tr>
					
					<!-- Logo and title section -->
					<tr>
						<td style="padding: 40px 40px 20px 40px; text-align: center;">
							<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); border-radius: 20px; display: inline-block; margin-bottom: 24px; line-height: 80px; font-size: 32px; font-weight: bold; color: white; font-family: Arial, sans-serif;">
								IK
							</div>
							<h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #1f2937; font-family: Arial, sans-serif;">Welcome to IKnow</h1>
							<p style="margin: 0; font-size: 18px; color: #6b7280; line-height: 1.6; font-family: Arial, sans-serif;">To complete your account setup and start connecting with your campus community, please verify your email address.</p>
						</td>
					</tr>
					
					<!-- Button section -->
					<tr>
						<td style="padding: 0 40px 30px 40px; text-align: center;">
							<a href="%s/api/auth/email/verify-email?token=%s" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); color: white; font-size: 16px; font-weight: 600; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-family: Arial, sans-serif;">Verify Your Account</a>
						</td>
					</tr>
					
					<!-- Footer section -->
					<tr>
						<td style="padding: 30px 40px 40px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">If you didn't create an account with IKnow, you can safely ignore this email.</p>
							<p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">This link will expire in 24 hours for security reasons.</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`, base_url, token)

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, from, email_password)

	if err := d.DialAndSend(m); err != nil {
		return errors.New("infrastructure/email_verification.go: " + err.Error())
	}

	return nil
}

func SendPasswordResetEmail(to, token string) error {
	from := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	front_url := os.Getenv("FRONT_BASE_URL")

	subject := "Password Reset Request - IKnow"
	body := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IKnow - Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
					<!-- Header with gradient bar -->
					<tr>
						<td style="height: 6px; background: linear-gradient(90deg, #9333ea 0%%, #3b82f6 100%%);"></td>
					</tr>
					
					<!-- Logo and title section -->
					<tr>
						<td style="padding: 40px 40px 20px 40px; text-align: center;">
							<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); border-radius: 20px; display: inline-block; margin-bottom: 24px; line-height: 80px; font-size: 32px; font-weight: bold; color: white; font-family: Arial, sans-serif;">
								IK
							</div>
							<h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #1f2937; font-family: Arial, sans-serif;">Reset Your Password</h1>
							<p style="margin: 0; font-size: 18px; color: #6b7280; line-height: 1.6; font-family: Arial, sans-serif;">We received a request to reset your password. Click the button below to create a new secure password for your IKnow account.</p>
						</td>
					</tr>
					
					<!-- Button section -->
					<tr>
						<td style="padding: 0 40px 30px 40px; text-align: center;">
							<a href="%s/auth/reset-password?token=%s" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); color: white; font-size: 16px; font-weight: 600; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-family: Arial, sans-serif;">Reset Your Password</a>
						</td>
					</tr>
					
					<!-- Footer section -->
					<tr>
						<td style="padding: 30px 40px 40px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">If you didn't request a password reset, you can safely ignore this email.</p>
							<p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">This link will expire in 1 hour for security reasons.</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`, front_url, token)

	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, from, email_password)

	if err := d.DialAndSend(m); err != nil {
		return errors.New("infrastructure/email_verification.go: " + err.Error())
	}

	return nil
}

// SendEmailNewFeature sends a feature announcement email to multiple users.
// recipients: list of user emails
// subject: email subject (defaults if empty)
// content: main paragraph content (defaults if empty)
// buttonText: text displayed on the CTA button (defaults if empty)
func SendEmailToUsers(to string, subject, content string) error {
	from := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	front_url := os.Getenv("FRONT_BASE_URL")
	if subject == "" {
		subject = "New Feature Just Landed - IKnow"
	}
	if content == "" {
		content = "We just launched something new to enhance your campus experience. Click below to explore it now."
	}

	// Build body template once (content & button text injected)
	bodyTemplate := `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>IKnow - New Feature</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%%" style="background-color: #f4f4f4;">
		<tr>
			<td align="center" style="padding: 40px 20px;">
				<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
					<!-- Header with gradient bar -->
					<tr>
						<td style="height: 6px; background: linear-gradient(90deg, #9333ea 0%%, #3b82f6 100%%);"></td>
					</tr>
					
					<!-- Logo and title section -->
					<tr>
						<td style="padding: 40px 40px 20px 40px; text-align: center;">
							<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); border-radius: 20px; display: inline-block; margin-bottom: 24px; line-height: 80px; font-size: 32px; font-weight: bold; color: white; font-family: Arial, sans-serif;">
								IK
							</div>
							<h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #1f2937; font-family: Arial, sans-serif;">New Feature Released</h1>
							<p style="margin: 0; font-size: 18px; color: #6b7280; line-height: 1.6; font-family: Arial, sans-serif;">%s</p>
						</td>
					</tr>
					
					<!-- Button section -->
					<tr>
						<td style="padding: 0 40px 30px 40px; text-align: center;">
							<a href="%s" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%%, #3b82f6 100%%); color: white; font-size: 16px; font-weight: 600; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-family: Arial, sans-serif;">Try It Now</a>
						</td>
					</tr>
					
					<!-- Footer section -->
					<tr>
						<td style="padding: 30px 40px 40px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
							<p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">Stay tuned for more exciting updates from IKnow!</p>
							<p style="margin: 0; font-size: 14px; color: #9ca3af; line-height: 1.5; font-family: Arial, sans-serif;">If the button doesn't work, copy & paste this link: %s</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`

	d := gomail.NewDialer("smtp.gmail.com", 587, from, email_password)

	body := fmt.Sprintf(bodyTemplate, content, front_url, front_url)
	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)
	if err := d.DialAndSend(m); err != nil {
		log.Println("Failed to send email:", err)
		return errors.New("infrastructure/email_verification.go: failed sending to " + to + ": " + err.Error())
	}

	return nil
}
