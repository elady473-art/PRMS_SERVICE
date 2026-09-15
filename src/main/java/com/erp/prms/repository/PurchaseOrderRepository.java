package com.erp.prms.repository;

import com.erp.prms.entity.PurchaseOrder;
import com.erp.prms.entity.enums.POStatus;
import com.erp.prms.repository.custom.PurchaseOrderCustomRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>, PurchaseOrderCustomRepository {
    Optional<PurchaseOrder> findByPurchaseOrderNumber(String purchaseOrderNumber);
    List<PurchaseOrder> findByVendorIdAndStatus(Long vendorId, POStatus status);
    List<PurchaseOrder> findByStatusAndExpiryDateBefore(POStatus status, LocalDate expiryDate);
}
