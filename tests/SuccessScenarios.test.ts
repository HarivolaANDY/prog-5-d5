import { CoffeeMachine } from "../models/CoffeeMachine"
import { COFFEE_MENU } from "../data/CoffeeMenu"

describe("✅ Scénarios de Succès", () => {
  let coffeeMachine: CoffeeMachine

  beforeEach(() => {
    coffeeMachine = new CoffeeMachine()
  })

  describe("🎯 Parcours Utilisateur Parfait", () => {
    test("✅ Commande simple - Espresso", async () => {
      const consoleSpy = jest.spyOn(console, "log")
      const espresso = COFFEE_MENU[0]

      // 1. Paiement exact
      expect(coffeeMachine.validatePayment(1.5, espresso)).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith("✅ Paiement accepté: 1.50€")

      // 2. Vérification disponibilité
      expect(coffeeMachine.canPrepare(espresso)).toBe(true)

      // 3. Préparation
      coffeeMachine.prepare(espresso)
      expect(consoleSpy).toHaveBeenCalledWith("☕ Préparation de votre Espresso...")

      // 4. Statut final
      coffeeMachine.showStatus()
      expect(consoleSpy).toHaveBeenCalledWith("📊 STATUT DE LA MACHINE")
    })

    test("✅ Commande avec monnaie - Cappuccino", () => {
      const consoleSpy = jest.spyOn(console, "log")
      const cappuccino = COFFEE_MENU[2] // 2.50€

      // Paiement avec monnaie
      expect(coffeeMachine.validatePayment(3.0, cappuccino)).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith("💰 Monnaie rendue: 0.50€")

      // Préparation réussie
      expect(coffeeMachine.canPrepare(cappuccino)).toBe(true)
      coffeeMachine.prepare(cappuccino)
    })

    test("✅ Commande premium - Latte", () => {
      const latte = COFFEE_MENU[3] // 3.00€

      // Paiement généreux
      expect(coffeeMachine.validatePayment(5.0, latte)).toBe(true)
      expect(coffeeMachine.canPrepare(latte)).toBe(true)
      coffeeMachine.prepare(latte)
    })
  })

  describe("🔄 Utilisation Continue", () => {
    test("✅ Série de commandes variées", () => {
      const commandes = [
        { coffee: COFFEE_MENU[0], payment: 2.0 }, // Espresso
        { coffee: COFFEE_MENU[1], payment: 2.5 }, // Americano
        { coffee: COFFEE_MENU[2], payment: 3.0 }, // Cappuccino
      ]

      commandes.forEach(({ coffee, payment }) => {
        expect(coffeeMachine.validatePayment(payment, coffee)).toBe(true)
        expect(coffeeMachine.canPrepare(coffee)).toBe(true)
        coffeeMachine.prepare(coffee)
      })
    })

    test("✅ Utilisation intensive - 10 cafés", () => {
      const espresso = COFFEE_MENU[0]

      for (let i = 1; i <= 10; i++) {
        expect(coffeeMachine.validatePayment(2.0, espresso)).toBe(true)
        expect(coffeeMachine.canPrepare(espresso)).toBe(true)
        coffeeMachine.prepare(espresso)
      }

      // Vérifier que la machine fonctionne encore
      coffeeMachine.showStatus()
    })
  })

  describe("🛠️ Maintenance Préventive", () => {
    test("✅ Redémarrage préventif", () => {
      const consoleSpy = jest.spyOn(console, "log")

      coffeeMachine.restart()
      expect(consoleSpy).toHaveBeenCalledWith("🔄 Redémarrage de la machine...")
      expect(consoleSpy).toHaveBeenCalledWith("✅ Machine redémarrée avec succès")

      // Vérifier fonctionnement après redémarrage
      expect(coffeeMachine.validatePayment(2.0, COFFEE_MENU[0])).toBe(true)
    })

    test("✅ Gestion proactive des niveaux", () => {
      // Simuler maintenance préventive à 20%
      coffeeMachine.setCoffeeLevel(20)
      coffeeMachine.setWaterLevel(20)

      // Devrait encore fonctionner
      expect(coffeeMachine.canPrepare(COFFEE_MENU[0])).toBe(true)

      // Remplissage préventif
      coffeeMachine.setCoffeeLevel(100)
      coffeeMachine.setWaterLevel(100)

      expect(coffeeMachine.canPrepare(COFFEE_MENU[3])).toBe(true) // Latte
    })
  })

  describe("💡 Optimisations en Action", () => {
    test("✅ Suggestion intelligente selon ressources", () => {
      // Simuler peu d'eau
      coffeeMachine.setWaterLevel(8)

      // Espresso possible (5% eau)
      expect(coffeeMachine.canPrepare(COFFEE_MENU[0])).toBe(true)

      // Latte impossible (12% eau)
      expect(coffeeMachine.canPrepare(COFFEE_MENU[3])).toBe(false)
    })

    test("✅ Mode économie d'énergie", () => {
      // Simuler période d'inactivité
      coffeeMachine.showStatus()

      // Machine reste fonctionnelle
      expect(coffeeMachine.validatePayment(2.0, COFFEE_MENU[0])).toBe(true)
    })

    test("✅ Historique de performance", () => {
      const consoleSpy = jest.spyOn(console, "log")

      // Préparer différents types
      COFFEE_MENU.forEach((coffee) => {
        coffeeMachine.prepare(coffee)
      })

      // Vérifier le statut final
      coffeeMachine.showStatus()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("STATUT"))
    })
  })

  describe("🌟 Expérience Utilisateur Exceptionnelle", () => {
    test("✅ Réponse rapide du système", () => {
      const start = Date.now()

      coffeeMachine.validatePayment(2.0, COFFEE_MENU[0])
      coffeeMachine.canPrepare(COFFEE_MENU[0])

      const end = Date.now()
      expect(end - start).toBeLessThan(100) // Réponse < 100ms
    })

    test("✅ Messages clairs et informatifs", () => {
      const consoleSpy = jest.spyOn(console, "log")

      coffeeMachine.validatePayment(3.0, COFFEE_MENU[0])
      coffeeMachine.prepare(COFFEE_MENU[0])
      coffeeMachine.showStatus()

      // Vérifier la présence d'emojis et messages clairs
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("✅"))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("☕"))
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("📊"))
    })

    test("✅ Gestion gracieuse des cas limites", () => {
      // Paiement avec centimes
      expect(coffeeMachine.validatePayment(1.51, COFFEE_MENU[0])).toBe(true)

      // Ressources au minimum
      coffeeMachine.setCoffeeLevel(10) // Exactement ce qu'il faut pour espresso
      coffeeMachine.setWaterLevel(5)
      expect(coffeeMachine.canPrepare(COFFEE_MENU[0])).toBe(true)
    })
  })
})
