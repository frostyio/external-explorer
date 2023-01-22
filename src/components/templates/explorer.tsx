import { createEffect, createSignal } from "solid-js";
import FilterSearch from "../molecules/filterSearch";
import List from "../organisms/list";
import Instance from "../organisms/instance";

const Explorer = () => {
	let [query, setQuery] = createSignal<string>("");

	createEffect(() => {
		console.log(`query has changed to: ${query()}`);
	})

	return <div id="explorer">
		<FilterSearch name="Workspace" shortcut="Shift + Ctrl + X" setter={setQuery} />
		<List height="35vh">
			<Instance name="Workspace" className="WorldRoot" >
				<Instance name="CurrentCamera" className="Camera" />
				<Instance name="Terrain" className="Terrain" />
				<Instance name="Part1" className="Part" />
				<Instance name="Part2" className="Part" />
				<Instance name="Part3" className="Part" />
			</Instance>
		</List>
	</div>
}

export default Explorer;