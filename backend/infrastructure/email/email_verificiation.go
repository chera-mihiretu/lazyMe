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

func SendPasswordResetEmail(to, token string) error {
	from := os.Getenv("EMAIL")
	email_password := os.Getenv("EMAIL_PASSWORD")
	front_url := os.Getenv("FRONT_BASE_URL")

	subject := "Password Reset Request"
	body := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lazyme - Password Reset</title>
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
        .reset-btn {
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
        .reset-btn:hover {
            background: #005fbb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Lazyme</h1>
        <p>To reset your password, please click the button below</p>
        <a href="%s/auth/reset-password?token=%s" class="reset-btn">Reset Your Password</a>
    </div>
</body>
</html>
`, front_url, token)

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
		subject = "New Feature Just Landed"
	}
	if content == "" {
		content = "We just launched something new to enhance your experience. Click below to explore it now."
	}

	// Build body template once (content & button text injected)
	bodyTemplate := `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Lazyme - New Feature</title>
<style>
  body {font-family: Arial, sans-serif; background: linear-gradient(135deg,#0088ff,#ffffff); color:#000; text-align:center; padding:50px; margin:0;}
  .container {background:#ffffff; border:2px solid #0088ff; border-radius:12px; padding:30px; display:inline-block; max-width:560px; box-shadow:0 4px 10px rgba(0,0,0,0.1);}
  h1 {font-size:2.2rem; color:#0088ff; margin:0 0 12px;}
  p {font-size:1.05rem; line-height:1.5; margin:0 0 22px;}
  .feature-btn {background:#0088ff; color:#fff; font-size:1rem; padding:15px 32px; border:none; border-radius:8px; cursor:pointer; text-decoration:none; font-weight:600; letter-spacing:.3px; transition:background .3s ease; display:inline-block;}
  .feature-btn:hover {background:#005fbb;}
  .link-fallback {margin-top:28px; font-size:0.75rem; color:#444; word-break:break-all;}
</style>
</head>
<body>
  <div class="container">
    <h1>New Feature Released</h1>
    <p>%s</p>
    <a href="%s" class="feature-btn" target="_blank" rel="noopener">%s</a>
    <div class="link-fallback">If the button does not work, copy & paste this link:<br />%s</div>
  </div>
</body>
</html>`

	d := gomail.NewDialer("smtp.gmail.com", 587, from, email_password)

	body := fmt.Sprintf(bodyTemplate, content, front_url, "Try It", front_url)
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
