package main

import (
	"fmt"
	"net"
	"net/http"
)

type MockEndPoint struct {
	id       string
	addr     string
	port     int
	handler  http.Handler
	listener net.Listener
}

func NewMockEndPoint(id string, addr string, port int, handler http.Handler, listener net.Listener) *MockEndPoint {
	ep := new(MockEndPoint)
	ep.id = id
	ep.addr = addr
	ep.port = port
	ep.handler = handler
	ep.listener = listener
	return ep
}

func (this *MockEndPoint) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is instance of Mock End Point")
	//w.Write([]byte("The counter  is: " + this.count))
}

type Step struct {
	url      string
	response string
}

type Scenario struct {
	steps []Step
}
