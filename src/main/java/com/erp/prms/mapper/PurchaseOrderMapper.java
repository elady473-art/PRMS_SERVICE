package com.erp.prms.mapper;

import com.erp.prms.dto.request.PurchaseOrderCreateRequest;
import com.erp.prms.dto.response.PurchaseOrderResponse;
import com.erp.prms.entity.PurchaseOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PurchaseOrderMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "purchaseOrderNumber", ignore = true)
    @Mapping(target = "purchaseRequisition", ignore = true)
    @Mapping(target = "vendor", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "orderDate", ignore = true)
    @Mapping(target = "goodsReceiptNotes", ignore = true)
    @Mapping(target = "invoices", ignore = true)
    PurchaseOrder toEntity(PurchaseOrderCreateRequest request);

    @Mapping(target = "purchaseRequisitionId", source = "purchaseRequisition.id")
    @Mapping(target = "vendorId", source = "vendor.id")
    @Mapping(target = "vendorName", source = "vendor.name")
    @Mapping(target = "createdAt", source = "createdAt")
    PurchaseOrderResponse toResponse(PurchaseOrder entity);
}
