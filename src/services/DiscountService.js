class DiscountService {
  constructor() {
    this.customerRates = { vip: 0.08, employee: 0.15 };
    this.couponRates = { TECH10: 0.10 };
  }
  calculate(order, subtotal) {
    const customerRate = this.customerRates[order.customer.type] || 0;
    const couponRate = this.couponRates[order.couponCode] || 0;
    const fixedDiscount = subtotal > 8000 ? 250 : 0;
    return subtotal * (customerRate + couponRate) + fixedDiscount;
  }
}
module.exports = DiscountService;
