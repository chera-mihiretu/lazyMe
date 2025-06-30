package controller

import (
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
)

type PostController struct {
	post usecases.PostUseCase
}

func NewPostController(post usecases.PostUseCase) *PostController {
	return &PostController{
		post: post,
	}
}

func (p *PostController) GetPosts(c *gin.Context) {

}

func (p *PostController) GetPostByID(c *gin.Context) {

}
func (p *PostController) CreatePost(c *gin.Context) {

}

func (p *PostController) UpdatePost(c *gin.Context) {

}

func (p *PostController) DeletePost(c *gin.Context) {

}
