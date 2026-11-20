import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import { CHART_PALETTE } from '../utils/chart-colors';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-donut',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-donut.component.html',
  styleUrls: ['./grafico-donut.component.scss']
})
export class GraficoDonutComponent implements OnDestroy {

  restaurantes = input<Restaurante[]>([]);

  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const data = this.restaurantes();
      const c = this.canvas();
      if (!c) return;

      this.render(data, c.nativeElement);
    });
  }

  // GRÁFICO — Donut: top 10 localidades con más restaurantes
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    this.chart?.destroy();

    // Map<localidad, cantidad>
    const counts = new Map<string, number>();
    data.forEach(r => {
      const loc = r.locality?.trim() || 'Desconocida';
      counts.set(loc, (counts.get(loc) ?? 0) + 1);
    });

    // Pares [localidad, cantidad] de mayor a menor, solo las 10 primeras
    const top10 = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: top10.map(e => e[0]),
        datasets: [{
          data: top10.map(e => e[1]),
          backgroundColor: top10.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + 'bb'),
          borderColor: top10.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: { color: '#333', usePointStyle: true, boxWidth: 10 }
          },
          title: {
            display: true,
            text: 'Top 10 localidades con más restaurantes',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = (ctx.dataset.data as number[]).reduce((acc, v) => acc + v, 0);
                const porcentaje = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
                return ` ${ctx.parsed} restaurantes (${porcentaje}%)`;
              }
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}