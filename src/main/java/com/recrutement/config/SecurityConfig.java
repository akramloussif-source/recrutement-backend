package com.recrutement.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfig()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/offres/search").permitAll()
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/offres/**").permitAll()
                        // candidat only
                        .requestMatchers("/api/candidatures/postuler").
                        hasRole("CANDIDAT")
                        .requestMatchers("/api/candidatures/mes-candidatures")
                        .hasRole("CANDIDAT")
                        .requestMatchers("/api/entretiens/mes-entretiens")
                        .hasRole("CANDIDAT")
                        // recruteur only
                        .requestMatchers("/api/offres/creer").hasRole("RECRUTEUR")
                        .requestMatchers("/api/offres/*/modifier")
                        .hasRole("RECRUTEUR")
                        .requestMatchers("/api/offres/*/cloturer")
                        .hasRole("RECRUTEUR")
                        .requestMatchers("/api/entretiens/planifier")
                        .hasRole("RECRUTEUR")
                        .requestMatchers("/api/evaluations/**")
                        .hasRole("RECRUTEUR")
                        // tout le reste : authentifié
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfig() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(
                List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}