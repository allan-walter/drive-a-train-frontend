import { Component, effect, ElementRef, inject, signal, untracked, viewChild } from '@angular/core';
import { Video } from '../../video/video/video';
import { Config } from '../../common/config';
import { VideoService } from '../../video/video-page/video-service';
import { InfoHub } from '../../../hubs/info-hub';
import { form, FormField } from '@angular/forms/signals';
import { Sizer } from '../../sizer/sizer';
import { uuidv4 } from '../../../crypto';

type Node = {
  id: string;
  point: Point;
  speed: Speed;
};

type Point = {
  x: number;
  y: number;
};

type Edge = {
  a: string;
  b: string;
};

type Speed = 'NORMAL' | 'SLOW' | 'STOP';
@Component({
  selector: 'app-layout-page',
  imports: [Video, FormField, Sizer],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.css',
})
export class LayoutPage {
  arcRadius = 5;
  config = inject(Config);
  videoService = inject(VideoService);
  infoHub = inject(InfoHub);

  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  // A flat list of points. So joining paths can have their intersection moved as one piece
  nodes = Array<Node>();

  // These need to exist in the main flat points list
  edges = new Array<Edge>();

  isDragging = false;
  selected?: Node;

  jsonModel = signal({ json: '' });
  jsonForm = form(this.jsonModel);

  deleteSelected() {
    const point = this.selected;
    if (point == null) return;

    this.nodes.splice(this.nodes.indexOf(point), 1);
    // Point could be used by multiple paths
    // const paths = this.edges.filter((p) => p.includes(point));
    // paths.forEach((path) => {
    //   path.splice(path.indexOf(point), 1);
    // });

    // this.edges = this.edges.filter((p) => p.length > 0);

    this.draw();
  }

  firstRun = true;

  setup() {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) return;
    if (!this.firstRun) return;

    this.firstRun = false;

    this.draw();

    let lastMousePosition: Point | undefined;

    canvas.addEventListener('contextmenu', (e) => {
      this.selected = undefined;

      this.draw();
      e.preventDefault();
    });

    canvas.addEventListener('mousedown', (e) => {
      const position = this.convertPoint(e);

      const match = this.getPointClick(position);

      if (match) {
        this.selected = match;
        this.isDragging = true;
      }

      this.draw();
    });

    canvas.addEventListener('mousemove', (e) => {
      lastMousePosition = this.convertPoint(e);

      if (!this.isDragging || !this.selected) return;

      this.selected.point.x = lastMousePosition.x;
      this.selected.point.y = lastMousePosition.y;

      this.draw();
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.draw();
    });

    canvas.addEventListener('click', (e) => {
      const position = this.convertPoint(e);

      if (this.isDragging || this.getPointClick(position)) {
        return;
      }

      const prev = this.selected;
      this.selected = this.getPointClick(position) ?? {
        id: uuidv4(),
        point: { x: position.x, y: position.y },
        speed: 'NORMAL',
      };
      this.nodes.push(this.selected);

      if (prev == null) {
        this.draw();
        return;
      }

      this.edges.push({
        a: prev.id,
        b: this.selected.id,
      });

      this.draw();
    });
  }

  constructor() {
    this.infoHub.start();

    effect(() => {
      try {
        const obj = JSON.parse(this.jsonModel().json);
        this.nodes = obj.nodes ?? [];
        this.edges = obj.edges ?? [];
        untracked(() => {
          this.draw();
        });
      } catch (e) {}
    });

    effect(() => {
      this.canvas();
      this.setup();
    });
  }

  getPointClick(position: Point) {
    return this.nodes.find((p) =>
      this.closeTo(p.point, { x: position.x, y: position.y }, this.arcRadius),
    );
    // return this.layout
    //   .map((row) => [
    //     row.find((p) => this.closeTo(p, { x: position.x, y: position.y }, this.arcRadius)),
    //     row,
    //   ])
    //   .find(([p]) => p) as [Point, Array<Point>] | undefined;
  }

  closeTo(a: Point, b: Point, dist: number) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy <= dist * dist;
  }

  convertPoint(e: MouseEvent) {
    const canvas = this.canvas()?.nativeElement!;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    return { x: Math.floor(x), y: Math.floor(y) };
  }

  setSpeed(speed: Speed) {
    if (this.selected == null) return;

    this.selected.speed = speed;

    this.draw();
  }

  draw() {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d')!;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Points
    this.nodes.forEach((node) => {
      context.beginPath();

      if (this.selected == node) {
        context.fillStyle = this.isDragging ? 'blue' : 'gray';
      } else if (node.speed == 'STOP') {
        context.fillStyle = 'red';
      } else if (node.speed == 'SLOW') {
        context.fillStyle = 'orange';
      } else {
        context.fillStyle = 'green';
      }

      context.arc(node.point.x, node.point.y, this.arcRadius, 0, this.radians(360));
      context.fill();
    });

    // Lines
    this.edges.forEach((edge) => {
      context.beginPath();
      context.strokeStyle = 'green';
      context.lineWidth = 3;
      const a = this.nodes.find((n) => n.id == edge.a)!;
      context.moveTo(a.point.x, a.point.y);
      const b = this.nodes.find((n) => n.id == edge.b)!;
      context.lineTo(b.point.x, b.point.y);
      context.stroke();
    });
  }

  save() {
    const json = JSON.stringify(
      {
        nodes: this.nodes,
        edges: this.edges,
      },
      null,
      2,
    );
    if (json != this.jsonModel().json) {
      this.jsonModel.set({
        json: json,
      });
    }
  }

  radians(value: number) {
    return value * (Math.PI / 180);
  }
}
