import {
  InsufficientPaymentError,
  OutOfCoffeeError,
  OutOfWaterError,
  InterfaceNotActiveError,
  PowerOutageError,
  UnknownCoffeeTypeError,
} from "../errors/CoffeeMachineErrors"
import type { Coffee } from "../types/Coffee"

export class CoffeeMachine {
  private coffeeLevel = 100 // Pourcentage de café restant
  private waterLevel = 100 // Pourcentage d'eau restante
  private isInterfaceActive = true
  private hasPower = true
  private validCoffeeTypes: string[] = ["espresso", "americano", "cappuccino", "latte"]

  constructor() {
    console.log("🔌 Machine à café initialisée")
  }

  // Vérification de l'état général de la machine
  private checkMachineStatus(): void {
    if (!this.hasPower) {
      throw new PowerOutageError()
    }

    if (!this.isInterfaceActive) {
      throw new InterfaceNotActiveError()
    }
  }

  // Validation du paiement
  validatePayment(amount: number, coffee: Coffee): boolean {
    try {
      this.checkMachineStatus()

      if (amount < coffee.price) {
        throw new InsufficientPaymentError(coffee.price, amount)
      }

      console.log(`✅ Paiement accepté: ${amount.toFixed(2)}€`)
      if (amount > coffee.price) {
        console.log(`💰 Monnaie rendue: ${(amount - coffee.price).toFixed(2)}€`)
      }
      return true
    } catch (error) {
      console.error(`❌ ${error.message}`)
      return false
    }
  }

  // Vérification de la disponibilité des ressources
  canPrepare(coffee: Coffee): boolean {
    try {
      this.checkMachineStatus()

      // Vérifier si le type de café est valide
      if (!this.validCoffeeTypes.includes(coffee.type.toLowerCase())) {
        throw new UnknownCoffeeTypeError(coffee.type)
      }

      // Vérifier les niveaux de ressources
      if (this.coffeeLevel < coffee.coffeeRequired) {
        throw new OutOfCoffeeError()
      }

      if (this.waterLevel < coffee.waterRequired) {
        throw new OutOfWaterError()
      }

      return true
    } catch (error) {
      console.error(`❌ ${error.message}`)
      if (error instanceof OutOfCoffeeError || error instanceof OutOfWaterError) {
        console.log("🔧 Veuillez contacter la maintenance")
      } else if (error instanceof UnknownCoffeeTypeError) {
        console.log("📋 Types de café disponibles:", this.validCoffeeTypes.join(", "))
      }
      return false
    }
  }

  // Préparation du café
  prepare(coffee: Coffee): void {
    try {
      this.checkMachineStatus()

      if (!this.canPrepare(coffee)) {
        return
      }

      console.log(`☕ Préparation de votre ${coffee.name}...`)

      // Consommer les ressources
      this.coffeeLevel -= coffee.coffeeRequired
      this.waterLevel -= coffee.waterRequired

      // Simulation du temps de préparation
      setTimeout(() => {
        console.log(`✅ Votre ${coffee.name} est prêt !`)
      }, 2000)
    } catch (error) {
      console.error(`❌ Impossible de préparer le café: ${error.message}`)
    }
  }

  // Affichage du statut de la machine
  showStatus(): void {
    console.log("\n📊 STATUT DE LA MACHINE")
    console.log(`☕ Niveau de café: ${this.coffeeLevel}%`)
    console.log(`💧 Niveau d'eau: ${this.waterLevel}%`)
    console.log(`🔌 Alimentation: ${this.hasPower ? "OK" : "PANNE"}`)
    console.log(`📱 Interface: ${this.isInterfaceActive ? "ACTIVE" : "INACTIVE"}`)
  }

  // Méthodes pour simuler les pannes (pour les tests)
  simulatePowerOutage(): void {
    this.hasPower = false
    console.log("⚡ Simulation: Panne de courant")
  }

  restorePower(): void {
    this.hasPower = true
    console.log("🔌 Alimentation restaurée")
  }

  deactivateInterface(): void {
    this.isInterfaceActive = false
    console.log("📱 Interface désactivée")
  }

  activateInterface(): void {
    this.isInterfaceActive = true
    console.log("📱 Interface activée")
  }

  setCoffeeLevel(level: number): void {
    this.coffeeLevel = Math.max(0, Math.min(100, level))
  }

  setWaterLevel(level: number): void {
    this.waterLevel = Math.max(0, Math.min(100, level))
  }

  restart(): void {
    console.log("🔄 Redémarrage de la machine...")
    this.isInterfaceActive = true
    this.hasPower = true
    console.log("✅ Machine redémarrée avec succès")
  }
}
