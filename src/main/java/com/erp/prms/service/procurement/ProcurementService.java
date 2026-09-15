package com.erp.prms.service.procurement;

import com.erp.prms.dto.request.PurchaseOrderCreateRequest;
import com.erp.prms.dto.response.PurchaseOrderResponse;

import java.util.List;

public interface ProcurementService {
    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderCreateRequest request);
    PurchaseOrderResponse getPurchaseOrder(Long id);
    List<PurchaseOrderResponse> listAll();
}
