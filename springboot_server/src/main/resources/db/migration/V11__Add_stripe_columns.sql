-- Añadir stripe_payment_intent_id a pagos para idempotencia con Stripe
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

-- Constraint de unicidad: evita procesar el mismo PaymentIntent dos veces
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        WHERE c.conname = 'payments_stripe_pi_unique'
          AND t.relname = 'pagos'
    ) THEN
        ALTER TABLE pagos
            ADD CONSTRAINT payments_stripe_pi_unique
            UNIQUE (stripe_payment_intent_id);
    END IF;
END $$;
