package models

type ReportAnalytics struct {
	TotalReports    int     `bson:"total_reports" json:"total_reports"`
	ReviewedReports int     `bson:"reviewed_reports" json:"reviewed_reports"`
	PendingReports  int     `bson:"pending_reports" json:"pending_reports"`
	ReportEachDay   []int64 `bson:"report_each_day" json:"report_each_day"`
}
