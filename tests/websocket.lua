local net = require("@lune/net")
local task = require("@lune/task")
-- local pprint = require("tests/pprint")

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

local connection = net.socket("ws://127.0.0.1:8000/")

local function sendInstances()
	local frame = getInstanceFrame()
	local encoded = net.jsonEncode(frame)
	print(encoded)
	connection.send(encoded)
end

task.wait(5)

local success, message = pcall(sendInstances)
if not success then
	print(message)
end

task.wait(5)

connection.close()
print("closed")
