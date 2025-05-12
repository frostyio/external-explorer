import { invoke } from "@tauri-apps/api/tauri";
import { createStore, produce } from "solid-js/store";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import Explorer from "./components/pages/explorer";
import Properties from "./components/pages/properties";
import { Instance, Instances, AddInstancesPayload } from "./instances";
import { createEffect, createSignal } from "solid-js";

export default () => {
	let [instances, setInstances] = createSignal<Instances>({}, { equals: false });

	let addInstance = (instance: Instance) => {
		setInstances(produce(previous => {
			// update parent
			let parentInstance = previous[instance.prop("Parent") || ""];
			if (parentInstance)
				parentInstance.children.push(instance.guid);

			previous[instance.guid] = instance;

			return previous;
		}));
	}

	let addInstances = (instances: Instance[]) => {
		setInstances(produce(previous => {
			for (let instance of instances) {

				let parentInstance = previous[instance.prop("Parent") || ""];
				if (parentInstance)
					parentInstance.children.push(instance.guid);

				previous[instance.guid] = instance;
			}

			return previous;
		}));
	}

	// data model
	addInstance(new Instance("0", "Game", "Place", "-1"));
	addInstance(new Instance("0001", "Workspace", "WorldRoot", "0"));

	listen("addInstances", ({ payload }) => {
		let instances = [];
		for (let instance of payload as AddInstancesPayload) {
			instances.push(new Instance(instance[0], instance[1], instance[2], instance[3]));
		}

		addInstances(instances);
	})

	// let n: number = 2;
	// setInterval(() => addInstance(new Instance((n++).toString(), `Part${n - 1}`, "Part", "1")), 10000)

	return <>
		<Explorer instances={instances} />
		<h2>Properties</h2>
		<Properties />
	</>
}