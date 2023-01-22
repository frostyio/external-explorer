import { createSignal, JSX, Show } from "solid-js"
import CollapsedArrow from "../../molecules/collapsedArrow"


export interface Base {
	name: string,
	valueElement: JSX.Element,
	children?: JSX.Element,
	collapsed?: boolean,
	indentation?: number,
	readOnly?: boolean,
}

export default ({ name, valueElement, children, collapsed, indentation, readOnly }: Base) => {
	let [isCollapsed, setCollapsed] = createSignal<boolean>(collapsed || true);

	return <div class="property-base" style={`${readOnly ? "color: var(--foreground-800);" : ""}`} >
		<div style="display: flex; justify-content: flex-start; vertical-align: middle;">
			<div style="display: flex; justify-content: flex-start; width: 55vw; max-width: 400px;">
				<Show when={children} fallback={<div style="width: 28px;" />}>
					<div><CollapsedArrow setCollapsed={setCollapsed} isCollapsed={isCollapsed} /></div>
				</Show>
				<span style={`width: 30%; padding-left: ${(indentation || 0) * 28}px`}>{name}</span>
			</div>
			<div class="value">{valueElement}</div>
		</div>
		<Show when={!isCollapsed()}>
			<div>{children}</div>
		</Show>
	</div>
}