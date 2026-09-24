package com.erp.prms.service.receiving;

import com.erp.prms.dto.request.GoodsReceiptRequest;
import com.erp.prms.dto.response.GoodsReceiptResponse;

import java.util.List;

public interface GoodsReceiptService {
    GoodsReceiptResponse record(GoodsReceiptRequest request);
    GoodsReceiptResponse getById(Long id);
    List<GoodsReceiptResponse> listAll();
}
