#!/usr/bin/env python3
#
# run as follows:
#    python server.py
# then in your browser, visit:
#    http://localhost:4443

# Import libraries
import http.server
import socketserver

# Defining PORT number
PORT = 4443

# Creating handle
Handler = http.server.SimpleHTTPRequestHandler

# Creating TCPServer
http = socketserver.TCPServer(("", PORT), Handler)

# Getting logs
print("serving at port", PORT)
http.serve_forever()