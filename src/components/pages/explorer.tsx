import { Accessor, createEffect, createSignal, For, JSX, Show, on } from "solid-js";
import FilterSearch from "../molecules/filterSearch";
import List from "../organisms/list";
import Instance from "../organisms/instance";
import { Instance as InstanceObject, Instances as InstancesObject } from "../../instances";

export interface Explorer {
	instances: Accessor<InstancesObject>
}

const Explorer = ({ instances }: Explorer) => {
	let [query, setQuery] = createSignal<string>("");

	createEffect(() => {
		console.log(`query has changed to: ${query()}`);
	})

	let [services, setServices] = createSignal<JSX.Element>();

	createEffect(() => {
		let list = instances();
		let game = list["0"];

		let expand = (instance: InstanceObject): JSX.Element => {
			if (instance.children.length === 0)
				return undefined;

			return <>
				<For each={instance.getChildren(list)}>{(instance, i) =>
					<Instance name={instance.prop("Name") || ""} className={instance.prop("ClassName") || ""}>
						{expand(instance)}
					</Instance>
				}</For>
			</>
		}
		setServices(expand(game));

	})

	return <div id="explorer">
		<FilterSearch name="Workspace" shortcut="Shift + Ctrl + X" setter={setQuery} />
		<List height="35vh">
			{/* <For each={services()}>{(instance, i) =>
				<Instance name={instance.prop("Name") || ""} className={instance.prop("ClassName") || ""} />
			}</For> */}
			{services}
		</List>
	</div>
}

export default Explorer;