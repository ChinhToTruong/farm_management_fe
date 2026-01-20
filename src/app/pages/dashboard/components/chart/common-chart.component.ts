import { Component, Input, OnInit, OnDestroy, NgModule } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../../layout/service/layout.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-common-chart',
    imports: [ChartModule, CommonModule],
    template: `
        <div class="card">
            <div *ngIf="title" class="font-semibold text-xl mb-4">
                {{ title }}
            </div>

            <p-chart [type]="type" [data]="chartData" [options]="chartOptions" class="h-100" />
        </div>
    `
})
export class CommonChartComponent implements OnInit, OnDestroy {
    @Input() title = '';
    @Input() type: 'bar' | 'line' | 'pie' = 'bar';
    @Input() data!: any;
    @Input() options?: any;

    chartData: any;
    chartOptions: any;

    subscription!: Subscription;

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => this.initChart());
    }

    ngOnInit() {
        this.initChart();
    }

    generateThemeColors(count: number): string[] {
        const colors = ['--p-primary-500', '--p-green-500', '--p-orange-500', '--p-cyan-500', '--p-pink-500', '--p-indigo-500'];

        const style = getComputedStyle(document.documentElement);

        return Array.from({ length: count }, (_, i) => style.getPropertyValue(colors[i % colors.length]));
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData = {
            ...this.data,
            datasets: this.data.datasets.map((dataset: any) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor ?? this.generateThemeColors(this.data.labels.length)
            }))
        };

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
                              ticks: { color: textMutedColor },
                              grid: { color: 'transparent' }
                          },
                          y: {
                              ticks: { color: textMutedColor },
                              grid: { color: borderColor }
                          }
                      },
            ...this.options
        };
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
