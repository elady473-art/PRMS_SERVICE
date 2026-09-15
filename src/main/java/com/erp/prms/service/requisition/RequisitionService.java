package com.erp.prms.service.requisition;

import com.erp.prms.dto.request.RequisitionCreateRequest;
import com.erp.prms.dto.response.RequisitionResponse;
import java.util.List;

public interface RequisitionService {

    RequisitionResponse create(RequisitionCreateRequest request);

    RequisitionResponse getById(Long id);

    List<RequisitionResponse> findByRequester(String employeeId);

    List<RequisitionResponse> findAll();

    RequisitionResponse submit(Long id);
}
