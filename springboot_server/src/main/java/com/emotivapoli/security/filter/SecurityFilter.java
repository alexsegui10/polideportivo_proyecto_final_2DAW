package com.emotivapoli.security.filter;

import com.emotivapoli.auth.application.service.JwtBlacklistService;
import com.emotivapoli.security.service.CustomUserDetailsService;
import com.emotivapoli.security.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final CustomUserDetailsService userDetailsService;
    private final JwtBlacklistService jwtBlacklistService;

    public SecurityFilter(TokenService tokenService,
                          CustomUserDetailsService userDetailsService,
                          JwtBlacklistService jwtBlacklistService) {
        this.tokenService = tokenService;
        this.userDetailsService = userDetailsService;
        this.jwtBlacklistService = jwtBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            var token = authHeader.replace("Bearer ", "");

            // 1. Firma, expiración y usuario existente
            // 2. Blacklist: token revocado explícitamente en logout
            if (tokenService.isTokenValid(token) && !jwtBlacklistService.isBlacklisted(token)) {
                var email = tokenService.extractEmail(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
