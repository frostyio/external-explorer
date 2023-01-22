import { createSignal, JSX, Show } from "solid-js"
import CollapsedArrow from "../molecules/collapsedArrow"

export interface Category {
	name: string,
	children?: JSX.Element
	collapsed?: boolean,
}

export default ({ name, collapsed, children }: Category) => {
	let [isCollapsed, setCollapsed] = createSignal<boolean>(collapsed || false);

	return <>
		<div class="category" style="display: flex; justify-content: flex-start; vertical-align: middle;">
			<CollapsedArrow setCollapsed={setCollapsed} isCollapsed={isCollapsed} />
			<h3>{name}</h3>
		</div>
		<div>
			<Show when={!isCollapsed()}>
				{children}
			</Show>
		</div>
	</>
}