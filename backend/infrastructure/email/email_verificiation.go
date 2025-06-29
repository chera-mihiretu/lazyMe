package email

import (
	"errors"
	"fmt"
	"os"

	"gopkg.in/gomail.v2"
)

func SendEmail(to, token string) error {

	from := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	base_url := os.Getenv("BASE_URL")

	subject := "Email Verification"
	body := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Lazyme - Email Verification</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background: linear-gradient(135deg, #0088ff, #ffffff);
			color: black;
			text-align: center;
			padding: 50px;
		}
		.container {
			background-color: #ffffff;
			border: 2px solid #0088ff;
			border-radius: 12px;
			padding: 30px;
			display: inline-block;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		}
		h1 {
			font-size: 2.5rem;
			color: #0088ff;
			margin-bottom: 10px;
		}
		p {
			font-size: 1.2rem;
			color: black;
			margin-bottom: 20px;
		}
		.verify-btn {
			background: #0088ff;
			color: white;
			font-size: 1rem;
			padding: 15px 30px;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			text-decoration: none;
			transition: background 0.3s ease;
		}
		.verify-btn:hover {
			background: #005fbb;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Lazyme</h1>
		<p>To verify your email please click the button below</p>
		<a href="%s/api/auth/email/verify-email?token=%s" class="verify-btn">Verify Your Account</a>
	</div>
</body>
</html>
`, base_url, token)

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
