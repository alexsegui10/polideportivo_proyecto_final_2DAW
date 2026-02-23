package com.emotivapoli.auth.presentation.response;

import com.emotivapoli.usuario.presentation.response.UsuarioResponse;

public class AuthResponse {

    /** Access token corto (5-15 min según rol). Va en el body de la respuesta. */
    private String accessToken;
    private UsuarioResponse usuario;

    public AuthResponse() {}

    public AuthResponse(String accessToken, UsuarioResponse usuario) {
        this.accessToken = accessToken;
        this.usuario = usuario;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public UsuarioResponse getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponse usuario) { this.usuario = usuario; }
}
