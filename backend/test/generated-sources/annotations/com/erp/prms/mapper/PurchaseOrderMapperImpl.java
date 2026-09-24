package com.erp.prms.mapper;

import com.erp.prms.dto.request.PurchaseOrderCreateRequest;
import com.erp.prms.dto.response.PurchaseOrderResponse;
import com.erp.prms.entity.PurchaseOrder;
import com.erp.prms.entity.PurchaseRequisition;
import com.erp.prms.entity.Vendor;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-15T16:37:09+0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Ubuntu)"
)
@Component
public class PurchaseOrderMapperImpl implements PurchaseOrderMapper {

    @Override
    public PurchaseOrder toEntity(PurchaseOrderCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        PurchaseOrder purchaseOrder = new PurchaseOrder();

        purchaseOrder.setItemDetails( request.getItemDetails() );
        purchaseOrder.setTotalAmount( request.getTotalAmount() );
        purchaseOrder.setPaymentTerms( request.getPaymentTerms() );
        purchaseOrder.setExpectedDeliveryDate( request.getExpectedDeliveryDate() );
        purchaseOrder.setExpiryDate( request.getExpiryDate() );

        return purchaseOrder;
    }

    @Override
    public PurchaseOrderResponse toResponse(PurchaseOrder entity) {
        if ( entity == null ) {
            return null;
        }

        PurchaseOrderResponse purchaseOrderResponse = new PurchaseOrderResponse();

        purchaseOrderResponse.setPurchaseRequisitionId( entityPurchaseRequisitionId( entity ) );
        purchaseOrderResponse.setVendorId( entityVendorId( entity ) );
        purchaseOrderResponse.setVendorName( entityVendorName( entity ) );
        purchaseOrderResponse.setId( entity.getId() );
        purchaseOrderResponse.setPurchaseOrderNumber( entity.getPurchaseOrderNumber() );
        purchaseOrderResponse.setItemDetails( entity.getItemDetails() );
        purchaseOrderResponse.setTotalAmount( entity.getTotalAmount() );
        purchaseOrderResponse.setPaymentTerms( entity.getPaymentTerms() );
        purchaseOrderResponse.setStatus( entity.getStatus() );
        purchaseOrderResponse.setOrderDate( entity.getOrderDate() );
        purchaseOrderResponse.setExpectedDeliveryDate( entity.getExpectedDeliveryDate() );
        purchaseOrderResponse.setExpiryDate( entity.getExpiryDate() );

        return purchaseOrderResponse;
    }

    private Long entityPurchaseRequisitionId(PurchaseOrder purchaseOrder) {
        PurchaseRequisition purchaseRequisition = purchaseOrder.getPurchaseRequisition();
        if ( purchaseRequisition == null ) {
            return null;
        }
        return purchaseRequisition.getId();
    }

    private Long entityVendorId(PurchaseOrder purchaseOrder) {
        Vendor vendor = purchaseOrder.getVendor();
        if ( vendor == null ) {
            return null;
        }
        return vendor.getId();
    }

    private String entityVendorName(PurchaseOrder purchaseOrder) {
        Vendor vendor = purchaseOrder.getVendor();
        if ( vendor == null ) {
            return null;
        }
        return vendor.getName();
    }
}
