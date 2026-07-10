import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Config } from '../../../common/config';
import { RailUnit } from '../../data/unit';
import { VideoService } from '../../video-page/video-service';
import { Connection } from './connection';
import { Vector2 } from '../../data/vector2';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSplit } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-markers',
  imports: [FaIconComponent],
  templateUrl: './markers.html',
  styleUrl: './markers.css',
})
export class Markers {
  config = inject(Config);
  videoService = inject(VideoService);

  // canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  connection!: HubConnection;
  railConnections = signal<Array<Connection>>([]);

  ngOnInit() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/units`)
      .build();

    this.connection.on('connections', (res) => {
      const connections = res.map((r: any) => new Connection(r));
      this.railConnections.set(connections);
    });

    this.connection.on('units', (res: any) => {
      // const canvas = this.canvas().nativeElement;
      // const ctx = canvas.getContext('2d')!;
      // ctx.lineWidth = 3;
      // // data.forward = res.forward;
      // // data.reverse = res.reverse;
      // const units: Array<RailUnit> = res.units.map((u: any) => new RailUnit(u));
      //
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      //
      // units.forEach((unit) => {
      //   ctx.strokeStyle = 'red';
      //
      //   ctx.beginPath();
      //   ctx.moveTo(unit.a.x, unit.a.y);
      //   ctx.lineTo(unit.b.x, unit.b.y);
      //   ctx.lineTo(unit.c.x, unit.c.y);
      //   ctx.lineTo(unit.d.x, unit.d.y);
      //   ctx.closePath(); // connect last corner to first
      //   ctx.stroke();
      //
      //   // Draw a dot (filled circle) at x=200, y=200 with radius 5
      //   if (unit.front != null) {
      //     ctx.beginPath();
      //     ctx.arc(unit.front.position.x, unit.front.position.y, 20, 0, Math.PI * 2);
      //     ctx.fillStyle = 'green';
      //     ctx.fill();
      //   }
      //   if (unit.back != null) {
      //     ctx.beginPath();
      //     ctx.arc(unit.back.position.x, unit.back.position.y, 20, 0, Math.PI * 2);
      //     ctx.fillStyle = 'red';
      //     ctx.fill();
      //   }
      // });
    });

    void this.connection.start();

    // this.canvas().nativeElement.style.aspectRatio = `${this.videoService.data().info.width} / ${this.videoService.data().info.height}`;
  }

  uncouple(connection: Connection) {
    void this.connection.send('uncouple', {
      address: connection.address,
      function: connection.coupler,
    });
  }

  getPos(position: Vector2) {
    const data = this.videoService.data();
    let nx = (position.x / data.info.width) * (1 / data.state.zoom);
    let ny = (position.y / data.info.height) * (1 / data.state.zoom);

    nx -= (data.state.x / data.info.width) * (1 / data.state.zoom);
    ny -= (data.state.y / data.info.height) * (1 / data.state.zoom);

    return {
      x: nx * 100,
      y: ny * 100,
    };
  }

  ngOnDestroy() {
    void this.connection.stop();
  }

  protected readonly faSplit = faSplit;
}
