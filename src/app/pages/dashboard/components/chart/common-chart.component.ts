import { Component, Input, SimpleChanges, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../../layout/service/layout.service';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
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
export interface ChartFilter {
    chartType: 'bar' | 'line' | 'pie';
    period: 'year' | 'quarter' | 'month' | 'day';
    value?: number;
    date?: string | null;
}
@Component({
    standalone: true,
    selector: 'app-common-chart',
    imports: [ChartModule, CommonModule, DatePicker, Select, FormsModule],
    templateUrl: 'common-chart.component.html'
})
export class CommonChartComponent implements OnDestroy, OnChanges {
    @Input() title = '';
    @Input() type: 'bar' | 'line' | 'pie' = 'bar';
    @Input() input!: CommonChartInput;
    @Input() xLabel = ''; // tên trục X
    @Input() yLabel = ''; // tên trục Y
    @Input() unit = ''; // đơn vị
    @Output() filterChange = new EventEmitter<ChartFilter>();
    selectedChartType: 'bar' | 'line' | 'pie' = 'bar';
    selectedPeriod: ChartFilter['period'] = 'month';
    selectedValue: number | null = null;
    selectedDate: string | null = null;
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    // loại biểu đồ
    chartTypeOptions = [
        { label: 'Biểu đồ cột', value: 'bar' },
        { label: 'Biểu đồ đường', value: 'line' },
        { label: 'Biểu đồ tròn', value: 'pie' }
    ];

    // kỳ thống kê
    periodOptions = [
        { label: 'Năm', value: 'year' },
        { label: 'Quý', value: 'quarter' },
        { label: 'Tháng', value: 'month' },
        { label: 'Ngày', value: 'day' }
    ];

    // giá trị theo kỳ (năm / quý / tháng)
    periodValueOptions: { label: string; value: number }[] = [];

    // label động
    periodLabel = '';
    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => this.initChart());
        this.onPeriodChange('month');
        this.selectedValue = new Date().getMonth() + 1;
    }
    onPeriodChange(period: 'year' | 'quarter' | 'month' | 'day') {
        this.selectedPeriod = period;
        this.selectedValue = null;
        this.selectedDate = null;

        const now = new Date();
        const year = now.getFullYear();

        if (period === 'year') {
            this.periodLabel = 'Chọn năm';
            this.periodValueOptions = Array.from({ length: 6 }).map((_, i) => ({
                label: `${year - i}`,
                value: year - i
            }));
            this.selectedValue = year;
        }

        if (period === 'quarter') {
            this.periodLabel = 'Chọn quý';
            this.periodValueOptions = [
                { label: 'Quý 1', value: 1 },
                { label: 'Quý 2', value: 2 },
                { label: 'Quý 3', value: 3 },
                { label: 'Quý 4', value: 4 }
            ];
            this.selectedValue = Math.floor((now.getMonth() + 3) / 3);
        }

        if (period === 'month') {
            this.periodLabel = 'Chọn tháng';
            this.periodValueOptions = Array.from({ length: 12 }).map((_, i) => ({
                label: `Tháng ${i + 1}`,
                value: i + 1
            }));
            this.selectedValue = now.getMonth() + 1;
        }
        if (period === 'day') {
            this.selectedDate = this.formatDate(new Date());
            console.log('day',this.selectedDate);
            
        }
        this.emitFilter();
    }
    formatDate(date: Date): string {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    private emitFilter() {
        this.filterChange.emit({
            chartType: this.selectedChartType,
            period: this.selectedPeriod,
            value: this.selectedValue ?? undefined,
            date: this.selectedDate
        });
    }
    onChartTypeChange(type: 'bar' | 'line' | 'pie') {
        this.selectedChartType = type;
        this.type = type;
        this.initChart();
        this.emitFilter();
    }

    onValueChange(value: number) {
        this.selectedValue = value;
        this.emitFilter();
    }

    onDateChange(date: Date) {
        this.selectedDate = this.formatDate(date);
        this.emitFilter();
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['input'] && this.input?.series?.length) {
            this.initChart();
        }
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
                },
                tooltip: {
                    callbacks: {
                        label: (context: any) => {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y ?? context.parsed;
                            return this.unit ? `${label}: ${value} ${this.unit}` : `${label}: ${value}`;
                        }
                    }
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
        if (!this.input || !this.input.series) {
            return { labels: [], datasets: [] };
        }
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
        if (!this.input || !this.input.series) {
            return { labels: [], datasets: [] };
        }
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
