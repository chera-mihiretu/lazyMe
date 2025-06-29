package validation

type Department string

const (
	SoftwareEngineering           Department = "Software Engineering"
	ComputerScienceAndEngineering Department = "Computer Science and Engineering"
)

// IsValid checks if the Department value is valid.
func (d Department) IsValid() bool {
	switch d {
	case SoftwareEngineering,
		ComputerScienceAndEngineering:
		return true
	default:
		return false
	}
}
