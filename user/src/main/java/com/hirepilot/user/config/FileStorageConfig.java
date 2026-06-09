package com.hirepilot.user.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    private static final String UPLOAD_DIR =
            "uploads/resumes";

    @PostConstruct
    public void init() {

        try {

            Files.createDirectories(
                    Paths.get(UPLOAD_DIR)
            );

        } catch (IOException ex) {

            throw new RuntimeException(
                    "Could not create upload directory"
            );
        }
    }
}