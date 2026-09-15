"use client";

export function PipelineChart() {
  const stages = [
    { name: "PR", value: 45, color: "bg-blue-500" },
    { name: "Approval", value: 32, color: "bg-amber-500" },
    { name: "RFQ", value: 18, color: "bg-indigo-500" },
    { name: "Quotation", value: 15, color: "bg-purple-500" },
    { name: "PO", value: 25, color: "bg-green-500" },
    { name: "GRN", value: 12, color: "bg-teal-500" },
    { name: "Invoice", value: 8, color: "bg-red-500" },
  ];

  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Total Active Documents: <span className="text-white font-semibold">155</span>
        </div>
        <div className="text-sm text-gray-400">
          Avg Cycle Time: <span className="text-white font-semibold">18.5 days</span>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = (stage.value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-sm ${stage.color} mr-2`}></div>
                  <span className="text-sm font-medium text-gray-300">{stage.name}</span>
                </div>
                <div className="text-sm font-semibold text-white">{stage.value}</div>
              </div>
              
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Stage {index + 1}</span>
                <span>{((stage.value / 155) * 100).toFixed(1)}% of total</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Details */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">45</div>
          <div className="text-xs text-gray-400">Purchase Requests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">25</div>
          <div className="text-xs text-gray-400">Purchase Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-xs text-gray-400">Pending Invoices</div>
        </div>
      </div>
    </div>
  );
}