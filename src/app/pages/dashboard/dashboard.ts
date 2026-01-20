import { Component, inject, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { CommonChartComponent } from './components/chart/common-chart.component';
import { CommonModule } from '@angular/common';
import { Summary, SummaryWorkDiary } from '../service/summary-work-diary.service';
import { CommonChartInput } from './components/chart/common-chart.model';
import { FormsModule } from '@angular/forms';
import { BaseTableService } from '../service/base.table.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonChartComponent, CommonModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
    dataBarLine: any = {};
    dataPie: any = {};
    constructor(private summaryWorkDiary: SummaryWorkDiary) {}
    selectedChart = 'bar';
    // summaryWorkDiary = inject(SummaryWorkDiary);

    ngOnInit(): void {
        this.summaryWorkDiary.getData().subscribe((res: any) => {
            this.dataBarLine = this.mapSummaryToBarData(res.data);
            this.dataPie = this.mapSummaryToPieData(res.data);
        });
    }
    pieData: CommonChartInput = {
        labels: ['05/01', '06/01', '07/01'],
        series: [
            { name: 'Hoàn thành', data: [2, 1, 0], tension: 0.4 },
            { name: 'Chờ thực hiện', data: [1, 0, 1], tension: 0.4 },
            { name: 'Trì hoãn', data: [0, 0, 1], tension: 0.4 }
        ]
    };
    mapSummaryToPieData(data: Summary[]): CommonChartInput {
        const map = new Map<string, number>();

        data.forEach((item) => {
            map.set(item.status, (map.get(item.status) || 0) + item.total);
        });

        return {
            labels: Array.from(map.keys()).map(this.mapStatusName),
            series: [
                {
                    name: 'Trạng thái công việc',
                    data: Array.from(map.values())
                }
            ]
        };
    }
    mapStatusName(status: string): string {
        const map: Record<string, string> = {
            DONE: 'Hoàn thành',
            PENDING: 'Chờ thực hiện',
            DELAYED: 'Trì hoãn'
        };

        return map[status] || status;
    }
    mapSummaryToBarData(data: Summary[]): CommonChartInput {
        const labels = [...new Set(data.map((i) => i.workDate))];
        const statuses = [...new Set(data.map((i) => i.status))];

        return {
            labels,
            series: statuses.map((status) => ({
                name: this.mapStatusName(status),
                data: labels.map((date) => {
                    const item = data.find((i) => i.workDate === date && i.status === status);
                    return item ? item.total : 0;
                })
            }))
        };
    }
}
