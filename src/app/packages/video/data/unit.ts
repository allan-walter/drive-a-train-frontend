import { Vector2 } from './vector2';
import { Transform } from './transform';

export class UnitDefinition {
	name: string;
	address: number;
	frontCouplerIndex: number;
	backCouplerIndex: number;

	constructor(json: any) {
		this.name = json.name;
		this.address = json.address;
		this.frontCouplerIndex = json.frontCouplerIndex;
		this.backCouplerIndex = json.backCouplerIndex;
	}
}

export enum Direction {
	Forward,
	Reverse
}

export class RailUnitDef {
	name: string;
	address: number;

	constructor(json: any) {
		this.name = json.name;
		this.address = json.address;
	}
}

export class RailUnit {
	a: Vector2;
	b: Vector2;
	c: Vector2;
	d: Vector2;
	front?: Transform;
	frontCouplerIndex: number;
	reverseCouplerIndex: number;
	back?: Transform;
	def: RailUnitDef;

	constructor(json: any) {
		this.a = Vector2.fromJson(json.a);
		this.b = Vector2.fromJson(json.b);
		this.c = Vector2.fromJson(json.c);
		this.d = Vector2.fromJson(json.d);
		this.frontCouplerIndex = json.frontCouplerIndex;
		this.reverseCouplerIndex = json.reverseCouplerIndex;
		if (json.front) {
			this.front = new Transform(json.front);
		}
		if (json.back) {
			this.back = new Transform(json.back);
		}
		this.def = new RailUnitDef(json.def);
	}

	contains(p: Vector2): boolean {
		const s1 = this.cross(this.a, this.b, p);
		const s2 = this.cross(this.b, this.c, p);
		const s3 = this.cross(this.c, this.d, p);
		const s4 = this.cross(this.d, this.a, p);

		const hasNeg = s1 < 0 || s2 < 0 || s3 < 0 || s4 < 0;
		const hasPos = s1 > 0 || s2 > 0 || s3 > 0 || s4 > 0;

		return !(hasNeg && hasPos); // inside if all same sign
	}

	private cross(v1: Vector2, v2: Vector2, p: Vector2): number {
		const edgeX = v2.x - v1.x;
		const edgeY = v2.y - v1.y;

		const px = p.x - v1.x;
		const py = p.y - v1.y;

		return edgeX * py - edgeY * px;
	}

	rotate(angle: number, center: Vector2) {
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		const rotatePoint = (p: Vector2) => {
			const x = p.x - center.x;
			const y = p.y - center.y;
			p.x = x * cos - y * sin + center.x;
			p.y = x * sin + y * cos + center.y;
		};

		rotatePoint(this.a);
		rotatePoint(this.b);
		rotatePoint(this.c);
		rotatePoint(this.d);
	}
}
