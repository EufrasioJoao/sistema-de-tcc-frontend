export interface ChartData {
  name: string;
  total: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  rolesCount: Record<string, number>;
  barChartData: ChartData[];
  lineChartData: ChartData[];
}
