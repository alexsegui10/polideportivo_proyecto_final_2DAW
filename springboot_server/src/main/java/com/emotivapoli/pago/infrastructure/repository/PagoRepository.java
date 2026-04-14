package com.emotivapoli.pago.infrastructure.repository;

import com.emotivapoli.pago.domain.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByUsuarioId(Long usuarioId);
    Optional<Pago> findByStripePaymentIntentId(String stripePaymentIntentId);
}
