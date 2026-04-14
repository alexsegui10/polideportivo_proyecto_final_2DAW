package com.emotivapoli.incidencia.presentation.request;

public class IncidenciaCreateRequest {
    private String titulo;
    private String descripcion;
    private String tipo;
    private String prioridad;
    private String pagina;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }

    public String getPagina() { return pagina; }
    public void setPagina(String pagina) { this.pagina = pagina; }
}
