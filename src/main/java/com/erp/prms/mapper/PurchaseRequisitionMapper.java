package com.erp.prms.mapper;

import com.erp.prms.dto.request.RequisitionCreateRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import com.erp.prms.entity.PurchaseRequisition;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PurchaseRequisitionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "requisitionNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approvalWorkflow", ignore = true)
    @Mapping(target = "purchaseOrder", ignore = true)
    PurchaseRequisition toEntity(RequisitionCreateRequest request);

    @Mapping(target = "approvalWorkflowId", source = "approvalWorkflow.id")
    RequisitionResponse toResponse(PurchaseRequisition entity);
}
