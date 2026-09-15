package com.erp.prms.repository;

import com.erp.prms.entity.GoodsReceiptNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoodsReceiptNoteRepository extends JpaRepository<GoodsReceiptNote, Long> {
    Optional<GoodsReceiptNote> findByReceiptNumber(String receiptNumber);
    List<GoodsReceiptNote> findByPurchaseOrderIdOrderByReceiptDateDesc(Long purchaseOrderId);
}
