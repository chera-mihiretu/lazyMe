package validation

// School represents an enumeration of school values as strings.
type School string

const (
	CivilEngineeringAndArchitecture           School = "Civil Engineering and Architecture"
	ElectricalEngineeringAndComputing         School = "Electrical Engineering and Computing"
	MechanicalChemicalAndMaterialsEngineering School = "Mechanical, Chemical and Materials Engineering"
	AppliedNaturalSciences                    School = "Applied Natural Sciences"
)

// IsValid checks if the School value is valid.
func (s School) IsValid() bool {
	switch s {
	case CivilEngineeringAndArchitecture,
		ElectricalEngineeringAndComputing,
		MechanicalChemicalAndMaterialsEngineering,
		AppliedNaturalSciences:
		return true
	default:
		return false
	}
}
