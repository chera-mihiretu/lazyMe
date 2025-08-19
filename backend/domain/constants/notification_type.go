package constants

type NotificationType string

const (
	CommentedOnYourPost      NotificationType = "comment"
	RepliedToYourComment     NotificationType = "reply"
	LikedYourPost            NotificationType = "like-post"
	LikedYourComment         NotificationType = "like-comment"
	LikedYourJobPost         NotificationType = "like-job-post"
	SentYouConnectionRequest NotificationType = "sent-connection-request"
	ConnectionAccepted       NotificationType = "connection-accepted"
	PostBlocked              NotificationType = "post-blocked"
	PostUnblocked            NotificationType = "post-unblocked"
	JobBlocked               NotificationType = "job-blocked"
	JobDeleted               NotificationType = "job-deleted"
	PostDeleted              NotificationType = "post-deleted"

	// Notiication Messages
	CommentedOnYourPostMessage      = "You have a new comment on your post."
	RepliedToYourCommentMessage     = "You have a new reply on your comment."
	LikedYourPostMessage            = "You have a new like on your post."
	LikedYourCommentMessage         = "You have a new like on your comment."
	LikedYourJobPostMessage         = "You have a new like on your job post."
	SentYouConnectionRequestMessage = "You received a new connection request."
	ConnectionAcceptedMessage       = "Your connection request was accepted."
	PostBlockedMessage              = "Your post was blocked by an Content Validation System. We will review it and unblock it if it's valid."
	PostUnblockedMessage            = "Your post has been reviewed and unblocked by our admins."
	JobDeletedMessage               = "Your job post has been deleted because it violated our terms of service."
	JobBlockedMessage               = "Your job post was blocked by an Content Validation System. We will review it and unblock it if it's valid."
	PostDeletedMessage              = "Your post has been deleted because it violated our terms of service."
)

func GetNotificationMessageBasedOnAction(action string) NotificationType {
	switch action {
	case ActionTypeDelete:
		return PostDeletedMessage
	case ActionTypeDeleteJob:
		return JobDeletedMessage
	case ActionTypeBlock:
		return PostBlockedMessage
	case ActionTypeJobBlock:
		return JobBlockedMessage
	case ActionTypeIgnore:
		return PostBlockedMessage
	case ActionTypeIgnoreJob:
		return JobBlockedMessage
	}
	return ""
}

func GetNotificationTypeBasedOnAction(action string) NotificationType {
	switch action {
	case ActionTypeDelete:
		return PostDeleted
	case ActionTypeDeleteJob:
		return JobDeleted
	case ActionTypeBlock:
		return PostBlocked
	case ActionTypeJobBlock:
		return JobBlocked
	case ActionTypeIgnore:
		return PostBlocked
	case ActionTypeIgnoreJob:
		return JobBlocked
	}
	return ""
}
