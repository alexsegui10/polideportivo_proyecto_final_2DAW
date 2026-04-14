import { apiSpring as api } from '../apiSpring';
import { CreatePaymentIntentRequest, PaymentIntentResponse } from '../../types';

/**
 * Crea una reserva PENDIENTE + un Stripe PaymentIntent.
 * Devuelve el clientSecret que el frontend usa con stripe.confirmCardPayment().
 * La reserva se confirma cuando Stripe llama al webhook /stripe/webhook.
 */
export const createPaymentIntent = async (
  data: CreatePaymentIntentRequest
): Promise<PaymentIntentResponse> => {
  const response = await api.post('/pagos/create-payment-intent', data);
  return response.data;
};
