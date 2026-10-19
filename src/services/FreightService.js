class FreightService {
  constructor() {
    
    this.rates = {
      sudeste: [20, 4], sul: [28, 5], 'centro-oeste': [35, 6],
      nordeste: [45, 7], norte: [60, 9], default: [50, 8]
    };
  }
  calculate(order) {
    if (order.couponCode === 'FRETEGRATIS') return 0;
    const region = order.customer.getShippingRegion();
    const [fixed, perKg] = this.rates[region] || this.rates.default;
    return fixed + order.getTotalWeight() * perKg;
  }
}
module.exports = FreightService;
