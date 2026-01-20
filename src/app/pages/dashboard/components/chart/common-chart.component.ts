import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../../layout/service/layout.service';
export interface CommonChartInput {
    labels: string[];
    series: CommonChartSeries[];
}

export interface CommonChartSeries {
    name: string;
    data: number[];
    color?: string;
    tension?: number;
}
@Component({
    standalone: true,
    selector: 'app-common-chart',
    imports: [ChartModule, CommonModule],
    template: `
        <div class="card">
            <div *ngIf="title" class="font-semibold text-xl mb-4">{{ title }}</div>
            <p-chart [type]="type" [data]="chartData" [options]="chartOptions" class="h-100" />
        </div>
    `
})
export class CommonChartComponent implements OnInit, OnDestroy {
    @Input() title = '';
    @Input() type: 'bar' | 'line' | 'pie' = 'bar';
    @Input() input!: CommonChartInput;
    @Input() xLabel = '';
    @Input() yLabel = '';
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => this.initChart());
    }

    ngOnInit() {
        this.initChart();
    }

    private initChart() {
        const style = getComputedStyle(document.documentElement);
        const textColor = style.getPropertyValue('--text-color');
        const borderColor = style.getPropertyValue('--surface-border');
        const textMutedColor = style.getPropertyValue('--text-color-secondary');

        this.chartData = this.type === 'pie' ? this.buildPieData() : this.buildBarLineData();

        this.chartOptions = {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales:
                this.type === 'pie'
                    ? {}
                    : {
                          x: {
                              title: {
                                  display: !!this.xLabel,
                                  text: this.xLabel
                              },
                              ticks: { color: textMutedColor },
                              grid: { color: 'transparent' }
                          },
                          y: {
                              title: {
                                  display: !!this.yLabel,
                                  text: this.yLabel
                              },
                              ticks: { color: textMutedColor },
                              grid: { color: borderColor }
                          }
                      }
        };
    }

    private buildBarLineData() {
        return {
            labels: this.input.labels,
            datasets: this.input.series.map((s: any) => ({
                label: s.name,
                data: s.data,
                fill: this.type === 'line' ? false : true,
                tension: this.type === 'line' ? 0.4 : 0
            }))
        };
    }

    private buildPieData() {
        return {
            labels: this.input.labels,
            datasets: [
                {
                    data: this.input.series[0]?.data ?? []
                }
            ]
        };
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
