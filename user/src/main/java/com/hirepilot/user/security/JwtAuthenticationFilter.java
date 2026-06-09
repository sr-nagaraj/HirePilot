package com.hirepilot.user.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.management.relation.Role;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;
        Long userId = null;
        String role = null;

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            token = authHeader.substring(7);

            System.out.println("Token: " + token);

            if (jwtTokenProvider.validateToken(token)) {

                email = jwtTokenProvider.getEmailFromToken(token);
                userId = jwtTokenProvider.getUserId(token);
                role = jwtTokenProvider.getRole(token);

                System.out.println("Email = " + email);
                System.out.println("UserId = " + userId);
                System.out.println("Role = " + role);
            }
        }

        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            CustomUserDetails userDetails =
                    new CustomUserDetails(email, userId, role);

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

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            System.out.println("Authentication Set Successfully");
        }

        filterChain.doFilter(request, response);
    }
}

