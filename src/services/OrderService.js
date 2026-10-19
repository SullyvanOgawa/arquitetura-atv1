class OrderService {
  constructor({ validator, discountService, freightService, paymentService,
    productRepository, orderRepository, notificationService, logger }) {
    this.validator = validator;
    this.discountService = discountService;
    this.freightService = freightService;
    this.paymentService = paymentService;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.logger = logger;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);
    this.validator.validate(order);

    const subtotal = order.getSubtotal();
    const freight = this.freightService.calculate(order);
    const payment = this.paymentService.process(order, subtotal);
    const discount = this.discountService.calculate(order, subtotal) + payment.discount;
    const paymentFee = payment.fee;
    const total = Number((subtotal - discount + freight + paymentFee).toFixed(2));
    if (total <= 0) throw new Error('Total do pedido invalido.');

    for (const item of order.items) {
      this.productRepository.updateStock(item.product.id, item.quantity);
    }
    order.status = payment.status === 'approved' ? 'confirmed' : 'waiting_payment';

    const address = order.customer.getShippingAddress();
    const summary = {
      id: order.id,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      city: address.city,
      state: address.state,
      items: order.items.map(item => ({
        productId: item.product.id, name: item.product.name,
        quantity: item.quantity, subtotal: item.getSubtotal()
      })),
      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };
    this.orderRepository.save(summary);
    if (order.status === 'confirmed') {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, total);
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }
    console.log('Resumo do pedido');
    console.log(`Cliente: ${summary.customerName}`);
    console.log(`Cidade: ${summary.city}/${summary.state}`);
    console.log(`Itens: ${order.getTotalItems()}`);
    console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`Desconto: R$ ${discount.toFixed(2)}`);
    console.log(`Frete: R$ ${freight.toFixed(2)}`);
    console.log(`Taxas: R$ ${paymentFee.toFixed(2)}`);
    console.log(`Total: R$ ${total.toFixed(2)}`);
    return summary;
  }
}
module.exports = OrderService;
