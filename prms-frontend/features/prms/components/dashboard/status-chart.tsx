"use client";

export function StatusChart() {
  const data = [
    { status: "Approved", value: 45, color: "bg-green-500" },
    { status: "Pending", value: 25, color: "bg-amber-500" },
    { status: "Draft", value: 15, color: "bg-blue-500" },
    { status: "Rejected", value: 10, color: "bg-red-500" },
    { status: "Cancelled", value: 5, color: "bg-gray-500" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Donut Chart */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {(() => {
              let cumulativeAngle = 0;
              return data.map((item, index) => {
                const percentage = item.value / total;
                const angle = percentage * 360;
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle + angle;
                cumulativeAngle = endAngle;

                // Convert angles to radians
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                // Calculate coordinates
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                // Determine large arc flag
                const largeArcFlag = angle > 180 ? 1 : 0;

                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `L 50 50`,
                ].join(' ');

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={getComputedStyle(document.documentElement).getPropertyValue(`--${item.color.replace('bg-', '')}`) || item.color}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  />
                );
              });
            })()}
            
            {/* Center hole */}
            <circle cx="50" cy="50" r="20" fill="hsl(var(--card))" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-sm text-gray-400">Total PRs</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
              <span className="text-sm text-gray-300">{item.status}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-white">{item.value}</span>
              <span className="text-xs text-gray-500 w-10 text-right">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-800 text-center">
        <div className="text-sm text-gray-400">
          Last updated: <span className="text-white">Today, 10:30 AM</span>
        </div>
      </div>
    </div>
  );
}