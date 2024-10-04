#!/usr/bin/env python3
#
# run as follows:
#    python simple-https-server.py
# then in your browser, visit:
#    https://localhost:4443
#
#httpd.socket = ssl.wrap_socket (httpd.socket, certfile='./server.pem', server_side=True)

# Import libraries
import http.server
import socketserver
import ssl

# Defining PORT number
PORT = 4443

# Define Certificates
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='certs/totp-toolset.crt', keyfile='certs/totp-toolset.key')
context.check_hostname = False

# Creating handle
Handler = http.server.SimpleHTTPRequestHandler

# Creating TCPServer
http = socketserver.TCPServer(("", PORT), Handler)

# Getting logs
print("serving at port", PORT)
http.serve_forever()