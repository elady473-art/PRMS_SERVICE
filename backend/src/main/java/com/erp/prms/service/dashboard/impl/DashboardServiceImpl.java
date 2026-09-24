package com.erp.prms.service.dashboard.impl;

import com.erp.prms.dto.response.DashboardStatsResponse;
import com.erp.prms.entity.enums.PRStatus;
import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.repository.GoodsReceiptNoteRepository;
import com.erp.prms.repository.InvoiceRepository;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.PurchaseRequisitionRepository;
import com.erp.prms.repository.RFQRepository;
import com.erp.prms.repository.VendorRepository;
import com.erp.prms.service.dashboard.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PurchaseRequisitionRepository requisitions;
    private final VendorRepository vendors;
    private final RFQRepository rfqs;
    private final PurchaseOrderRepository purchaseOrders;
    private final GoodsReceiptNoteRepository goodsReceipts;
    private final InvoiceRepository invoices;

    public DashboardServiceImpl(
            PurchaseRequisitionRepository requisitions,
            VendorRepository vendors,
            RFQRepository rfqs,
            PurchaseOrderRepository purchaseOrders,
            GoodsReceiptNoteRepository goodsReceipts,
            InvoiceRepository invoices) {
        this.requisitions = requisitions;
        this.vendors = vendors;
        this.rfqs = rfqs;
        this.purchaseOrders = purchaseOrders;
        this.goodsReceipts = goodsReceipts;
        this.invoices = invoices;
    }

    @Override
    public DashboardStatsResponse getStats() {
        long totalRequisitions = requisitions.count();
        long pendingApprovals = requisitions.findByStatusOrderByCreatedAtAsc(PRStatus.PENDING_APPROVAL).size();
        long activeVendors = vendors.findByBlacklistedFalseOrderByNameAsc().size();
        long openRfqs = rfqs.findByActiveTrueOrderBySubmissionDeadlineAsc().size();
        long totalPOs = purchaseOrders.count();

        long pendingGRN = goodsReceipts.findAll().stream()
                .filter(g -> !g.isAccepted())
                .count();

        long pendingInvoices = invoices.findByProcessingStatus("PENDING").size();

        BigDecimal totalPOValue = purchaseOrders.findAll().stream()
                .map(po -> po.getTotalAmount() != null ? po.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingInvoiceValue = invoices.findByProcessingStatus("PENDING").stream()
                .map(inv -> inv.getInvoiceAmount() != null ? inv.getInvoiceAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardStatsResponse.builder()
                .totalRequisitions(totalRequisitions)
                .pendingApprovals(pendingApprovals)
                .activeVendors(activeVendors)
                .openRfqs(openRfqs)
                .totalPurchaseOrders(totalPOs)
                .pendingGoodsReceipts(pendingGRN)
                .pendingInvoices(pendingInvoices)
                .totalPurchaseOrderValue(totalPOValue)
                .pendingInvoiceValue(pendingInvoiceValue)
                .build();
    }
}
