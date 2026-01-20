import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { CommonChartComponent } from './components/chart/common-chart.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [ CommonChartComponent, CommonModule],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12">
                <app-common-chart title="Revenue Share" type="line" [data]="pieData"> </app-common-chart>
            </div>
             <div class="col-span-12">
                <app-common-chart title="Revenue Share" type="bar" [data]="pieData"> </app-common-chart>
            </div>
             <div class="col-span-12">
                <app-common-chart title="Revenue Share" type="pie" [data]="pieData"> </app-common-chart>
            </div>
        </div>
    `
})
export class Dashboard {
    pieData = {
        labels: ['Subscriptions', 'Ads', 'Affiliate','afalica'],
        datasets: [
            {
                data: [55, 25, 20,40],
                // backgroundColor: ['#6366f1', '#22c55e', '#f97316']
            }
        ]
    };
}
