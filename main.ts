import { CoffeeMachine } from "./models/CoffeeMachine"
import { COFFEE_MENU } from "./data/CoffeeMenu"
import * as readline from "readline"

const coffeeMachine = new CoffeeMachine()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function displayMenu(): void {
  console.log("\n📋 MENU CAFÉ")
  COFFEE_MENU.forEach((coffee, index) => {
    console.log(`${index + 1}. ${coffee.name} - ${coffee.price.toFixed(2)} €`)
  })
}

function askForCoffeeChoice(): void {
  displayMenu()
  rl.question("\n👉 Entrez le numéro de votre choix (ou 'q' pour quitter) : ", (input) => {
    if (input.toLowerCase() === "q") {
      console.log("👋 Merci d'avoir utilisé notre machine à café !")
      rl.close()
      return
    }

    const choiceIndex = Number.parseInt(input) - 1
    const selectedCoffee = COFFEE_MENU[choiceIndex]

    if (!selectedCoffee) {
      console.log("❌ Choix invalide. Veuillez choisir un numéro entre 1 et " + COFFEE_MENU.length)
      return askForCoffeeChoice()
    }

    askForPayment(selectedCoffee)
  })
}

function askForPayment(coffee: any): void {
  rl.question(`💰 Insérez au moins ${coffee.price.toFixed(2)}€ : `, (input) => {
    const amount = Number.parseFloat(input)

    if (isNaN(amount)) {
      console.log("❌ Montant invalide. Veuillez entrer un nombre.")
      return askForPayment(coffee)
    }

    if (!coffeeMachine.validatePayment(amount, coffee)) {
      console.log("🔄 Retour au menu principal...")
      return askForCoffeeChoice()
    }

    if (!coffeeMachine.canPrepare(coffee)) {
      console.log("🔄 Retour au menu principal...")
      return askForCoffeeChoice()
    }

    coffeeMachine.prepare(coffee)

    setTimeout(() => {
      coffeeMachine.showStatus()
      console.log("\n🔄 Retour au menu principal...")
      askForCoffeeChoice()
    }, 2500)
  })
}

function handleEmergency(): void {
  rl.question(
    "\n🚨 Menu de maintenance:\n1. Redémarrer la machine\n2. Simuler panne de courant\n3. Retour normal\nChoix: ",
    (input) => {
      switch (input) {
        case "1":
          coffeeMachine.restart()
          break
        case "2":
          coffeeMachine.simulatePowerOutage()
          break
        case "3":
          break
        default:
          console.log("❌ Choix invalide")
      }
      askForCoffeeChoice()
    },
  )
}

// Gestion des erreurs globales
process.on("uncaughtException", (error) => {
  console.error("🚨 Erreur critique:", error.message)
  console.log("🔧 Veuillez contacter la maintenance")
  rl.close()
})

console.log("☕ Bienvenue dans la Machine à Café Automatique")
console.log("💡 Tapez 'Ctrl+C' puis 'm' pour accéder au menu de maintenance")

// Gestion du Ctrl+C pour le menu de maintenance
rl.on("SIGINT", () => {
  rl.question("\n🔧 Accéder au menu de maintenance ? (m/n): ", (answer) => {
    if (answer.toLowerCase() === "m") {
      handleEmergency()
    } else {
      console.log("👋 Au revoir !")
      rl.close()
    }
  })
})

askForCoffeeChoice()
