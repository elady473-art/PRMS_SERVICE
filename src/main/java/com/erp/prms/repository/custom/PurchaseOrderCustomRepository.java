package com.erp.prms.repository.custom;

import com.erp.prms.entity.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderCustomRepository {

List<PurchaseOrder> findActivePurchaseOrdersByVendorId(Long vendorId);
}
