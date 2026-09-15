package com.erp.prms.repository.custom.impl;

import com.erp.prms.entity.PurchaseOrder;
import com.erp.prms.repository.custom.PurchaseOrderCustomRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PurchaseOrderCustomRepositoryImpl implements PurchaseOrderCustomRepository {

    private final EntityManager entityManager;

    public PurchaseOrderCustomRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<PurchaseOrder> findActivePurchaseOrdersByVendorId(Long vendorId) {
        String sql = """
                SELECT po.*
                FROM purchase_orders po
                WHERE po.vendor_id = :vendorId
                  AND po.status IN ('SENT', 'CONFIRMED', 'PARTIALLY_RECEIVED')
                ORDER BY po.order_date ASC
                """;
        return entityManager.createNativeQuery(sql, PurchaseOrder.class)
                .setParameter("vendorId", vendorId)
                .getResultList();
    }
}
