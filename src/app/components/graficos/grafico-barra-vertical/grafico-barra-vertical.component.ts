import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import { CHART_PALETTE } from '../utils/chart-colors';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-barra-vertical',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-barra-vertical.component.html',
  styleUrls: ['./grafico-barra-vertical.component.scss']
})
export class GraficoBarraVerticalComponent implements OnDestroy {

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

  // GRÁFICO — Barras verticales: restaurantes por territorio
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    this.chart?.destroy();

    const counts = new Map<string, number>();
    data.forEach(r => {
      const territorio = r.territory?.trim() || 'Desconocido';
      counts.set(territorio, (counts.get(territorio) ?? 0) + 1);
    });

    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: sorted.map(e => e[0]),
        datasets: [{
          label: 'Restaurantes',
          data: sorted.map(e => e[1]),
          backgroundColor: sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length] + 'bb'),
          borderColor: sorted.map((_, i) => CHART_PALETTE[i % CHART_PALETTE.length]),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Restaurantes por territorio',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} restaurantes`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#555' },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          x: {
            ticks: { color: '#555' },
            grid: { display: false }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
