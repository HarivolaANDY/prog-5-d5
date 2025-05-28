import { CoffeeType } from "../type/CoffeeType"; 

export class CoffeeMachine {
  private water: number;
  private coffeeBeans: number;
  private powerOn: boolean;
  private interfaceActive: boolean;

  constructor(initialWater = 1000, initialCoffeeBeans = 500) {
    this.water = initialWater;
    this.coffeeBeans = initialCoffeeBeans;
    this.powerOn = true;
    this.interfaceActive = true;
  }

  public validatePayment(amount: number, coffee: CoffeeType): boolean {
    if (amount < coffee.price) {
      console.log("💸 Paiement insuffisant.");
      return false;
    }
    return true;
  }

  public canPrepare(coffee: CoffeeType): boolean {
    if (!this.powerOn) {
      console.log("⚠️ Panne de courant.");
      return false;
    }

    if (!this.interfaceActive) {
      console.log("⚠️ Interface inactive.");
      return false;
    }

    if (this.water < coffee.waterRequired) {
      console.log("🚱 Plus d'eau.");
      return false;
    }

    if (this.coffeeBeans < coffee.coffeeRequired) {
      console.log("☕ Plus de grains de café.");
      return false;
    }

    return true;
  }

  public prepare(coffee: CoffeeType): void {
    this.water -= coffee.waterRequired;
    this.coffeeBeans -= coffee.coffeeRequired;
    console.log(`✅ Votre ${coffee.name} est prêt. Bonne dégustation !`);
  }

  public showStatus(): void {
    console.log(`🔋 Eau: ${this.water}ml | ☕ Café: ${this.coffeeBeans}g`);
  }
}
