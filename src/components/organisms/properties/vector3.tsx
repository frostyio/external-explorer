import Base from "./base"

export default (name: string, value: string, readOnly?: boolean) => {
	return <div class="property">
		<Base name={name} valueElement={<span>{value}</span>} readOnly={readOnly}>
			<Base name="X" valueElement={<span>0</span>} indentation={1} />
			<Base name="Y" valueElement={<span>0</span>} indentation={1} />
			<Base name="Z" valueElement={<span>0</span>} indentation={1} />
		</Base>
	</div>
}