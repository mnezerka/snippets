package main

import (
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	"github.com/ant0ine/go-json-rest/rest/test"
	"log"
	"testing"
)

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

func main() {
}
