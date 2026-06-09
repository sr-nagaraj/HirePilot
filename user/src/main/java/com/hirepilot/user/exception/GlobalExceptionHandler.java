package com.hirepilot.user.exception;

import com.hirepilot.user.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse>
    handleResourceNotFound(
            ResourceNotFoundException ex
    ) {

        ErrorResponse response =
                ErrorResponse.builder()
                        .status(
                                HttpStatus.NOT_FOUND.value()
                        )
                        .error("Resource Not Found")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse>
    handleFileStorageException(
            FileStorageException ex
    ) {

        ErrorResponse response =
                ErrorResponse.builder()
                        .status(
                                HttpStatus.INTERNAL_SERVER_ERROR.value()
                        )
                        .error("File Storage Error")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse>
    handleUnauthorizedException(
            UnauthorizedException ex
    ) {

        ErrorResponse response =
                ErrorResponse.builder()
                        .status(
                                HttpStatus.UNAUTHORIZED.value()
                        )
                        .error("Unauthorized")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ErrorResponse>
    handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        String message =
                ex.getBindingResult()
                        .getFieldError()
                        .getDefaultMessage();

        ErrorResponse response =
                ErrorResponse.builder()
                        .status(
                                HttpStatus.BAD_REQUEST.value()
                        )
                        .error("Validation Error")
                        .message(message)
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse>
    handleGlobalException(
            Exception ex
    ) {

        ErrorResponse response =
                ErrorResponse.builder()
                        .status(
                                HttpStatus.INTERNAL_SERVER_ERROR.value()
                        )
                        .error("Internal Server Error")
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build();

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}