package main

import (
	"encoding/json"
	"fmt"
)

type BikeParts struct {
	WheelCount int
}

type Bike []BikeParts

type User struct {
	Name  string   `json:"name"`
	Title string   `json:"title",omitempty`
	Cars  []string `json:"cars,omitempty"`
	Bikes []Bike   `json:"bikes,omitempty"`
}

func main() {
	user := &User{
		Name:  "Frank",
		Cars:  []string{"porsche"},
		Bikes: []Bike{[]BikeParts{BikeParts{WheelCount: 23}}},
	}

	b, err := json.MarshalIndent(user, "", "  ")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(string(b))
}
