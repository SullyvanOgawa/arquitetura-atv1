class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }
  getShippingRegion() { return this.address.region; }
  getShippingAddress() { return { city: this.address.city, state: this.address.state }; }
}
module.exports = Customer;
