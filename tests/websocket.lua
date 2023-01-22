local client = require("http.websocket")
local connection = client.new_from_uri("ws://127.0.0.1:8000/")
local a = connection:connect()
print(connection, a)
