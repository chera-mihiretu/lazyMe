package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/reposiroty"
)

type FollowUseCase interface {
	GetConnects(ctx context.Context, userID string) ([]models.Connects, error)
	GetConnections(ctx context.Context, userID string, page int) ([]models.Connects, error)
	GetConnectRequests(ctx context.Context, userID string, page int) ([]models.Connects, error)
	CreateConnect(ctx context.Context, connect models.Connects) error
	DeleteConnect(ctx context.Context, connect models.Connects) error
	IsConnected(ctx context.Context, connect models.Connects) (bool, error)
	GetConnectionsCount(ctx context.Context, userID string) (int64, error)
	AcceptConnection(ctx context.Context, connect models.Connects) error
}

type followUseCase struct {
	connect reposiroty.ConnectRepository
}

func NewConnectUsecase(repository reposiroty.ConnectRepository) FollowUseCase {
	return &followUseCase{
		connect: repository,
	}
}

func (f *followUseCase) GetConnects(ctx context.Context, userID string) ([]models.Connects, error) {
	return f.connect.GetConnects(ctx, userID)
}
func (f *followUseCase) GetConnections(ctx context.Context, userID string, page int) ([]models.Connects, error) {
	return f.connect.GetConnections(ctx, userID, page)
}
func (f *followUseCase) GetConnectRequests(ctx context.Context, userID string, page int) ([]models.Connects, error) {
	return f.connect.GetConnectRequests(ctx, userID, page)
}

func (f *followUseCase) CreateConnect(ctx context.Context, connect models.Connects) error {
	return f.connect.CreateConnection(ctx, connect)
}
func (f *followUseCase) DeleteConnect(ctx context.Context, connect models.Connects) error {
	return f.connect.DeleteConnection(ctx, connect)
}
func (f *followUseCase) IsConnected(ctx context.Context, connect models.Connects) (bool, error) {
	return f.connect.IsConnected(ctx, connect)
}
func (f *followUseCase) GetConnectionsCount(ctx context.Context, userID string) (int64, error) {
	return f.connect.GetConnectionsCount(ctx, userID)
}
func (f *followUseCase) AcceptConnection(ctx context.Context, connect models.Connects) error {
	return f.connect.AcceptConnection(ctx, connect)
}
