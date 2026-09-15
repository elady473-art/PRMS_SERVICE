package com.erp.prms.repository;

import com.erp.prms.entity.ProcurementContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProcurementContractRepository extends JpaRepository<ProcurementContract, Long> {
    Optional<ProcurementContract> findByContractNumber(String contractNumber);
    List<ProcurementContract> findByActiveTrueOrderByStartDateDesc();
    List<ProcurementContract> findByVendorIdOrderByStartDateDesc(Long vendorId);
    List<ProcurementContract> findAllByOrderByStartDateDesc();
}
