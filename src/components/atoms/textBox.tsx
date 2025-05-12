import { Accessor, Setter } from "solid-js";

export interface TextBox {
	placeholder?: string;
	setter: Setter<string>;
}

export default ({ placeholder, setter }: TextBox) => {
	return <>
		<input
			type="text"
			placeholder={placeholder}
			onChange={(event) => setter(event.currentTarget.value)}
		/>
	</>
}