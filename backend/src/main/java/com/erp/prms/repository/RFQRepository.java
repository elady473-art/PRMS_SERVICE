package com.erp.prms.repository;

import com.erp.prms.entity.RFQ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RFQRepository extends JpaRepository<RFQ, Long> {
    Optional<RFQ> findByRfqNumber(String rfqNumber);
    List<RFQ> findByPurchaseRequisitionId(Long purchaseRequisitionId);
    List<RFQ> findByActiveTrueOrderBySubmissionDeadlineAsc();
}
