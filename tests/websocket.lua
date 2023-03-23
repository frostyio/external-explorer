local client = require("http.websocket")
local json = require("tests/json")
local pprint = require("tests/pprint")

local idx = 1
local function generateGuid()
	idx = idx + 1
	return ("%04x"):format(idx)
end

local instances = {}

local function new(data)
	local guid = generateGuid()
	instances[guid] = data
	return guid
end

local n = "0000"
for i = 1, 10 do
	new({ ClassName = "Part", Name = "Part" .. i, Parent = ("%04x"):format(idx), Color = "Red" })
end

local function getInstanceFrame()
	local frame = {
		ModifyGame = {
			AddInstances = {},
		},
	}

	for guid, properties in pairs(instances) do
		table.insert(frame.ModifyGame.AddInstances, { guid, properties.Name, properties.ClassName, properties.Parent })
	end

	return frame
end

--

local connection = client.new_from_uri("ws://127.0.0.1:8000/")
assert(connection:connect())

local function sendInstances()
	local frame = getInstanceFrame()
	local encoded = json.encode(frame)
	pprint(encoded)

	assert(connection:send(encoded))
end

local start = os.clock()
while os.clock() - start < 1 do
end

sendInstances()

local start = os.clock()
while os.clock() - start < 10 do
end

connection:close()
print("closed")
