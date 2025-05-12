export type Instances = { [key: string]: Instance };

export type AddInstancesPayload = [string[]]

export class Instance {
	public guid: string;
	private collapsed: boolean = true;

	private properties: { [key: string]: string };
	public children: string[] = [];

	constructor(guid: string, name: string, className: string, parent: string) {
		this.guid = guid;
		this.properties = {
			"Name": name,
			"Parent": parent,
			"ClassName": className,
		};
		this.children = [];
	}

	public getChildren(instances: Instances): Instance[] {
		let children: Instance[] = [];

		for (let guid of this.children) {
			let instance = instances[guid];
			if (instance !== null)
				children.push(instance);
		}

		return children;
	}

	public prop(name: string): string | undefined {
		return this.properties[name];
	}

	public addChild(guid: string) {
		this.children.push(guid);
	}
}