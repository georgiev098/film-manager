package helpers

import "fmt"

// helper to convert string env vars to int
func AtoiOrDefault(s string, def int) int {
	var val int
	_, err := fmt.Sscanf(s, "%d", &val)
	if err != nil {
		return def
	}
	return val
}
