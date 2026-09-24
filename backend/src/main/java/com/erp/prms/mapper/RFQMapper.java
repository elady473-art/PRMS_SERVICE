package com.erp.prms.mapper;

import com.erp.prms.dto.request.RFQCreateRequest;
import com.erp.prms.entity.RFQ;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RFQMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "rfqNumber", ignore = true)
    @Mapping(target = "purchaseRequisition", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "quotations", ignore = true)
    RFQ toEntity(RFQCreateRequest request);
}
