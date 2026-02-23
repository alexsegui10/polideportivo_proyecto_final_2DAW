package com.emotivapoli.profile.domain.dto;

import java.util.UUID;

/**
 * DTO para perfil público del usuario
 */
public class ProfileDTO {

    private UUID uid;
    private String slug;
    private String nombre;
    private String apellidos;
    private String avatar;
    private String role;
    private String bio;
    private String especialidad;
    private String certificaciones;

    // Constructor vacío
    public ProfileDTO() {
    }

    // Constructor completo
    public ProfileDTO(UUID uid, String slug, String nombre, String apellidos, String avatar, 
                     String role, String bio, String especialidad, String certificaciones) {
        this.uid = uid;
        this.slug = slug;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.avatar = avatar;
        this.role = role;
        this.bio = bio;
        this.especialidad = especialidad;
        this.certificaciones = certificaciones;
    }

    // Getters y Setters
    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getCertificaciones() {
        return certificaciones;
    }

    public void setCertificaciones(String certificaciones) {
        this.certificaciones = certificaciones;
    }
}
