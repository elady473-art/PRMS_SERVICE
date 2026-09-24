package com.erp.prms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsResponse {
    private long totalRequisitions;
    private long pendingApprovals;
    private long activeVendors;
    private long openRfqs;
    private long totalPurchaseOrders;
    private long pendingGoodsReceipts;
    private long pendingInvoices;
    private BigDecimal totalPurchaseOrderValue;
    private BigDecimal pendingInvoiceValue;
}
