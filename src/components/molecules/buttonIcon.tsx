import Icon from "../atoms/icon"

export interface ButtonIcon {
	name: string,
	buttonStyle?: string,
	handler: (event: MouseEvent) => void
}

export default ({ name, handler, buttonStyle }: ButtonIcon) => {
	return <button class="buttonIcon" onClick={handler}><Icon name={name} style={buttonStyle} /></button>
}