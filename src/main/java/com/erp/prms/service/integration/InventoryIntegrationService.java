package com.erp.prms.service.integration;

import com.erp.prms.dto.response.InventoryCheckResponse;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class InventoryIntegrationService {

    private final RestClient restClient;

    public InventoryIntegrationService(
            RestClient.Builder builder,
            @Value("${integration.mms.base-url:http://localhost:8081}") String baseUrl
    ) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public InventoryCheckResponse checkAvailability(String itemCode, BigDecimal quantity) {
        InventoryCheckResponse response = restClient.get()
                .uri(uri -> uri.path("/api/inventory/check")
                        .queryParam("itemCode", itemCode)
                        .queryParam("quantity", quantity)
                        .build())
                .retrieve()
                .body(InventoryCheckResponse.class);
        return response == null ? unavailable(itemCode, quantity) : response;
    }

    private InventoryCheckResponse unavailable(String itemCode, BigDecimal quantity) {
        InventoryCheckResponse response = new InventoryCheckResponse();
        response.setItemCode(itemCode);
        response.setRequestedQuantity(quantity);
        response.setAvailable(false);
        response.setReason("MMS returned no availability result");
        return response;
    }
}
