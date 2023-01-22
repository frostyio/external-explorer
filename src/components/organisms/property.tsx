import { JSX } from "solid-js"
import { string, vector3 } from "./properties"

export interface Property {
	name: string,
	type: string,
	value: string,
	readOnly?: boolean,
}

export default ({ name, type, value, readOnly }: Property) => {
	let propertyValue: JSX.Element;

	switch (type) {
		case "String":
			propertyValue = string(name, value, readOnly)
			break;
		case "Vector3":
			propertyValue = vector3(name, value, readOnly)
			break;
		default:
			propertyValue = string(name, value, readOnly)
			break;
	}

	return propertyValue;
}