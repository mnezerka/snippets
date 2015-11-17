package main

import (
	"container/list"
	"fmt"
	"log"
	"net"
	"net/http"
)

// server instance singleton
var server *MockHttpServer = NewMockHttpServer()

type MockHttpServer struct {
	reqCounter int
	endPoints  list.List
}

func NewMockHttpServer() *MockHttpServer {
	s := new(MockHttpServer)
	//s.endPoints = list.New()
	s.reqCounter = 0
	return s
}

func (this *MockHttpServer) getEndPoint(id string) *MockEndPoint {
	var result *MockEndPoint = nil
	for e := this.endPoints.Front(); e != nil; e = e.Next() {
		if e.Value.(*MockEndPoint).id == id {
			result = e.Value.(*MockEndPoint)
			break
		}
	}
	return result
}

func HandlerEndPoint(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		log.Print("Creating new endpoint")

		ln, err := net.Listen("tcp", ":8081")
		if err == nil {
			handler := http.NewServeMux()
			ep := NewMockEndPoint("test", "testaddr", 8081, handler, ln)
			go http.Serve(ln, ep)
			server.endPoints.PushBack(ep)
			log.Print("Endpoint added")
		} else {
			log.Printf("Can't listen: %s", err)
		}

	} else if r.Method == "DELETE" {
		log.Print("Removing endpoint")
		if ep := server.getEndPoint("test"); ep != nil {
			log.Print("Removing endpoint that has been found")
			err := ep.listener.Close()
			log.Print(err)
		}
	} else {
		fmt.Println("mockhttp:dump endpoint info")
	}
}

func HandlerRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is instance of Mock Http Server")
	for e := server.endPoints.Front(); e != nil; e = e.Next() {
		//ep := *MockEndPoint(e.Value)
		//fmt.Fprintf(w, "EndPoint: %s %s:%d", e.Value.id, e.Value.addr, e.Value.port)
		fmt.Fprintf(w, "EndPoint: %#v", e.Value)
	}
}

func main() {
	log.Print("Starting")
	http.HandleFunc("/endpoint", HandlerEndPoint)
	http.HandleFunc("/", HandlerRoot)
	http.ListenAndServe(":8080", nil)
}
