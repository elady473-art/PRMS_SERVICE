package com.erp.prms.mapper;

import com.erp.prms.dto.request.VendorCreateRequest;
import com.erp.prms.dto.response.VendorResponse;
import com.erp.prms.entity.Vendor;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-15T16:37:08+0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.11 (Ubuntu)"
)
@Component
public class VendorMapperImpl implements VendorMapper {

    @Override
    public Vendor toEntity(VendorCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Vendor vendor = new Vendor();

        vendor.setName( request.getName() );
        vendor.setVendorType( request.getVendorType() );
        vendor.setTaxIdentificationNumber( request.getTaxIdentificationNumber() );
        vendor.setEmail( request.getEmail() );
        vendor.setPhone( request.getPhone() );
        vendor.setAddress( request.getAddress() );
        vendor.setPaymentTerms( request.getPaymentTerms() );

        return vendor;
    }

    @Override
    public VendorResponse toResponse(Vendor entity) {
        if ( entity == null ) {
            return null;
        }

        VendorResponse vendorResponse = new VendorResponse();

        vendorResponse.setId( entity.getId() );
        vendorResponse.setVendorCode( entity.getVendorCode() );
        vendorResponse.setName( entity.getName() );
        vendorResponse.setVendorType( entity.getVendorType() );
        vendorResponse.setTaxIdentificationNumber( entity.getTaxIdentificationNumber() );
        vendorResponse.setEmail( entity.getEmail() );
        vendorResponse.setPhone( entity.getPhone() );
        vendorResponse.setAddress( entity.getAddress() );
        vendorResponse.setPaymentTerms( entity.getPaymentTerms() );
        vendorResponse.setBlacklisted( entity.isBlacklisted() );
        vendorResponse.setPerformanceScore( entity.getPerformanceScore() );

        return vendorResponse;
    }
}
