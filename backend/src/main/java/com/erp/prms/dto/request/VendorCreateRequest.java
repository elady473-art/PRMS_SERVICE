package com.erp.prms.dto.request;

import com.erp.prms.entity.enums.PaymentTerms;
import com.erp.prms.entity.enums.VendorType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class VendorCreateRequest {
    @NotBlank @Size(max = 200) private String name;
    @NotNull private VendorType vendorType;
    @NotBlank @Size(max = 50) private String taxIdentificationNumber;
    @Email @NotBlank private String email;
    @NotBlank @Size(max = 30) private String phone;
    @NotBlank @Size(max = 500) private String address;
    @NotNull private PaymentTerms paymentTerms;
}
