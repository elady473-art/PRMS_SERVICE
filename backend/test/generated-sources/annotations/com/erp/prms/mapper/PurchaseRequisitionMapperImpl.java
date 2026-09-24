package com.erp.prms.mapper;

import com.erp.prms.dto.request.RequisitionCreateRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import com.erp.prms.entity.ApprovalWorkflow;
import com.erp.prms.entity.PurchaseRequisition;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-15T16:37:09+0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Ubuntu)"
)
@Component
public class PurchaseRequisitionMapperImpl implements PurchaseRequisitionMapper {

    @Override
    public PurchaseRequisition toEntity(RequisitionCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        PurchaseRequisition purchaseRequisition = new PurchaseRequisition();

        purchaseRequisition.setRequesterEmployeeId( request.getRequesterEmployeeId() );
        purchaseRequisition.setDepartmentCode( request.getDepartmentCode() );
        purchaseRequisition.setPurpose( request.getPurpose() );
        purchaseRequisition.setItemDetails( request.getItemDetails() );
        purchaseRequisition.setEstimatedAmount( request.getEstimatedAmount() );
        purchaseRequisition.setRequiredByDate( request.getRequiredByDate() );

        return purchaseRequisition;
    }

    @Override
    public RequisitionResponse toResponse(PurchaseRequisition entity) {
        if ( entity == null ) {
            return null;
        }

        RequisitionResponse requisitionResponse = new RequisitionResponse();

        requisitionResponse.setApprovalWorkflowId( entityApprovalWorkflowId( entity ) );
        requisitionResponse.setId( entity.getId() );
        requisitionResponse.setRequisitionNumber( entity.getRequisitionNumber() );
        requisitionResponse.setRequesterEmployeeId( entity.getRequesterEmployeeId() );
        requisitionResponse.setDepartmentCode( entity.getDepartmentCode() );
        requisitionResponse.setPurpose( entity.getPurpose() );
        requisitionResponse.setItemDetails( entity.getItemDetails() );
        requisitionResponse.setEstimatedAmount( entity.getEstimatedAmount() );
        requisitionResponse.setStatus( entity.getStatus() );
        requisitionResponse.setRequiredByDate( entity.getRequiredByDate() );
        requisitionResponse.setCreatedAt( entity.getCreatedAt() );

        return requisitionResponse;
    }

    private Long entityApprovalWorkflowId(PurchaseRequisition purchaseRequisition) {
        ApprovalWorkflow approvalWorkflow = purchaseRequisition.getApprovalWorkflow();
        if ( approvalWorkflow == null ) {
            return null;
        }
        return approvalWorkflow.getId();
    }
}
