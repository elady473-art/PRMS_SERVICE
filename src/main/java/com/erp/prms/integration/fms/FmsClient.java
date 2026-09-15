package com.erp.prms.integration.fms;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "fms", url = "${services.fms.url:http://localhost:8083}")
public interface FmsClient {

    @GetMapping("/api/budgets/department/{departmentId}/available")
    Map<String, Object> getAvailableBudget(@PathVariable("departmentId") Long departmentId);
}
