import { Component, input, effect, viewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js';
import { Restaurante } from '../../../interface/restaurante';
import { CHART_PALETTE } from '../utils/chart-colors';
import '../utils/chart-setup';

@Component({
  selector: 'app-grafico-linea',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './grafico-linea.component.html',
  styleUrls: ['./grafico-linea.component.scss']
})
export class GraficoLineaComponent implements OnDestroy {

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

  // GRÁFICO — Línea: distinciones gastronómicas por territorio
  private render(data: Restaurante[], canvas: HTMLCanvasElement) {
    // Limpia la instancia anterior (el efecto se vuelve a ejecutar al filtrar)
    this.chart?.destroy();

    // Colores tomados de la paleta compartida
    const colorMichelin = CHART_PALETTE[2];
    const colorRepsol   = CHART_PALETTE[3];

    // Map<territorio, {michelin, repsol}> con los totales acumulados
    const mapa = new Map<string, { michelin: number; repsol: number }>();
    data.forEach(r => {
      const territorio = r.territory?.trim() || 'Desconocido';
      const estrellas = mapa.get(territorio) ?? { michelin: 0, repsol: 0 };

      estrellas.michelin += Number(r.michelinStar) || 0;
      estrellas.repsol   += Number(r.repsolSun) || 0;

      mapa.set(territorio, estrellas);
    });

    // Map → array [clave, valor], sin territorios sin distinciones, orden alfabético
    const entries = Array.from(mapa.entries())
      .filter(([, v]) => v.michelin > 0 || v.repsol > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));

    const labels: string[]   = entries.map(e => e[0]);
    const michelin: number[] = entries.map(e => e[1].michelin);
    const repsol: number[]   = entries.map(e => e[1].repsol);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '⭐ Estrellas Michelin',
            data: michelin,
            borderColor: colorMichelin,
            backgroundColor: colorMichelin + '22',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colorMichelin,
          },
          {
            label: '☀️ Soles Repsol',
            data: repsol,
            borderColor: colorRepsol,
            backgroundColor: colorRepsol + '22',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colorRepsol,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { color: '#333', usePointStyle: true } },
          title: {
            display: true,
            text: 'Distinciones gastronómicas por territorio',
            font: { size: 15, weight: 'bold' },
            color: '#333',
            padding: { bottom: 14 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
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
