"use client";

import { Card, CardContent } from "@/components/ui/card";

export function SpendChart() {
  const data = [
    { month: "Jan", spend: 45000, budget: 50000 },
    { month: "Feb", spend: 52000, budget: 50000 },
    { month: "Mar", spend: 48000, budget: 50000 },
    { month: "Apr", spend: 55000, budget: 50000 },
    { month: "May", spend: 47000, budget: 50000 },
    { month: "Jun", spend: 53000, budget: 50000 },
    { month: "Jul", spend: 49000, budget: 50000 },
    { month: "Aug", spend: 56000, budget: 50000 },
    { month: "Sep", spend: 51000, budget: 50000 },
    { month: "Oct", spend: 54000, budget: 50000 },
    { month: "Nov", spend: 47000, budget: 50000 },
    { month: "Dec", spend: 58000, budget: 50000 },
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.spend, d.budget)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Total Spend: <span className="text-white font-semibold">ETB 618,000</span>
        </div>
        <div className="text-sm text-gray-400">
          Budget Variance: <span className="text-red-400 font-semibold">+ETB 18,000</span>
        </div>
      </div>

      <div className="h-64 relative">
        {/* Chart Area */}
        <div className="absolute inset-0 flex items-end">
          {data.map((item, index) => {
            const spendHeight = (item.spend / maxValue) * 100;
            const budgetHeight = (item.budget / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center mx-0.5">
                {/* Budget Line */}
                <div 
                  className="w-full bg-blue-500/20 rounded-t-md absolute"
                  style={{ height: `${budgetHeight}%`, bottom: 0 }}
                />
                
                {/* Spend Bar */}
                <div 
                  className="w-3/4 bg-prms-primary rounded-t-md relative"
                  style={{ height: `${spendHeight}%` }}
                />
                
                {/* Month Label */}
                <div className="text-xs text-gray-500 mt-2">{item.month}</div>
              </div>
            );
          })}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="flex items-center">
              <div className="w-full border-t border-gray-800"></div>
              <div className="text-xs text-gray-600 pl-2 w-16">
                ETB {(maxValue * percent / 100 / 1000).toFixed(0)}K
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-prms-primary mr-2"></div>
          <span className="text-gray-400">Actual Spend</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-blue-500/20 mr-2"></div>
          <span className="text-gray-400">Budget</span>
        </div>
      </div>
    </div>
  );
}