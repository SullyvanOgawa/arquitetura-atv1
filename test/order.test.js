const test = require('node:test');
const assert = require('node:assert/strict');
const ProductRepository = require('../src/repositories/ProductRepository');
const OrderRepository = require('../src/repositories/OrderRepository');
const OrderService = require('../src/services/OrderService');
const OrderValidator = require('../src/services/OrderValidator');
const DiscountService = require('../src/services/DiscountService');
const FreightService = require('../src/services/FreightService');
const PaymentService = require('../src/services/PaymentService');
const Customer = require('../src/domain/Customer');
const Address = require('../src/domain/Address');
const OrderItem = require('../src/domain/OrderItem');
const Order = require('../src/domain/Order');
function setup(method = 'credit_card', coupon = 'TECH10', installments = 3) {
  const products = new ProductRepository();
  const orders = new OrderRepository();
  const notices = [];
  const service = new OrderService({
    validator: new OrderValidator(products), discountService: new DiscountService(),
    freightService: new FreightService(), paymentService: new PaymentService(),
    productRepository: products, orderRepository: orders,
    notificationService: { sendOrderConfirmation: (...args) => notices.push(args) },
    logger: { info() {}, warn() {} }
  });
  const customer = new Customer('c1', 'Ana', 'ana@example.com', '123', 'vip',
    new Address('Rua','1','Prudente','SP','19000','sudeste'));
  const order = new Order('o1',customer,[new OrderItem(products.findById('p1'),1), new OrderItem(products.findById('p2'),2)],coupon,method,installments);
  return { service, products, orders, notices, order };
}
test('cartao preserva valor e movimenta estoque', () => {
  const t = setup();
  const log = console.log; console.log = () => {};
  let result; try { result = t.service.process(t.order); } finally { console.log = log; }
  assert.equal(result.total, 5471.80);
  assert.equal(result.status,'confirmed');
  assert.equal(t.products.findById('p1').stock,7);
  assert.equal(t.products.findById('p2').stock,28);
  assert.equal(t.orders.findAll().length,1);
  assert.equal(t.notices.length,1);
});
test('boleto aguarda pagamento e nao notifica', () => {
  const t = setup('boleto');
  const log=console.log; console.log=()=>{};
  let result; try {result=t.service.process(t.order);} finally {console.log=log;}
  assert.equal(result.status,'waiting_payment');
  assert.equal(t.notices.length,0);
});
test('pedido invalido nao altera estoque', () => {
  const t=setup(); t.order.items[0].quantity=900;
  assert.throws(()=>t.service.process(t.order), /Estoque insuficiente/);
  assert.equal(t.products.findById('p1').stock,8);
});
test('pix aplica desconto adicional', () => {
  const t=setup('pix'); const log=console.log;console.log=()=>{};
  let result;try {result=t.service.process(t.order);} finally {console.log=log;}
  assert.equal(result.total, 5117.60);
});
test('cupom frete gratis zera frete', () => {
  const t=setup('credit_card','FRETEGRATIS'); const log=console.log;console.log=()=>{};
  let result;try {result=t.service.process(t.order);} finally {console.log=log;}
  assert.equal(result.freight,0);
});
