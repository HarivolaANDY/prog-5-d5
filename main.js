"use strict";
exports.__esModule = true;
var CoffeMachine_1 = require("./models/CoffeMachine");
var CoffeeMenu_1 = require("./data/CoffeeMenu");
var readline = require("readline");
// Initialisation de la machine à café
var coffeeMachine = new CoffeMachine_1.CoffeeMachine();
// Interface CLI
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Affiche le menu des cafés
function displayMenu() {
    console.log("\n📋 MENU CAFÉ");
    CoffeeMenu_1.COFFEE_MENU.forEach(function (coffee, index) {
        console.log("".concat(index + 1, ". ").concat(coffee.name, " - ").concat(coffee.price.toFixed(2), " \u20AC"));
    });
}
// Demande le choix du café à l'utilisateur
function askForCoffeeChoice() {
    displayMenu();
    rl.question("\n👉 Entrez le numéro de votre choix : ", function (input) {
        var choiceIndex = parseInt(input) - 1;
        var selectedCoffee = CoffeeMenu_1.COFFEE_MENU[choiceIndex];
        if (!selectedCoffee) {
            console.log("❌ Choix invalide.");
            return askForCoffeeChoice();
        }
        askForPayment(selectedCoffee);
    });
}
// Demande le paiement
function askForPayment(coffee) {
    rl.question("\uD83D\uDCB0 Ins\u00E9rez au moins ".concat(coffee.price.toFixed(2), "\u20AC : "), function (input) {
        var amount = parseFloat(input);
        if (!coffeeMachine.validatePayment(amount, coffee)) {
            rl.close();
            return;
        }
        if (!coffeeMachine.canPrepare(coffee)) {
            rl.close();
            return;
        }
        coffeeMachine.prepare(coffee);
        coffeeMachine.showStatus();
        rl.close();
    });
}
// Simulation de tests d'erreurs
function runErrorTests() {
    var espresso = CoffeeMenu_1.COFFEE_MENU[0];
    console.log("\n===========================");
    console.log("🔍 TESTS AUTOMATIQUES DES ERREURS");
    console.log("===========================\n");
    // Paiement insuffisant
    console.log("TEST: Paiement insuffisant");
    var machine1 = new CoffeMachine_1.CoffeeMachine();
    var res1 = machine1.validatePayment(1, espresso);
    console.log("Résultat attendu: false | Reçu:", res1);
    // Plus d’eau
    console.log("\nTEST: Plus d’eau");
    var machine2 = new CoffeMachine_1.CoffeeMachine(20, 100);
    var res2 = machine2.canPrepare(espresso);
    console.log("Résultat attendu: false | Reçu:", res2);
    // Plus de café
    console.log("\nTEST: Plus de café");
    var machine3 = new CoffeMachine_1.CoffeeMachine(1000, 5);
    var res3 = machine3.canPrepare(espresso);
    console.log("Résultat attendu: false | Reçu:", res3);
    // Panne de courant
    console.log("\nTEST: Panne de courant");
    var machine4 = new CoffeMachine_1.CoffeeMachine();
    machine4["powerOn"] = false;
    var res4 = machine4.canPrepare(espresso);
    console.log("Résultat attendu: false | Reçu:", res4);
    // Interface inactive
    console.log("\nTEST: Interface inactive");
    var machine5 = new CoffeMachine_1.CoffeeMachine();
    machine5["interfaceActive"] = false;
    var res5 = machine5.canPrepare(espresso);
    console.log("Résultat attendu: false | Reçu:", res5);
}
// Lancement du programme
console.log("☕ Bienvenue dans la Machine à Café Automatique");
askForCoffeeChoice();
// Lancement des tests d'erreurs après une pause
setTimeout(function () {
    runErrorTests();
}, 1000);
