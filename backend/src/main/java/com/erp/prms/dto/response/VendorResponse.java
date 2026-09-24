package com.erp.prms.dto.response;

import com.erp.prms.entity.enums.PaymentTerms;
import com.erp.prms.entity.enums.VendorType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor
public class VendorResponse {
    private Long id;
    private String vendorCode;
    private String name;
    private VendorType vendorType;
    private String taxIdentificationNumber;
    private String email;
    private String phone;
    private String address;
    private PaymentTerms paymentTerms;
    private boolean blacklisted;
    private BigDecimal performanceScore;
}
