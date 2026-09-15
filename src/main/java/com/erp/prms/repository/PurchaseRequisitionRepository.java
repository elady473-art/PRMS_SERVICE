package com.erp.prms.repository;

import com.erp.prms.entity.PurchaseRequisition;
import com.erp.prms.entity.enums.PRStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseRequisitionRepository extends JpaRepository<PurchaseRequisition, Long> {
    Optional<PurchaseRequisition> findByRequisitionNumber(String requisitionNumber);
    List<PurchaseRequisition> findByRequesterEmployeeIdOrderByCreatedAtDesc(String requesterEmployeeId);
    List<PurchaseRequisition> findByStatusOrderByCreatedAtAsc(PRStatus status);
}
