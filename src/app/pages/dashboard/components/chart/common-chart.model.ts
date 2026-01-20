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