package com.erp.prms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("PRMS API - Purchase Requisition Management System")
                .version("1.0.0")
                .description("""
                    Complete API documentation for PRMS - handles procurement lifecycle from requisition to invoice.
                    
                    🔐 **Quick Authorization:**
                    1. Click 'Authorize' button below
                    2. Select 'Bearer Authentication'
                    3. Get token: POST to /realms/prms/protocol/openid-connect/token
                    4. Use credentials: procurement_admin/admin123
                    
                    📊 **Real Data:**
                    - All endpoints return live database data
                    - No mock or dummy data used
                    - 5 vendors and 5 requisitions available for testing
                    """)
            )
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Local Development Server")
            ))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Enter JWT Bearer token. Get it from: POST http://localhost:8180/realms/prms/protocol/openid-connect/token")
                )
            );
    }
}