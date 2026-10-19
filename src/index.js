const Address = require('./domain/Address');
const Customer = require('./domain/Customer');
const Order = require('./domain/Order');
const OrderItem = require('./domain/OrderItem');
const OrderService = require('./services/OrderService');
const OrderValidator = require('./services/OrderValidator');
const DiscountService = require('./services/DiscountService');
const FreightService = require('./services/FreightService');
const PaymentService = require('./services/PaymentService');
const NotificationService = require('./services/NotificationService');
const ProductRepository = require('./repositories/ProductRepository');
const OrderRepository = require('./repositories/OrderRepository');
const Logger = require('./utils/Logger');

const productRepository = new ProductRepository();
const service = new OrderService({
  validator: new OrderValidator(productRepository),
  discountService: new DiscountService(),
  freightService: new FreightService(),
  paymentService: new PaymentService(),
  productRepository,
  orderRepository: new OrderRepository(),
  notificationService: new NotificationService(),
  logger: new Logger()
});

const customer = new Customer('c1', 'Ana Souza', 'ana.souza@example.com', '18999990000', 'vip',
  new Address('Rua das Palmeiras', '120', 'Presidente Prudente', 'SP', '19000-000', 'sudeste'));
const notebook = productRepository.findById('p1');
const mouse = productRepository.findById('p2');
const order = new Order('o1001', customer,
  [new OrderItem(notebook, 1), new OrderItem(mouse, 2)], 'TECH10', 'credit_card', 3);
const result = service.process(order);
console.log(JSON.stringify(result, null, 2));
