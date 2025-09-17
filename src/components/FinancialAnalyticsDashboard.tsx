import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";

const analyticsData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, reserves: 13000, teams: 2 },
  { month: 'Feb', revenue: 52000, expenses: 38000, reserves: 14000, teams: 2 },
  { month: 'Mar', revenue: 48000, expenses: 35000, reserves: 13000, teams: 2 },
  { month: 'Apr', revenue: 61000, expenses: 42000, reserves: 19000, teams: 2 },
  { month: 'May', revenue: 55000, expenses: 39000, reserves: 16000, teams: 2 },
  { month: 'Jun', revenue: 67000, expenses: 45000, reserves: 22000, teams: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface FinancialAnalyticsDashboardProps {
  className?: string;
  compact?: boolean;
}

export function FinancialAnalyticsDashboard({ className, compact = false }: FinancialAnalyticsDashboardProps = {}) {
  const [activeTab, setActiveTab] = useState("reserves");

  const getChartData = () => {
    switch (activeTab) {
      case "reserves":
        return analyticsData.map(item => ({ ...item, primary: item.reserves, secondary: item.expenses }));
      case "teams":
        return analyticsData.map(item => ({ ...item, primary: item.teams * 1000, secondary: item.expenses }));
      case "trends":
        return analyticsData.map(item => ({ ...item, primary: item.revenue - item.expenses, secondary: item.revenue }));
      default:
        return analyticsData.map(item => ({ ...item, primary: item.reserves, secondary: item.expenses }));
    }
  };

  const getChartConfig = () => {
    switch (activeTab) {
      case "reserves":
        return {
          primary: { name: "Reserves", color: "hsl(var(--success))" },
          secondary: { name: "Expenses", color: "hsl(var(--destructive))" }
        };
      case "teams":
        return {
          primary: { name: "Team Value", color: "hsl(var(--accent))" },
          secondary: { name: "Expenses", color: "hsl(var(--destructive))" }
        };
      case "trends":
        return {
          primary: { name: "Net Profit", color: "hsl(var(--primary))" },
          secondary: { name: "Revenue", color: "hsl(var(--muted-foreground))" }
        };
      default:
        return {
          primary: { name: "Revenue", color: "hsl(var(--primary))" },
          secondary: { name: "Expenses", color: "hsl(var(--destructive))" }
        };
    }
  };

  const chartData = getChartData();
  const chartConfig = getChartConfig();

  return (
    <Card className={`w-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 ${className}`}>
      <CardHeader className={compact ? "py-2 px-4" : "space-y-4 pb-6"}>
        {!compact ? (
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Financial Analytics
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Comprehensive view of your financial performance
            </p>
          </div>
        ) : (
          <CardTitle className="text-sm font-medium">Financial Analytics</CardTitle>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 bg-muted/20 ${compact ? 'p-0 text-[10px] h-7' : 'p-1'} rounded-md`}>
            <TabsTrigger 
              value="reserves" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Reserves
            </TabsTrigger>
            <TabsTrigger 
              value="teams" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Teams
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
            >
              Trends
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pb-6">
        <div className={compact ? "h-32 w-full" : "h-80 w-full"}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.primary.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartConfig.primary.color} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.secondary.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartConfig.secondary.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                className="text-xs"
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `PKR ${(value / 1000).toFixed(0)}K`}
                className="text-xs"
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="secondary"
                stroke={chartConfig.secondary.color}
                strokeWidth={2}
                fill="url(#secondaryGradient)"
                name={chartConfig.secondary.name}
              />
              
              <Area
                type="monotone"
                dataKey="primary"
                stroke={chartConfig.primary.color}
                strokeWidth={3}
                fill="url(#primaryGradient)"
                name={chartConfig.primary.name}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        {compact ? (
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
            <div className="text-xs">
              <span className="text-muted-foreground">Current: </span>
              <span className="font-medium" style={{ color: chartConfig.primary.color }}>
                {formatCurrency(chartData[chartData.length - 1]?.primary)}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-success font-medium">
                +{(((chartData[chartData.length - 1]?.primary - chartData[0]?.primary) / chartData[0]?.primary) * 100).toFixed(1)}%
              </span>
              <span className="text-muted-foreground"> growth</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Month</p>
              <p className="text-lg font-semibold" style={{ color: chartConfig.primary.color }}>
                {formatCurrency(chartData[chartData.length - 1]?.primary)}
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">vs Expenses</p>
              <p className="text-lg font-semibold" style={{ color: chartConfig.secondary.color }}>
                {formatCurrency(chartData[chartData.length - 1]?.secondary)}
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Growth</p>
              <p className="text-lg font-semibold text-success">
                +{(((chartData[chartData.length - 1]?.primary - chartData[0]?.primary) / chartData[0]?.primary) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Net</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(chartData[chartData.length - 1]?.primary - chartData[chartData.length - 1]?.secondary)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}