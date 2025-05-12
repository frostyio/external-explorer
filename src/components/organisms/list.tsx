import { JSX } from "solid-js"

export interface List {
	height: string,
	children: JSX.Element,
}

export default ({ height, children }: List) => {

	return <div class="list" style={`height: ${height};`}>
		{children}
	</div >
}