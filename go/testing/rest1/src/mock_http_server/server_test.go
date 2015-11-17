package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestConfig(t *testing.T) {
	req, _ := http.NewRequest("POST", "http://example.com/config", "This is body")

	w := httptest.NewRecorder()
	HandlerConfig(w, req)

	fmt.Printf("%d - %s", w.Code, w.Body.String())
	assert.True(t, w.Code == http.StatusOK, "Expecting valid config response")

	fmt.Printf("#%v", server.reqCounter)
}

func TestX(t *testing.T) {
	assert.True(t, true, "This is good")

	req, _ := http.NewRequest("GET", "http://example.com/foo", nil)

	w := httptest.NewRecorder()
	Handler(w, req)

	fmt.Printf("%d - %s", w.Code, w.Body.String())
}
