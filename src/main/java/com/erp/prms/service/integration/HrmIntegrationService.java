package com.erp.prms.service.integration;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HrmIntegrationService {

    private final RestClient restClient;

    public HrmIntegrationService(
            RestClient.Builder builder,
            @Value("${integration.hrm.base-url:http://localhost:8083}") String baseUrl
    ) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public Map<String, Object> getEmployee(String employeeId) {
        return restClient.get()
                .uri("/api/employees/{employeeId}", employeeId)
                .retrieve()
                .body(Map.class);
    }
}
