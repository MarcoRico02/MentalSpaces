package mx.sisati.sisatibackend.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(new SecurityHeadersFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests((autorize) -> autorize
                        .requestMatchers(HttpMethod.POST, "/auth/login","/psicologos","/propietarios").permitAll() //Solo los metodo POST permitir a todos
                        .requestMatchers(HttpMethod.GET, "/faqs/**").permitAll() //FAQs endpoints son públicos
                        .requestMatchers("/swagger-ui/**","/v3/api-docs/**").permitAll() //Cualquier tipo de metodo, permitir a todo el mundo
                        .requestMatchers(HttpMethod.POST, "/admins").hasRole("ADMIN") //Solo metodo post permitir a Admin
                        .requestMatchers("/actuator/**").hasRole("ADMIN") // Cualquier tipo de metodo permitir solo a admins
                        .anyRequest().authenticated() // Ya todo lo demas, que lo puedan hacer todo el mundo que este logueado
                );
        return http.build();
    }
}