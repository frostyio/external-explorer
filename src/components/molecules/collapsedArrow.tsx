import { Accessor, Setter, Show } from "solid-js"
import ButtonIcon from "../molecules/buttonIcon"

export interface CollapsedArrow {
	setCollapsed: Setter<boolean>,
	isCollapsed: Accessor<boolean>,
}

export default ({ setCollapsed, isCollapsed }: CollapsedArrow) => {
	let collapsedArrow = <ButtonIcon
		name="collapsedArrow.svg"
		handler={() => setCollapsed(!isCollapsed())}
		buttonStyle={`transform: rotate(-90deg);`}
	/>

	let nonCollapsedArrow = <ButtonIcon
		name="collapsedArrow.svg"
		handler={() => setCollapsed(!isCollapsed())}
		buttonStyle={`transform: rotate(0deg);`}
	/>

	return <>
		<Show when={!isCollapsed()}>
			{nonCollapsedArrow}
		</Show>
		<Show when={isCollapsed()}>
			{collapsedArrow}
		</Show>
	</>
}