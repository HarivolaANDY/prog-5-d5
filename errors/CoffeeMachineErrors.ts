// Classes d'erreurs personnalisées pour la machine à café

export class CoffeeMachineError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message)
    this.name = "CoffeeMachineError"
  }
}

export class InsufficientPaymentError extends CoffeeMachineError {
  constructor(required: number, provided: number) {
    super(
      `Paiement insuffisant. Requis: ${required.toFixed(2)}€, fourni: ${provided.toFixed(2)}€`,
      "INSUFFICIENT_PAYMENT",
    )
  }
}

export class OutOfCoffeeError extends CoffeeMachineError {
  constructor() {
    super("Plus de café disponible. Maintenance requise.", "OUT_OF_COFFEE")
  }
}

export class OutOfWaterError extends CoffeeMachineError {
  constructor() {
    super("Plus d'eau disponible. Maintenance requise.", "OUT_OF_WATER")
  }
}

export class InterfaceNotActiveError extends CoffeeMachineError {
  constructor() {
    super("Interface non active. Redémarrage nécessaire.", "INTERFACE_NOT_ACTIVE")
  }
}

export class PowerOutageError extends CoffeeMachineError {
  constructor() {
    super("Panne de courant. Veuillez attendre ou contacter un technicien.", "POWER_OUTAGE")
  }
}

export class UnknownCoffeeTypeError extends CoffeeMachineError {
  constructor(coffeeType: string) {
    super(`Type de café non reconnu: ${coffeeType}`, "UNKNOWN_COFFEE_TYPE")
  }
}
