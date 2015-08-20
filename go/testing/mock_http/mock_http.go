package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
)

func main() {

	w := httptest.NewRecorder()

	handler := func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("Request received %#v", r)
		fmt.Fprintln(w, "Hello, client")
	}

	//ts := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	ts := httptest.NewUnstartedServer(http.HandlerFunc(handler))
	ts.Config.Addr = "127.0.0.1:6666"
	ts.Start()
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		log.Fatal(err)
	}

	greeting, err := ioutil.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s", greeting)
}
