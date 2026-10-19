class PaymentService {
  constructor() {
    this.methods = {
      pix: (order, subtotal) => ({ status: 'approved', fee: 0, discount: subtotal * 0.03 }),
      credit_card: (order, subtotal) => ({
        status: 'approved', fee: order.installments > 1 ? subtotal * 0.025 : 0, discount: 0
      }),
      boleto: () => ({ status: 'waiting_payment', fee: 0, discount: 0 })
    };
  }
  process(order, subtotal) {
    const method = this.methods[order.paymentMethod];
    if (!method) throw new Error('Forma de pagamento invalida.');
    return method(order, subtotal);
  }
}
module.exports = PaymentService;
