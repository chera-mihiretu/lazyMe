package middleware

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthUserMiddleware(role string) gin.HandlerFunc {
	fmt.Println("AuthUserMiddleware called with role:", role)
	load_key, exist := os.LookupEnv("JWT_SECRET_KEY")
	if !exist {
		panic("No JWT_SECRET_KEY found")
	}
	jwtKey := []byte(load_key)

	return func(c *gin.Context) {
		// Allow preflight OPTIONS requests to pass through
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			fmt.Println("No token found in Authorization header")
			c.JSON(401, gin.H{"error": "No token found"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix unconditionally
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid token")
			}
			return jwtKey, nil
		})

		if err != nil {
			fmt.Println("Error parsing token:", err)
			c.JSON(401, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok || !token.Valid {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if role != "all" && claims.Role != role {

			c.JSON(403, gin.H{"error": "Forbidden: insufficient permissions"})
			c.Abort()
			return
		}

		// ✅ Set user info to context
		c.Set("user_id", claims.ID)
		c.Next()
	}
}
