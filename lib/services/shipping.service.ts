export class ShippingService {
  static async calculateShippingCost(method: string): Promise<number> {
    // Mock implementation for shipping cost calculation
    switch (method) {
      case "standard":
        return 5.00;
      case "express":
        return 15.00;
      case "overnight":
        return 25.00;
      default:
        return 0.00;
    }
  }
}