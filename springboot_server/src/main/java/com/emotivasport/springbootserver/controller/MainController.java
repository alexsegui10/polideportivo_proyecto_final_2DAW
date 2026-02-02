package com.emotivasport.springbootserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MainController {
    
    @GetMapping("/")
    public Map<String, String> root() {
        return Map.of("message", "Bienvenido a Emotiva Poli Spring Boot API");
    }
    
    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        return Map.of("status", "healthy");
    }
}
