package com.hirepilot.auth.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader(
                        "Authorization"
                );

        String token = null;
        String email = null;

        if (authHeader != null &&
                authHeader.startsWith(
                        "Bearer "
                )) {

            token =
                    authHeader.substring(7);

            email =
                    jwtTokenProvider
                            .getEmailFromToken(token);
        }

        if (email != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            CustomUserDetails userDetails =
                    (CustomUserDetails)
                            userDetailsService
                                    .loadUserByUsername(email);

            if (jwtTokenProvider
                    .validateToken(token)) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}