package com.erp.prms.scheduler;

import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.repository.PurchaseOrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class PurchaseOrderExpiryScheduler {
    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderExpiryScheduler(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Scheduled(cron = "${prms.scheduling.purchase-order-expiry-cron:0 0 1 * * *}")
    @Transactional
    public void expireUnconfirmedPurchaseOrders() {
        purchaseOrderRepository.findByStatusAndExpiryDateBefore(POStatus.SENT, LocalDate.now())
                .forEach(purchaseOrder -> purchaseOrder.setStatus(POStatus.CANCELLED));
    }
}
