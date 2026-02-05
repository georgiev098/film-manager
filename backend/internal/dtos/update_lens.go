package dtos

type LensUpdate struct {
	Manufacturer       *string `json:"manufacturer,omitempty"`
	LensType           *string `json:"lens_type,omitempty"`
	ImageStabilization *bool   `json:"image_stabilization,omitempty"`

	FocalLengthMin *int    `json:"min_focal_length,omitempty"`
	FocalLengthMax *int    `json:"max_focal_length,omitempty"`
	MinApertureStr *string `json:"min_aperture,omitempty"`
	MaxApertureStr *string `json:"max_aperture,omitempty"`
	Mount          *string `json:"mount,omitempty"`
	ImageURL       *string `json:"image_url,omitempty"`
	Notes          *string `json:"notes,omitempty"`
}
