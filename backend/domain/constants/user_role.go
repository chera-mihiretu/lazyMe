package constants

// UserRole defines the type for user roles
type UserRole string

const (
	// UserRoleSuperAdmin represents a super admin user role
	UserRoleSuperAdmin UserRole = "super_admin"
	// UserRoleStudent represents a student user role
	UserRoleStudent UserRole = "student"
	// UserRoleTeacher represents a teacher user role
	UserRoleTeacher UserRole = "teacher"
	// UserRoleAdmin represents an admin user role
	UserRoleAdmin UserRole = "admin"
)
