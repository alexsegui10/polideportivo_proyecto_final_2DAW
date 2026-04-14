package com.emotivapoli.pago.presentation.schemas.response;

public class PaymentIntentResponse {

    private String clientSecret;
    private Long reservaId;
    private Long pagoId;

    public PaymentIntentResponse() {}

    public PaymentIntentResponse(String clientSecret, Long reservaId, Long pagoId) {
        this.clientSecret = clientSecret;
        this.reservaId = reservaId;
        this.pagoId = pagoId;
    }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }

    public Long getReservaId() { return reservaId; }
    public void setReservaId(Long reservaId) { this.reservaId = reservaId; }

    public Long getPagoId() { return pagoId; }
    public void setPagoId(Long pagoId) { this.pagoId = pagoId; }
}
