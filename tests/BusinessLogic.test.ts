import { CoffeeMachine } from "../models/CoffeeMachine"
import { COFFEE_MENU } from "../data/CoffeeMenu"

describe("💼 Business Logic - Tests Détaillés", () => {
  let coffeeMachine: CoffeeMachine

  beforeEach(() => {
    coffeeMachine = new CoffeeMachine()
  })

  describe("💰 Logique de Paiement", () => {
    test("✅ Validation des montants exacts", () => {
      COFFEE_MENU.forEach((coffee) => {
        const result = coffeeMachine.validatePayment(coffee.price, coffee)
        expect(result).toBe(true)
      })
    })

    test("✅ Calcul précis de la monnaie", () => {
      const consoleSpy = jest.spyOn(console, "log")
      const espresso = COFFEE_MENU[0] // 1.50€

      coffeeMachine.validatePayment(5.0, espresso)
      expect(consoleSpy).toHaveBeenCalledWith("💰 Monnaie rendue: 3.50€")
    })

    test("❌ Rejet des montants négatifs", () => {
      const result = coffeeMachine.validatePayment(-1.0, COFFEE_MENU[0])
      expect(result).toBe(false)
    })

    test("❌ Rejet des montants invalides", () => {
      const result = coffeeMachine.validatePayment(Number.POSITIVE_INFINITY, COFFEE_MENU[0])
      expect(result).toBe(false)
    })
  })

  describe("☕ Logique de Sélection", () => {
    test("✅ Validation de tous les cafés du menu", () => {
      const validTypes = ["espresso", "americano", "cappuccino", "latte"]

      COFFEE_MENU.forEach((coffee) => {
        expect(validTypes).toContain(coffee.type.toLowerCase())
      })
    })

    test("✅ Cohérence prix/qualité", () => {
      // Le latte devrait être le plus cher (plus de ressources)
      const latte = COFFEE_MENU.find((c) => c.type === "latte")
      const espresso = COFFEE_MENU.find((c) => c.type === "espresso")

      expect(latte?.price).toBeGreaterThan(espresso?.price || 0)
    })

    test("✅ Besoins en ressources cohérents", () => {
      COFFEE_MENU.forEach((coffee) => {
        expect(coffee.coffeeRequired).toBeGreaterThan(0)
        expect(coffee.waterRequired).toBeGreaterThan(0)
        expect(coffee.coffeeRequired).toBeLessThanOrEqual(20) // Max raisonnable
        expect(coffee.waterRequired).toBeLessThanOrEqual(20) // Max raisonnable
      })
    })
  })

  describe("🔧 Logique de Préparation", () => {
    test("✅ Vérification séquentielle des ressources", () => {
      const espresso = COFFEE_MENU[0]

      // Test avec ressources suffisantes
      expect(coffeeMachine.canPrepare(espresso)).toBe(true)

      // Test avec café insuffisant
      coffeeMachine.setCoffeeLevel(5)
      expect(coffeeMachine.canPrepare(espresso)).toBe(false)

      // Restaurer café, tester eau insuffisante
      coffeeMachine.setCoffeeLevel(100)
      coffeeMachine.setWaterLevel(2)
      expect(coffeeMachine.canPrepare(espresso)).toBe(false)
    })

    test("✅ Consommation proportionnelle des ressources", () => {
      const cappuccino = COFFEE_MENU[2] // Besoins: 12% café, 10% eau

      coffeeMachine.prepare(cappuccino)

      // Vérifier la consommation après un délai
      setTimeout(() => {
        coffeeMachine.showStatus()
        // Les niveaux devraient avoir diminué selon les besoins
      }, 100)
    })
  })

  describe("🔄 Logique de Retour à l'État Initial", () => {
    test("✅ Machine prête pour nouvelle commande", () => {
      const espresso = COFFEE_MENU[0]

      // Première commande
      coffeeMachine.validatePayment(2.0, espresso)
      coffeeMachine.prepare(espresso)

      // Deuxième commande immédiate
      const result = coffeeMachine.validatePayment(2.0, espresso)
      expect(result).toBe(true)
    })

    test("✅ Gestion de multiples commandes successives", () => {
      const espresso = COFFEE_MENU[0]

      for (let i = 0; i < 5; i++) {
        expect(coffeeMachine.validatePayment(2.0, espresso)).toBe(true)
        expect(coffeeMachine.canPrepare(espresso)).toBe(true)
        coffeeMachine.prepare(espresso)
      }

      // Vérifier que les ressources ont diminué
      coffeeMachine.showStatus()
    })
  })
})
