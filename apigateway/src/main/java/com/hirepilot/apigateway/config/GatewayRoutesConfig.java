package com.hirepilot.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.preserveHostHeader;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

@Configuration
public class GatewayRoutesConfig {

    @Value("${app.auth-service-url}")
    private String authServiceUrl;

    @Bean
    public RouterFunction<ServerResponse> oauth2Routes() {
        return route("oauth2-route")
                .route(RequestPredicates.path("/oauth2/**"), http())
                .before(uri(authServiceUrl))
                .before(preserveHostHeader())
                .build()
                .and(route("login-route")
                        .route(RequestPredicates.path("/login/oauth2/**"), http())
                        .before(uri(authServiceUrl))
                        .before(preserveHostHeader())
                        .build());
    }
}
