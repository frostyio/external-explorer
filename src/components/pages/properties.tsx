import { createSignal } from "solid-js";
import FilterSearch from "../molecules/filterSearch";
import Category from "../organisms/category";
import Property from "../organisms/property";

const Properties = () => {
	let [query, setQuery] = createSignal<string>("");

	return <>
		<FilterSearch name="Properties" shortcut="Shift + Ctrl + Z" setter={setQuery} />
		<Category name="Data" collapsed={false}>
			<Property name="ClassName" type="String" value="Part" readOnly={true} />
			<Property name="Name" type="String" value="Part" />
			<Property name="Orientation" type="Vector3" value="0, 0, 0" />
			<Property name="Parent" type="String" value="Workspace" />
		</Category>
	</>
}

export default Properties;