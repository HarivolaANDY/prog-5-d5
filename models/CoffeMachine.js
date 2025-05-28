"use strict";
exports.__esModule = true;
exports.CoffeeMachine = void 0;
var CoffeeMachine = /** @class */ (function () {
    function CoffeeMachine(initialWater, initialCoffeeBeans) {
        if (initialWater === void 0) { initialWater = 1000; }
        if (initialCoffeeBeans === void 0) { initialCoffeeBeans = 500; }
        this.water = initialWater;
        this.coffeeBeans = initialCoffeeBeans;
        this.powerOn = true;
        this.interfaceActive = true;
    }
    CoffeeMachine.prototype.validatePayment = function (amount, coffee) {
        if (amount < coffee.price) {
            console.log("💸 Paiement insuffisant.");
            return false;
        }
        return true;
    };
    CoffeeMachine.prototype.canPrepare = function (coffee) {
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
    };
    CoffeeMachine.prototype.prepare = function (coffee) {
        this.water -= coffee.waterRequired;
        this.coffeeBeans -= coffee.coffeeRequired;
        console.log("\u2705 Votre ".concat(coffee.name, " est pr\u00EAt. Bonne d\u00E9gustation !"));
    };
    CoffeeMachine.prototype.showStatus = function () {
        console.log("\uD83D\uDD0B Eau: ".concat(this.water, "ml | \u2615 Caf\u00E9: ").concat(this.coffeeBeans, "g"));
    };
    return CoffeeMachine;
}());
exports.CoffeeMachine = CoffeeMachine;
