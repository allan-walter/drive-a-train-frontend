import { Vector2 } from './vector2';

export class Transform {
	position: Vector2;
	direction: Vector2;

	constructor(json: any) {
		this.position = new Vector2(json.position.x, json.position.y);
		this.direction = new Vector2(json.direction.x, json.direction.y);
	}

	rotateVector(v: Vector2, angle: number): Vector2 {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
	}
	rotateTransform(angle: number, center: Vector2) {
		// rotate position around center
		const rel = this.position.subtract(center);
		const rotatedPos = this.rotateVector(rel, angle).add(center);

		// rotate direction (no center needed)
		const rotatedDir = this.rotateVector(this.direction, angle);

		this.position = rotatedPos;
		this.direction = rotatedDir;
	}
}
