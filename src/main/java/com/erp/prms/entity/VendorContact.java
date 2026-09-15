package com.erp.prms.entity;

import com.erp.prms.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "vendor_contacts")
public class VendorContact extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "vendor_id", nullable = false) private Vendor vendor;
    @Column(nullable = false, length = 150) private String fullName;
    @Column(length = 100) private String role;
    @Column(length = 100) private String email;
    @Column(length = 30) private String phone;
    @Column(nullable = false) private boolean primaryContact;
}
