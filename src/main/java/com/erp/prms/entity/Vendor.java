package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import com.erp.prms.entity.enums.PaymentTerms;
import com.erp.prms.entity.enums.VendorType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "vendors")
public class Vendor extends BaseEntity {
    @Column(nullable = false, unique = true, length = 50) private String vendorCode;
    @Column(nullable = false, length = 200) private String name;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private VendorType vendorType;
    @Column(unique = true, length = 50) private String taxIdentificationNumber;
    @Column(length = 100) private String email;
    @Column(length = 30) private String phone;
    @Column(length = 500) private String address;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private PaymentTerms paymentTerms = PaymentTerms.NET_30;
    @Column(nullable = false) private boolean blacklisted;
    @Column(nullable = false, precision = 5, scale = 2) private BigDecimal performanceScore = BigDecimal.ZERO;
    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true) private List<VendorContact> contacts = new ArrayList<>();
}
