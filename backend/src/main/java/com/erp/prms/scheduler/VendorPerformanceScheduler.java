package com.erp.prms.scheduler;

import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.repository.PurchaseOrderRepository;
import com.erp.prms.repository.VendorRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class VendorPerformanceScheduler {
    private final VendorRepository vendorRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public VendorPerformanceScheduler(VendorRepository vendorRepository, PurchaseOrderRepository purchaseOrderRepository) {
        this.vendorRepository = vendorRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Scheduled(cron = "${prms.scheduling.vendor-performance-cron:0 0 2 1 * *}")
    @Transactional
    public void reviewVendorPerformance() {
        vendorRepository.findByBlacklistedFalseOrderByNameAsc().forEach(vendor -> {
            BigDecimal total = BigDecimal.ZERO;
            int count = 0;
            for (POStatus status : POStatus.values()) {
                for (var purchaseOrder : purchaseOrderRepository.findByVendorIdAndStatus(vendor.getId(), status)) {
                    total = total.add(scoreFor(purchaseOrder.getStatus()));
                    count++;
                }
            }
            vendor.setPerformanceScore(count == 0 ? BigDecimal.ZERO
                    : total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP));
        });
    }

    private BigDecimal scoreFor(POStatus status) {
        return switch (status) {
            case COMPLETED -> BigDecimal.valueOf(100);
            case PARTIALLY_RECEIVED -> BigDecimal.valueOf(70);
            case CONFIRMED, SENT -> BigDecimal.valueOf(50);
            case DRAFT, CANCELLED -> BigDecimal.ZERO;
        };
    }
}
