package com.erp.prms.repository;

import com.erp.prms.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    Optional<Quotation> findByQuotationNumber(String quotationNumber);
    List<Quotation> findByRfqIdOrderByTotalAmountAsc(Long rfqId);
    List<Quotation> findByVendorId(Long vendorId);
}
