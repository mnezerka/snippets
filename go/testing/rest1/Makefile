build: bin/mock_http_server

bin/mock_http_server:
	go install mock_http_server

run: build
	bin/mock_http_server

clean:
	rm bin/*

test:
	go test mock_http_server

packages:
	go get -t mock_http_server
