package helpers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// helper to convert string env vars to int
func AtoiOrDefault(s string, def int) int {
	var val int
	_, err := fmt.Sscanf(s, "%d", &val)
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
