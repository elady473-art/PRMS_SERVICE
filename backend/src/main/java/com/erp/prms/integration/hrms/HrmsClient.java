package com.erp.prms.integration.hrms;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "hrms", url = "${services.hrms.url:http://localhost:8081}")
public interface HrmsClient {

    @GetMapping("/api/employees/{id}")
    Map<String, Object> getEmployee(@PathVariable("id") Long id);
}
