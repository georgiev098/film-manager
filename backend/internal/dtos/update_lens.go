package dtos

type LensUpdate struct {
	FocalLengthMin *int    `json:"min_focal_length,omitempty"`
	FocalLengthMax *int    `json:"max_focal_length,omitempty"`
	MinApertureStr *string `json:"min_aperture,omitempty"`
	MaxApertureStr *string `json:"max_aperture,omitempty"`
	Mount          *string `json:"mount,omitempty"`
	ImageURL       *string `json:"image_url,omitempty"`
	Notes          *string `json:"notes,omitempty"`
}
