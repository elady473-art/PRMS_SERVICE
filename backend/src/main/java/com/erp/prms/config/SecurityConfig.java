package com.erp.prms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        String extraOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
        List<String> origins = new ArrayList<>(List.of("http://localhost:3000", "http://localhost:3001"));
        if (extraOrigins != null && !extraOrigins.isBlank()) {
            for (String o : extraOrigins.split(",")) {
                String trimmed = o.trim();
                if (!trimmed.isEmpty()) origins.add(trimmed);
            }
        }
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();
            var realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null) {
                Object rolesObj = realmAccess.get("roles");
                if (rolesObj instanceof List<?> roles) {
                    roles.stream()
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + r))
                            .forEach(authorities::add);
                }
            }
            return authorities;
        });
        converter.setPrincipalClaimName("preferred_username");
        return converter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-resources/**", "/webjars/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/vendors/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER", "SUPPLIER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/vendors").hasRole("PROCUREMENT_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/vendors/**").hasRole("PROCUREMENT_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/vendors/**").hasRole("PROCUREMENT_ADMIN")
                        .requestMatchers("/api/v1/approvals/**").hasRole("PROCUREMENT_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/requisitions").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER")
                        .requestMatchers(HttpMethod.GET, "/api/v1/requisitions/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/requisitions/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER")
                        .requestMatchers("/api/v1/rfqs/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER")
                        .requestMatchers("/api/v1/purchase-orders/**").hasAnyRole("PROCUREMENT_ADMIN", "SUPPLIER")
                        .requestMatchers("/api/v1/goods-receipts/**").hasAnyRole("PROCUREMENT_ADMIN", "SUPPLIER")
                        .requestMatchers("/api/v1/invoices/**").hasAnyRole("PROCUREMENT_ADMIN", "SUPPLIER")
                        .requestMatchers("/api/v1/contracts/**").hasAnyRole("PROCUREMENT_ADMIN", "SUPPLIER")
                        .requestMatchers("/api/v1/quotations/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER", "SUPPLIER")
                        .requestMatchers("/api/v1/dashboard/**").hasAnyRole("PROCUREMENT_ADMIN", "REQUESTER", "SUPPLIER")
                        .requestMatchers("/api/v1/audit-logs/**").hasRole("PROCUREMENT_ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
                .build();
    }
}
