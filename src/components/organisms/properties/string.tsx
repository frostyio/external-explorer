import Base from "./base"

export default (name: string, value: string, readOnly?: boolean) => {
	return <div class="property">
		<Base name={name} valueElement={<span>{value}</span>} readOnly={readOnly} />
	</div>
}