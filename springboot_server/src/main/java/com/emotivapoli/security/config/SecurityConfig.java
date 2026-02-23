package com.emotivapoli.security.config;

import com.emotivapoli.security.filter.SecurityFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // ── Endpoints públicos (sin token) ───────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // refresh y logout sin access token: solo necesitan la cookie
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/profile/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/pistas/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/clubs/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/clases/**").permitAll()
                        .requestMatchers(HttpMethod.GET,  "/api/health/**").permitAll()

                        // ── Solo ADMIN ───────────────────────────────────────────────
                        .requestMatchers(HttpMethod.GET,   "/api/usuarios").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,   "/api/usuarios/role/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,  "/api/usuarios").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/soft-delete").hasRole("ADMIN")

                        // ── Cualquier usuario autenticado ────────────────────────────
                        .requestMatchers(HttpMethod.GET, "/api/usuario").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").authenticated()
                        .anyRequest().authenticated()
                )
                // 401 para no autenticados (sin token), 403 para sin permisos
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\": \"No autenticado. Token requerido.\"}");
                        })
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * CORS: permite cookies (withCredentials) desde el cliente React.
     * En producción cambiar "*" por la URL exacta del frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",   // Vite dev
                "http://localhost:3000",   // Create React App / alternativo
                "http://localhost:3002",   // Docker React container
                "http://localhost:80"      // Nginx producción Docker
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);   // obligatorio para cookies HttpOnly

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(16, 32, 1, 65536, 3);
    }
}
