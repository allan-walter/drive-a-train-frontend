import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { Video } from '../../video/video/video';
import { Config } from '../../common/config';
import { VideoService } from '../../video/video-page/video-service';
import { InfoHub } from '../../../hubs/info-hub';

@Component({
  selector: 'app-layout-page',
  imports: [Video],
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

  // These need to exist in the main flat points list
  paths = new Array<Array<Point>>();

  isDragging = false;
  selected?: Point;

  split() {
    // const point = this.selected;
    // if (point == null) return;
    //
    // // There could be more than 1, but the idea with split is to just add one more
    // this.paths.filter((p) => p.includes(point));
  }

  export() {
    const jsonStr = JSON.stringify(this.paths, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url); // clean up
  }

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

  constructor() {
    this.infoHub.start();

    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      if (!canvas) {
        return;
      }

      this.drawLines();

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
        if (!this.isDragging || !this.selected) return;

        const position = this.convertPoint(e);

        this.selected.x = position.x;
        this.selected.y = position.y;
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
        if (
          this.selected != null &&
          path != null &&
          path.indexOf(this.selected) == path.length - 1
        ) {
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
          console.log('create path 2');

          this.selected = point;
        }

        this.drawLines();
      });
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
  }

  radians(value: number) {
    return value * (Math.PI / 180);
  }
}

type Point = {
  x: number;
  y: number;
};
