package com.erp.prms.repository;

import com.erp.prms.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByVendorCode(String vendorCode);
    Optional<Vendor> findByTaxIdentificationNumber(String taxIdentificationNumber);
    List<Vendor> findByBlacklistedFalseOrderByNameAsc();
}
