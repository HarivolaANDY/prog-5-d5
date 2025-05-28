import type { Coffee } from "../types/Coffee"

export const COFFEE_MENU: Coffee[] = [
  {
    name: "Espresso",
    type: "espresso",
    price: 1.5,
    coffeeRequired: 10,
    waterRequired: 5,
  },
  {
    name: "Americano",
    type: "americano",
    price: 2.0,
    coffeeRequired: 8,
    waterRequired: 15,
  },
  {
    name: "Cappuccino",
    type: "cappuccino",
    price: 2.5,
    coffeeRequired: 12,
    waterRequired: 10,
  },
  {
    name: "Latte",
    type: "latte",
    price: 3.0,
    coffeeRequired: 10,
    waterRequired: 12,
  },
]
