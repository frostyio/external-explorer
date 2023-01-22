export interface Icon {
	name: string,
	style?: string,
}

export default ({ name, style }: Icon) => {
	return <img src={`icons/${name}`} style={style} />
}