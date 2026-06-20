package com.hirepilot.apigateway.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class CookieForwardingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Ensure cookies are passed through to downstream services
        String cookieHeader = request.getHeader("Cookie");
        if (cookieHeader != null) {
            // Log for debugging
            System.out.println("Forwarding cookies: " + cookieHeader);
        }

        filterChain.doFilter(request, response);
    }
}