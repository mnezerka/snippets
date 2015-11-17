package main

import (
	"fmt"
	"net/http"
)

var server *MockHttpServer = NewMockHttpServer()

type MockHttpServer struct {
	reqCounter int
	endPoints  []HttpEndPoint
}

type HttpEndPoint struct {
	id      string
	addr    string
	port    int
	handler http.Handler
}

type Step struct {
	url      string
	response string
}

type Scenario struct {
	steps []Step
}

func NewMockHttpServer() *MockHttpServer {
	s := new(MockHttpServer)
	s.reqCounter = 0
	return s
}

func (this *MockHttpServer) addEndPoint(id string, addr string, port int) error {

	e := new(HttpEndPoint)
	e.id = id
	e.addr = addr
	e.port = port

	return nil
}

func Handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
	fmt.Println("http:path", r.URL.Path)
	fmt.Println("http:query", r.URL.RawQuery)
	fmt.Println("http:method", r.Method)
	fmt.Println("http:counter", server.reqCounter)
	server.reqCounter++
}

func HandlerConfig(w http.ResponseWriter, r *http.Request) {
	fmt.Println("http:config called")
	fmt.Println("http:path", r.URL.Path)
}

func main() {
	fmt.Println("Starting")
	http.HandleFunc("/mockconf", HandlerConfig)
	http.HandleFunc("/", Handler)
	http.ListenAndServe(":8080", nil)
}
