import { createSignal, JSX, Show, on, createEffect } from "solid-js"
import ClassIcon from "../atoms/classIcon"
import CollapsedArrow from "../molecules/collapsedArrow"

export interface Instance {
	name: string,
	className: string,
	children?: JSX.Element
	collapsed?: boolean,
}

export default ({ name, children, collapsed, className }: Instance) => {
	let [isCollapsed, setCollapsed] = createSignal<boolean>(collapsed || false);

	const click = () => {

	}

	return <div class="instance">
		<div class="individualInstance" style="display: flex; justify-content: flex-start; vertical-align: middle;" onClick={click}>
			<Show when={children}>
				<CollapsedArrow setCollapsed={setCollapsed} isCollapsed={isCollapsed} />
			</Show>
			<ClassIcon name={className} />
			<span>{name}</span>
		</div>
		<Show when={!isCollapsed()}>
			<div style="margin-left: 60px;">{children}</div>
		</Show>
	</div>
}