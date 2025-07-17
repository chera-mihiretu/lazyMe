package models

type UserAnalytics struct {
	TotalUsers  int64   `bson:"total_users" json:"total_users"`
	UserEachDay []int64 `bson:"new_users" json:"new_users"`
}
