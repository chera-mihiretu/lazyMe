package middleware

import "github.com/gin-gonic/gin"

func GoogleProvider(c *gin.Context) {
	q := c.Request.URL.Query()
	q.Add("provider", "google")
	c.Request.URL.RawQuery = q.Encode()
	c.Next()

}
