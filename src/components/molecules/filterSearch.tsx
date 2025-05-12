import { Setter } from "solid-js"
import TextBox from "../atoms/textBox"

export interface FilterSearch {
	name: string,
	shortcut?: string,
	setter: Setter<string>,
}

export default ({ name, shortcut, setter }: FilterSearch) => {
	return <div class="filter" style="display: flex; justify-content: flex-start; vertical-align: middle;">
		<TextBox placeholder={`Filter ${name}` + (shortcut ? ` (${shortcut})` : "")} setter={setter} />
	</div>
}