package com.erp.prms.service.invoice;

import com.erp.prms.dto.request.InvoiceRequest;
import com.erp.prms.dto.response.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse submit(InvoiceRequest request);
    InvoiceResponse getById(Long id);
    List<InvoiceResponse> listAll();
}
