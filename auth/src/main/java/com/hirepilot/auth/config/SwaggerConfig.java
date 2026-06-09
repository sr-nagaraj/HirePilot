package com.hirepilot.auth.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {

        return new OpenAPI()

                .info(
                        new Info()
                                .title("HirePilot Auth Service API")
                                .description("Authentication APIs for HirePilot")
                                .version("1.0")
                                .contact(
                                        new Contact()
                                                .name("Nagaraj")
                                )
                )

                .externalDocs(
                        new ExternalDocumentation()
                                .description("Project Documentation")
                );
    }
}