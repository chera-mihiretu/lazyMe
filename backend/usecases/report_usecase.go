package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type ReportUseCase interface {
	ReportPost(ctx context.Context, report models.Report) (models.Report, error)
	GetReportedPosts(ctx context.Context, page int) ([]models.Report, error)
	GetReportAnalytics(ctx context.Context) (models.ReportAnalytics, error)
}

type reportUseCase struct {
	reportRepository repository.ReportRepository
}

func NewReportUseCase(repository repository.ReportRepository) ReportUseCase {
	return &reportUseCase{
		reportRepository: repository,
	}
}

func (r *reportUseCase) ReportPost(ctx context.Context, report models.Report) (models.Report, error) {
	return r.reportRepository.ReportPost(ctx, report)
}

func (r *reportUseCase) GetReportedPosts(ctx context.Context, page int) ([]models.Report, error) {
	return r.reportRepository.GetReportedPosts(ctx, page)

}

func (r *reportUseCase) GetReportAnalytics(ctx context.Context) (models.ReportAnalytics, error) {
	return r.reportRepository.GetReportAnalytics(ctx)
}
