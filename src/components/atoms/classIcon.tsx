export interface ClassIcon {
	name: string,
	style?: string,
}

export default ({ name, style }: ClassIcon) => {
	return <img class="classIcon" src={`icons/classIcons/${name}.png`} style={style} />
}