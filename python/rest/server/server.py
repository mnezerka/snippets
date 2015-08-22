import time
import BaseHTTPServer
import json

HOST_NAME = 'localhost'
PORT_NUMBER = 8080

class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(s):
        """Respond to a GET request."""
        if s.path == '/users':
            s.send_response(200)
            s.send_header("Content-type", "application/json")
            s.end_headers()
            s.wfile.write(json.dumps(['user1', 'user2', 'user3']))
        else:
            s.send_response(404)
            s.end_headers()

if __name__ == '__main__':
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)

