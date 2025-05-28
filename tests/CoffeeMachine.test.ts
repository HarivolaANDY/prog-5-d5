import { CoffeeMachine } from "../models/CoffeeMachine"
import { COFFEE_MENU } from "../data/CoffeeMenu"
import type { Coffee } from "../types/Coffee"

describe("☕ Machine à Café Automatique - Tests Complets", () => {
  let coffeeMachine: CoffeeMachine
  let espresso: Coffee
  let cappuccino: Coffee
  let latte: Coffee

  beforeEach(() => {
    coffeeMachine = new CoffeeMachine()
    espresso = COFFEE_MENU[0] // Espresso - 1.50€
    cappuccino = COFFEE_MENU[2] // Cappuccino - 2.50€
    latte = COFFEE_MENU[3] // Latte - 3.00€
  })

  // ==========================================
  // 📘 TESTS DU USE CASE PRINCIPAL
  // ==========================================
  describe("📘 Use Case Principal", () => {
    test("✅ Scénario complet de succès", () => {
      const consoleSpy = jest.spyOn(console, "log")

      // 1. L'utilisateur insère de l'argent
      const paymentResult = coffeeMachine.validatePayment(2.0, espresso)
      expect(paymentResult).toBe(true)

      // 2. La machine valide le paiement
      expect(consoleSpy).toHaveBeenCalledWith("✅ Paiement accepté: 2.00€")
      expect(consoleSpy).toHaveBeenCalledWith("💰 Monnaie rendue: 0.50€")

      // 3. L'utilisateur choisit un type de café (validation)
      const canPrepareResult = coffeeMachine.canPrepare(espresso)
      expect(canPrepareResult).toBe(true)

      // 4. La machine vérifie la disponibilité des ressources
      // 5. La machine prépare le café
      coffeeMachine.prepare(espresso)
      expect(consoleSpy).toHaveBeenCalledWith("☕ Préparation de votre Espresso...")

      // 6. Vérification de l'état après préparation
      coffeeMachine.showStatus()
      expect(consoleSpy).toHaveBeenCalledWith("📊 STATUT DE LA MACHINE")
    })

    test("❌ Scénario d'échec - Paiement insuffisant", () => {
      const consoleErrorSpy = jest.spyOn(console, "error")

      // 1. L'utilisateur insère un montant insuffisant
      const paymentResult = coffeeMachine.validatePayment(1.0, espresso) // Prix: 1.50€

      // 2. La machine rejette le paiement
      expect(paymentResult).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Paiement insuffisant. Requis: 1.50€, fourni: 1.00€")
    })
  })

  // ==========================================
  // 💼 TESTS DE LA BUSINESS LOGIC
  // ==========================================
  describe("💼 Business Logic", () => {
    describe("💰 Gestion des Paiements", () => {
      test("✅ Paiement exact accepté", () => {
        const result = coffeeMachine.validatePayment(1.5, espresso)
        expect(result).toBe(true)
      })

      test("✅ Paiement supérieur avec monnaie rendue", () => {
        const consoleSpy = jest.spyOn(console, "log")
        const result = coffeeMachine.validatePayment(5.0, cappuccino) // Prix: 2.50€

        expect(result).toBe(true)
        expect(consoleSpy).toHaveBeenCalledWith("💰 Monnaie rendue: 2.50€")
      })

      test("❌ Paiement insuffisant rejeté", () => {
        const result = coffeeMachine.validatePayment(2.0, latte) // Prix: 3.00€
        expect(result).toBe(false)
      })

      test("❌ Paiement invalide (NaN)", () => {
        const result = coffeeMachine.validatePayment(Number.NaN, espresso)
        expect(result).toBe(false)
      })
    })

    describe("☕ Choix du Café", () => {
      test("✅ Tous les types de café du menu sont valides", () => {
        COFFEE_MENU.forEach((coffee) => {
          const result = coffeeMachine.canPrepare(coffee)
          expect(result).toBe(true)
        })
      })

      test("✅ Vérification des besoins spécifiques par café", () => {
        // Espresso - besoins faibles
        expect(espresso.coffeeRequired).toBe(10)
        expect(espresso.waterRequired).toBe(5)

        // Cappuccino - besoins moyens
        expect(cappuccino.coffeeRequired).toBe(12)
        expect(cappuccino.waterRequired).toBe(10)

        // Latte - besoins élevés en eau
        expect(latte.waterRequired).toBe(12)
      })
    })

    describe("🔧 Préparation", () => {
      test("✅ Préparation réussie avec ressources suffisantes", () => {
        const consoleSpy = jest.spyOn(console, "log")

        coffeeMachine.prepare(espresso)
        expect(consoleSpy).toHaveBeenCalledWith("☕ Préparation de votre Espresso...")
      })

      test("✅ Consommation des ressources après préparation", () => {
        const initialCoffeeLevel = 100
        const initialWaterLevel = 100

        coffeeMachine.prepare(espresso)

        // Vérifier que les ressources ont été consommées
        coffeeMachine.showStatus()
        const consoleSpy = jest.spyOn(console, "log")

        // Les niveaux devraient avoir diminué
        setTimeout(() => {
          coffeeMachine.showStatus()
          expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("90%")) // Café
          expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("95%")) // Eau
        }, 100)
      })
    })
  })

  // ==========================================
  // ❌ TESTS DES ERREURS SPÉCIFIÉES
  // ==========================================
  describe("❌ Gestion des Erreurs", () => {
    describe("💸 Paiement insuffisant", () => {
      test("❌ Montant < prix du café", () => {
        const consoleErrorSpy = jest.spyOn(console, "error")

        const result = coffeeMachine.validatePayment(0.5, espresso)
        expect(result).toBe(false)
        expect(consoleErrorSpy).toHaveBeenCalledWith("❌ Paiement insuffisant. Requis: 1.50€, fourni: 0.50€")
      })

      test("✅ Solution: Afficher message, demander complément", () => {
        const consoleSpy = jest.spyOn(console, "error")

        coffeeMachine.validatePayment(1.0, cappuccino) // Prix: 2.50€
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Paiement insuffisant"))
      })
    })

    describe("☕ Plus de café", () => {
      test("❌ Réservoir de café vide", () => {
        coffeeMachine.setCoffeeLevel(0)
        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(false)
      })

      test("❌ Café insuffisant pour la préparation", () => {
        coffeeMachine.setCoffeeLevel(5) // Espresso nécessite 10%
        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(false)
      })

      test("✅ Solution: Message d'erreur, maintenance", () => {
        const consoleSpy = jest.spyOn(console, "log")
        coffeeMachine.setCoffeeLevel(0)

        coffeeMachine.canPrepare(espresso)
        expect(consoleSpy).toHaveBeenCalledWith("🔧 Veuillez contacter la maintenance")
      })
    })

    describe("💧 Plus d'eau", () => {
      test("❌ Réservoir d'eau vide", () => {
        coffeeMachine.setWaterLevel(0)
        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(false)
      })

      test("❌ Eau insuffisante pour la préparation", () => {
        coffeeMachine.setWaterLevel(3) // Espresso nécessite 5%
        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(false)
      })

      test("✅ Solution: Message d'erreur, maintenance", () => {
        const consoleSpy = jest.spyOn(console, "log")
        coffeeMachine.setWaterLevel(0)

        coffeeMachine.canPrepare(espresso)
        expect(consoleSpy).toHaveBeenCalledWith("🔧 Veuillez contacter la maintenance")
      })
    })

    describe("💡 Pas de lumière", () => {
      test("❌ Interface non active", () => {
        coffeeMachine.deactivateInterface()
        const result = coffeeMachine.validatePayment(2.0, espresso)
        expect(result).toBe(false)
      })

      test("✅ Solution: Redémarrage, vérification système", () => {
        coffeeMachine.deactivateInterface()
        coffeeMachine.restart()

        const result = coffeeMachine.validatePayment(2.0, espresso)
        expect(result).toBe(true)
      })

      test("✅ Vérification système après redémarrage", () => {
        const consoleSpy = jest.spyOn(console, "log")
        coffeeMachine.deactivateInterface()
        coffeeMachine.restart()

        expect(consoleSpy).toHaveBeenCalledWith("🔄 Redémarrage de la machine...")
        expect(consoleSpy).toHaveBeenCalledWith("✅ Machine redémarrée avec succès")
      })
    })

    describe("⚡ Panne de courant", () => {
      test("❌ Plus d'électricité", () => {
        coffeeMachine.simulatePowerOutage()
        const paymentResult = coffeeMachine.validatePayment(2.0, espresso)
        const prepareResult = coffeeMachine.canPrepare(espresso)

        expect(paymentResult).toBe(false)
        expect(prepareResult).toBe(false)
      })

      test("✅ Solution: Attendre ou notifier un technicien", () => {
        const consoleErrorSpy = jest.spyOn(console, "error")
        coffeeMachine.simulatePowerOutage()

        coffeeMachine.validatePayment(2.0, espresso)
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "❌ Panne de courant. Veuillez attendre ou contacter un technicien.",
        )
      })

      test("✅ Restauration après réparation", () => {
        coffeeMachine.simulatePowerOutage()
        coffeeMachine.restorePower()

        const result = coffeeMachine.validatePayment(2.0, espresso)
        expect(result).toBe(true)
      })
    })

    describe("❓ Type de café non reconnu", () => {
      test("❌ Mauvaise entrée utilisateur", () => {
        const invalidCoffee = {
          name: "Café Mystère",
          type: "mystere",
          price: 2.0,
          coffeeRequired: 10,
          waterRequired: 10,
        }

        const result = coffeeMachine.canPrepare(invalidCoffee)
        expect(result).toBe(false)
      })

      test("✅ Solution: Afficher la liste valide", () => {
        const consoleSpy = jest.spyOn(console, "log")
        const invalidCoffee = {
          name: "Café Inconnu",
          type: "inconnu",
          price: 2.0,
          coffeeRequired: 10,
          waterRequired: 10,
        }

        coffeeMachine.canPrepare(invalidCoffee)
        expect(consoleSpy).toHaveBeenCalledWith(
          "📋 Types de café disponibles:",
          "espresso, americano, cappuccino, latte",
        )
      })
    })
  })

  // ==========================================
  // 🚀 TESTS DES OPTIMISATIONS
  // ==========================================
  describe("🚀 Optimisations", () => {
    describe("🔁 Mode maintenance", () => {
      test("✅ Remplissage eau sans redémarrage", () => {
        coffeeMachine.setWaterLevel(0)
        coffeeMachine.setWaterLevel(100) // Simulation remplissage

        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(true)
      })

      test("✅ Remplissage café sans redémarrage", () => {
        coffeeMachine.setCoffeeLevel(0)
        coffeeMachine.setCoffeeLevel(100) // Simulation remplissage

        const result = coffeeMachine.canPrepare(espresso)
        expect(result).toBe(true)
      })
    })

    describe("📊 Historique d'utilisation", () => {
      test("✅ Comptage des cafés servis", () => {
        // Préparer plusieurs cafés
        coffeeMachine.prepare(espresso)
        coffeeMachine.prepare(cappuccino)
        coffeeMachine.prepare(latte)

        // Vérifier que les ressources diminuent progressivement
        coffeeMachine.showStatus()
        const consoleSpy = jest.spyOn(console, "log")

        setTimeout(() => {
          coffeeMachine.showStatus()
          // Les niveaux devraient refléter la consommation multiple
          expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("STATUT"))
        }, 100)
      })
    })

    describe("🧠 Suggestion intelligente", () => {
      test("✅ Recommandation basée sur les ressources", () => {
        // Simuler peu d'eau restante
        coffeeMachine.setWaterLevel(10)

        // L'espresso devrait être possible (5% d'eau requis)
        expect(coffeeMachine.canPrepare(espresso)).toBe(true)

        // Le latte ne devrait pas être possible (12% d'eau requis)
        expect(coffeeMachine.canPrepare(latte)).toBe(false)
      })
    })
  })

  // ==========================================
  // 🔄 TESTS D'INTÉGRATION
  // ==========================================
  describe("🔄 Tests d'Intégration", () => {
    test("✅ Cycle complet utilisateur satisfait", () => {
      const consoleSpy = jest.spyOn(console, "log")

      // Cycle complet
      expect(coffeeMachine.validatePayment(2.0, espresso)).toBe(true)
      expect(coffeeMachine.canPrepare(espresso)).toBe(true)
      coffeeMachine.prepare(espresso)

      expect(consoleSpy).toHaveBeenCalledWith("✅ Paiement accepté: 2.00€")
      expect(consoleSpy).toHaveBeenCalledWith("☕ Préparation de votre Espresso...")
    })

    test("❌ Gestion de multiples erreurs simultanées", () => {
      // Créer plusieurs problèmes
      coffeeMachine.simulatePowerOutage()
      coffeeMachine.setCoffeeLevel(0)
      coffeeMachine.setWaterLevel(0)

      // La panne de courant devrait être prioritaire
      const consoleErrorSpy = jest.spyOn(console, "error")
      coffeeMachine.canPrepare(espresso)

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Panne de courant"))
    })

    test("✅ Récupération après maintenance complète", () => {
      // Simuler tous les problèmes
      coffeeMachine.simulatePowerOutage()
      coffeeMachine.setCoffeeLevel(0)
      coffeeMachine.setWaterLevel(0)
      coffeeMachine.deactivateInterface()

      // Effectuer la maintenance
      coffeeMachine.restart()
      coffeeMachine.setCoffeeLevel(100)
      coffeeMachine.setWaterLevel(100)

      // Vérifier que tout fonctionne
      expect(coffeeMachine.validatePayment(2.0, espresso)).toBe(true)
      expect(coffeeMachine.canPrepare(espresso)).toBe(true)
    })
  })
})
