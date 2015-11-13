package main

import (
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/ant0ine/go-json-rest/rest/test"
	"log"
	"net/http"
	"testing"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hi there, I love %s!", r.URL.Path[1:])
}

func main() {
	fmt.Println("Starting http server ...")
	//MockHttp()
    http.HandleFunc("/", handler)
    http.ListenAndServe("127.0.0.1:9001", nil)
	fmt.Println("Done")
}


func MockHttp() {
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	var user map[string]string = map[string]string{
		"id":         "123",
		"first_name": "Bela",
		"last_name":  "Fleck"}

	var users []int = []int{123, 124, 125}

	router, err := rest.MakeRouter(
		rest.Get("/user", func(w rest.ResponseWriter, r *rest.Request) {
			w.WriteJson(user)
		}),
		rest.Get("/users", func(w rest.ResponseWriter, r *rest.Request) {
			w.WriteJson(users)
		}),
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)
	log.Fatal(http.ListenAndServe(":8080", api.MakeHandler()))
}

func TestSimpleRequest(t *testing.T) {
	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	router, err := rest.MakeRouter(
		rest.Get("/r", func(w rest.ResponseWriter, r *rest.Request) {
			w.WriteJson(map[string]string{"Id": "123"})
		}),
		rest.Get("/incident", func(w rest.ResponseWriter, r *rest.Request) {
			w.WriteJson(map[string]string{"incident": "234"})
		}),
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)

	recorded := test.RunRequest(t, api.MakeHandler(),
		test.MakeSimpleRequest("GET", "http://1.2.3.4/r", nil))
	recorded.CodeIs(200)
	recorded.ContentTypeIsJson()
	//payload := recorded.DecodeJsonPayload()
	fmt.Println(recorded)

	recorded = test.RunRequest(t, api.MakeHandler(),
		test.MakeSimpleRequest("GET", "http://1.2.3.4/incident", nil))
	recorded.CodeIs(200)
	recorded.ContentTypeIsJson()

	recorded = test.RunRequest(t, api.MakeHandler(),
		test.MakeSimpleRequest("GET", "http://1.2.3.4/incident/453", nil))
	recorded.CodeIs(200)
	recorded.ContentTypeIsJson()
}

