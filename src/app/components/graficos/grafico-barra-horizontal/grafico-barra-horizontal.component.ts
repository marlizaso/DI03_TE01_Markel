import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import { CHART_PALETTE } from '../utils/chart-colors';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-barra-horizontal',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-barra-horizontal.component.html',
  styleUrls: ['./grafico-barra-horizontal.component.scss']
})
export class GraficoBarraHorizontalComponent implements OnDestroy {

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

  // GRÁFICO — Barras horizontales: restaurantes por tipo de establecimiento
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    this.chart?.destroy();

    const counts = new Map<string, number>();
    data.forEach(r => {
      const tipo = r.restorationType?.trim() || 'Desconocido';
      const cantidadActual = counts.get(tipo) ?? 0;
      counts.set(tipo, cantidadActual + 1);
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
          borderRadius: 6,
        }]
      },
      options: {
        // 'y' intercambia los ejes: categorías en Y, valores en X
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Restaurantes por tipo de establecimiento',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.x} restaurantes`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: '#555' },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          y: {
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
