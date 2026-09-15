package com.erp.prms.mapper;

import com.erp.prms.dto.request.VendorCreateRequest;
import com.erp.prms.dto.response.VendorResponse;
import com.erp.prms.entity.Vendor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VendorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "vendorCode", ignore = true)
    @Mapping(target = "blacklisted", ignore = true)
    @Mapping(target = "performanceScore", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    Vendor toEntity(VendorCreateRequest request);

    VendorResponse toResponse(Vendor entity);
}
