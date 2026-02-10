package helpers

import (
	"encoding/json"
	"errors"
	"io"
	"maps"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

// helper to convert string env vars to int
func AtoiOrDefault(s string, def int) int {
	val, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return val
}

// ReadJSON decodes JSON from an HTTP request body into dst.
// dst must be a pointer.
func ReadJSON(w http.ResponseWriter, r *http.Request, dst any) error {
	const maxBytes = 1 << 20 // 1MB

	r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
	defer r.Body.Close()

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(dst); err != nil {
		return err
	}

	// Catch multiple JSON values
	if err := dec.Decode(&struct{}{}); err != io.EOF {
		return errors.New("body must contain only a single JSON value")
	}

	return nil
}

// WriteJSON writes v as JSON to the HTTP response.
func WriteJSON(
	w http.ResponseWriter,
	status int,
	data any,
	headers http.Header,
) error {
	maps.Copy(w.Header(), headers)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(data)
}

func HasPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func CompareHashAndPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func ParseValidationErrors(err error) map[string]string {
	errs := make(map[string]string)
	vErrs, ok := err.(validator.ValidationErrors)
	if !ok {
		return nil
	}

	for _, e := range vErrs {
		field := e.Field()

		var message string
		switch e.Tag() {
		case "required":
			message = "This field is required"
		case "min":
			message = "Value is too short (minimum " + e.Param() + " characters)"
		case "max":
			message = "Value is too long (maximum " + e.Param() + " characters)"
		case "email":
			message = "Invalid email format"
		case "oneof":
			message = "Must be one of: " + e.Param()
		case "url":
			message = "Must be a valid URL"
		case "gt":
			message = "Must be greater than " + e.Param()
		case "lte":
			message = "Must be " + e.Param() + " or earlier"
		case "contains":
			if e.Field() == "min_aperture" || e.Field() == "max_aperture" {
				message = "Aperture must follow the format 'f/number' (e.g., f/2.8)"
			} else {
				message = "Value must contain: " + e.Param()
			}
		default:
			message = "Invalid value (failed " + e.Tag() + ")"
		}

		errs[field] = message
	}

	return errs
}
