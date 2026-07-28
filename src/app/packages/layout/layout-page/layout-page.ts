import { Component, effect, ElementRef, inject, signal, untracked, viewChild } from '@angular/core';
import { Video } from '../../video/video/video';
import { Config } from '../../common/config';
import { VideoService } from '../../video/video-page/video-service';
import { InfoHub } from '../../../hubs/info-hub';
import { form, FormField } from '@angular/forms/signals';
import { Sizer } from '../../sizer/sizer';

type Node = {
  x: number;
  y: number;
};

type Edge = {
  a: Node;
  b: Node;
};

type Block = {
  point: Node;
  distance: number;
};

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
  blocks = new Array<Block>();

  // These need to exist in the main flat points list
  edges = new Array<Edge>();

  isDragging = false;
  selected?: Node;
  selectedBlock?: Block;

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

    let lastMousePosition: Node | undefined;

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.code == 'Space') {
          e.preventDefault();
          if (e.repeat || lastMousePosition == null) return;

          this.blocks.push({
            point: lastMousePosition,
            distance: 30,
          });

          untracked(() => {
            this.draw();
          });
        }
      },
      { passive: false },
    );

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

      this.selected.x = lastMousePosition.x;
      this.selected.y = lastMousePosition.y;

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
      this.selected = this.getPointClick(position) ?? { x: position.x, y: position.y };
      this.nodes.push(this.selected);

      if (prev == null) {
        this.draw();
        return;
      }

      this.edges.push({
        a: prev,
        b: this.selected,
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
        // These need to be actually from the nodes list so if a node position is updated the edge updates too
        this.edges = (obj.edges ?? []).map((e: any) => ({
          a: this.nodes.find((n) => n.x == e.a.x && n.y == e.a.y),
          b: this.nodes.find((n) => n.x == e.b.x && n.y == e.b.y),
        }));
        this.blocks = obj.blocks ?? [];
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

  getPointClick(position: Node) {
    return this.nodes.find((p) =>
      this.closeTo(p, { x: position.x, y: position.y }, this.arcRadius),
    );
    // return this.layout
    //   .map((row) => [
    //     row.find((p) => this.closeTo(p, { x: position.x, y: position.y }, this.arcRadius)),
    //     row,
    //   ])
    //   .find(([p]) => p) as [Point, Array<Point>] | undefined;
  }

  closeTo(a: Node, b: Node, dist: number) {
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

  draw() {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d')!;

    context.clearRect(0, 0, canvas.width, canvas.height);

    this.blocks.forEach((block) => {
      context.beginPath();
      context.fillStyle = 'red';
      context.arc(block.point.x, block.point.y, this.arcRadius, 0, this.radians(360));
      context.fill();

      context.beginPath();
      context.fillStyle = 'rgb(255 0 0 / 0.21)';
      context.arc(block.point.x, block.point.y, block.distance, 0, this.radians(360));
      context.fill();
    });

    // Points
    this.nodes.forEach((node) => {
      context.beginPath();
      if (this.selected == node) {
        context.fillStyle = this.isDragging ? 'blue' : 'orange';
      } else {
        context.fillStyle = 'green';
      }

      context.arc(node.x, node.y, this.arcRadius, 0, this.radians(360));
      context.fill();
    });

    // Lines
    this.edges.forEach((edge) => {
      context.beginPath();
      context.strokeStyle = 'green';
      context.lineWidth = 3;
      context.moveTo(edge.a.x, edge.a.y);
      context.lineTo(edge.b.x, edge.b.y);
      context.stroke();
    });
  }

  save() {
    const json = JSON.stringify(
      {
        nodes: this.nodes,
        edges: this.edges,
        blocks: this.blocks,
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
