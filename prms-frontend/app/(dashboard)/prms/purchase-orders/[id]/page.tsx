"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Download, Send, Check, X } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const po = {
    id: params.id,
    poNumber: "PO-2024-00353",
    supplier: "Tech Solutions Ltd.",
    status: "CONFIRMED",
    createdDate: "2024-03-20T00:00:00Z",
    deliveryDate: "2024-04-05T00:00:00Z",
    totalAmount: 45000,
    items: [
      { name: "Software Licenses", quantity: 50, unitPrice: 500, total: 25000 },
      { name: "Support Services", quantity: 1, unitPrice: 20000, total: 20000 },
    ],
  };

  const daysRemaining = Math.ceil((new Date(po.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">{po.poNumber}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Status</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400">{po.status}</Badge>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Delivery In</p>
            <p className="text-2xl font-bold text-white mt-1">{daysRemaining} days</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(po.totalAmount)}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Items</p>
            <p className="text-2xl font-bold text-white mt-1">{po.items.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-400">Description</th>
                <th className="text-left py-3 px-4 text-gray-400">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-400">Unit Price</th>
                <th className="text-left py-3 px-4 text-gray-400">Total</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-gray-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-gray-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

