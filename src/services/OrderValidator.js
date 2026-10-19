class OrderValidator {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  validate(order) {
    if (!order.customer) throw new Error('Cliente obrigatorio.');
    if (!order.customer.email || !order.customer.email.includes('@')) throw new Error('E-mail do cliente invalido.');
    if (!order.items || order.items.length === 0) throw new Error('Pedido sem itens.');
    const quantities = {};
    for (const item of order.items) {
      if (!item.product) throw new Error('Item sem produto.');
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error('Quantidade invalida.');
      const id = item.product.id;
      const product = this.productRepository.findById(id);
      if (!product) throw new Error(`Produto ${id} nao encontrado.`);
      quantities[id] = (quantities[id] || 0) + item.quantity;
      if (product.stock < quantities[id]) throw new Error(`Estoque insuficiente para ${product.name}.`);
    }
  }
}
module.exports = OrderValidator;
