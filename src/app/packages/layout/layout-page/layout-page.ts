import { Component, effect, ElementRef, inject, signal, untracked, viewChild } from '@angular/core';
import { Video } from '../../video/video/video';
import { Config } from '../../common/config';
import { VideoService } from '../../video/video-page/video-service';
import { InfoHub } from '../../../hubs/info-hub';
import { form, FormField } from '@angular/forms/signals';

type Block = {
  point: Point;
  distance: number;
};

@Component({
  selector: 'app-layout-page',
  imports: [Video, FormField],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.css',
})
export class LayoutPage {
  arcRadius = 30;
  config = inject(Config);
  videoService = inject(VideoService);
  infoHub = inject(InfoHub);

  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  // A flat list of points. So joining paths can have their intersection moved as one piece
  points = Array<Point>();
  blocks = new Array<Block>();

  // These need to exist in the main flat points list
  paths = new Array<Array<Point>>();

  isDragging = false;
  selected?: Point;
  selectedBlock?: Block;

  jsonModel = signal({ json: '' });
  jsonForm = form(this.jsonModel);

  deleteSelected() {
    const point = this.selected;
    if (point == null) return;

    this.points.splice(this.points.indexOf(point), 1);
    // Point could be used by multiple paths
    const paths = this.paths.filter((p) => p.includes(point));
    paths.forEach((path) => {
      path.splice(path.indexOf(point), 1);
    });

    this.paths = this.paths.filter((p) => p.length > 0);

    this.drawLines();
  }

  firstRun = true;

  setup() {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) return;
    if (!this.firstRun) return;

    this.firstRun = false;

    this.drawLines();

    let lastMousePosition: Point | undefined;
    console.log('setup');

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.code == 'Space') {
          e.preventDefault();
          if (e.repeat || lastMousePosition == null) return;

          this.blocks.push({
            point: lastMousePosition,
            distance: 100,
          });

          untracked(() => {
            this.drawLines();
          });
        }
      },
      { passive: false },
    );

    canvas.addEventListener('contextmenu', (e) => {
      this.selected = undefined;

      this.drawLines();
      e.preventDefault();
    });

    canvas.addEventListener('mousedown', (e) => {
      const position = this.convertPoint(e);

      const match = this.getPointClick(position);

      if (match) {
        this.selected = match;
        this.isDragging = true;
      }

      this.drawLines();
    });

    canvas.addEventListener('mousemove', (e) => {
      lastMousePosition = this.convertPoint(e);

      if (!this.isDragging || !this.selected) return;

      this.selected.x = lastMousePosition.x;
      this.selected.y = lastMousePosition.y;
      this.drawLines();
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.drawLines();
    });

    canvas.addEventListener('click', (e) => {
      const position = this.convertPoint(e);

      if (this.isDragging || this.getPointClick(position)) {
        return;
      }

      // There could be more than one path to append to, if this is the intersection of 2 selected. So just take the first one
      let path = this.paths.find((p) => (this.selected ? p.includes(this.selected) : false));

      // Add to the end of the path
      if (this.selected != null && path != null && path.indexOf(this.selected) == path.length - 1) {
        const point = { x: position.x, y: position.y };
        this.points.push(point);
        path.push(point);
        this.selected = point;
      } else {
        // Either null current path, or make a new path since a point in the middle was selected
        const path = new Array<Point>();

        // Add the selected as the start point
        if (this.selected != null) {
          path.push(this.selected);
        }

        const point = { x: position.x, y: position.y };
        this.points.push(point);
        path.push(point);

        this.paths.push(path);

        this.selected = point;
      }

      this.drawLines();
    });
  }

  constructor() {
    this.infoHub.start();

    effect(() => {
      try {
        const obj = JSON.parse(this.jsonModel().json);
        console.log(obj );
        this.paths = obj.paths ?? [];
        this.blocks = obj.blocks ?? [];
        untracked(() => {
          this.drawLines();
        });
      } catch (e) {}
    });

    effect(() => {
      this.canvas();
      this.setup();
    });
  }

  getPointClick(position: Point) {
    return this.points.find((p) =>
      this.closeTo(p, { x: position.x, y: position.y }, this.arcRadius),
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

  drawLines() {
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
    this.points.forEach((point) => {
      context.beginPath();
      if (this.selected == point) {
        context.fillStyle = this.isDragging ? 'blue' : 'orange';
      } else {
        context.fillStyle = 'green';
      }

      context.arc(point.x, point.y, this.arcRadius, 0, this.radians(360));
      context.fill();
    });

    // Lines
    this.paths.forEach((path) => {
      path.forEach((point, i) => {
        if (i > 0) {
          context.beginPath();
          context.strokeStyle = 'green';
          context.lineWidth = 15;
          context.moveTo(path[i - 1].x, path[i - 1].y);
          context.lineTo(point.x, point.y);
          context.stroke();
        }
      });
    });

    const json = JSON.stringify(
      {
        paths: this.paths,
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

type Point = {
  x: number;
  y: number;
};
