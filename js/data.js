/**
 * data.js — Grocery item dataset & selection state
 */
const GROCERY_ITEMS = [
  { id: 1,  name: 'Milk',      weight: 2, value: 40,  category: 'dairy',   emoji: '🥛' },
  { id: 2,  name: 'Bread',     weight: 3, value: 50,  category: 'bakery',  emoji: '🍞' },
  { id: 4,  name: 'Apple',     weight: 4, value: 60,  category: 'fruits',  emoji: '🍎' },
  { id: 5,  name: 'Cheese',    weight: 1, value: 30,  category: 'dairy',   emoji: '🧀' },
  { id: 6,  name: 'Yogurt',    weight: 2, value: 35,  category: 'dairy',   emoji: '🥣' },
  { id: 7,  name: 'Cookies',   weight: 3, value: 45,  category: 'snacks',  emoji: '🍪' },
  { id: 8,  name: 'Chips',     weight: 2, value: 25,  category: 'snacks',  emoji: '🍟' },
  { id: 9,  name: 'Banana',    weight: 1, value: 20,  category: 'fruits',  emoji: '🍌' },
  { id: 11, name: 'Cake',      weight: 3, value: 75,  category: 'bakery',  emoji: '🍰' },
  { id: 12, name: 'Chocolate', weight: 1, value: 40,  category: 'bakery',  emoji: '🍫' },
  { id: 13, name: 'Cupcake',   weight: 2, value: 30,  category: 'bakery',  emoji: '🧁' },
  { id: 14, name: 'Pie',         weight: 4, value: 65,  category: 'bakery',  emoji: '🥧' },
  { id: 15, name: 'Apple',       weight: 1, value: 15,  category: 'fruits', emoji: '🍎' },
  { id: 16, name: 'Orange',      weight: 1, value: 20,  category: 'fruits', emoji: '🍊' },
  { id: 17, name: 'Grapes',      weight: 2, value: 35,  category: 'fruits', emoji: '🍇' },
  { id: 18, name: 'Strawberry',  weight: 1, value: 40,  category: 'fruits', emoji: '🍓' },
  { id: 19, name: 'Pineapple',   weight: 3, value: 50,  category: 'fruits', emoji: '🍍' },
  { id: 20, name: 'Mango',       weight: 2, value: 45,  category: 'fruits', emoji: '🥭' },
  { id: 21, name: 'Watermelon',  weight: 5, value: 60,  category: 'fruits', emoji: '🍉' },
  { id: 22, name: 'Peach',       weight: 1, value: 25,  category: 'fruits', emoji: '🍑' },
  { id: 23, name: 'Cherry',      weight: 1, value: 30,  category: 'fruits', emoji: '🍒' },
  { id: 24, name: 'Kiwi',        weight: 1, value: 25,  category: 'fruits', emoji: '🥝' },
  { id: 25, name: 'Pear',        weight: 1, value: 20,  category: 'fruits', emoji: '🍐' },
  { id: 26, name: 'Carrot',      weight: 1, value: 15,  category: 'vegetables', emoji: '🥕' },
  { id: 27, name: 'Broccoli',    weight: 2, value: 25,  category: 'vegetables', emoji: '🥦' },
  { id: 28, name: 'Tomato',      weight: 1, value: 10,  category: 'vegetables', emoji: '🍅' },
  { id: 29, name: 'Potato',      weight: 2, value: 15,  category: 'vegetables', emoji: '🥔' },
  { id: 30, name: 'Onion',       weight: 1, value: 10,  category: 'vegetables', emoji: '🧅' },
  { id: 31, name: 'Garlic',      weight: 1, value: 20,  category: 'vegetables', emoji: '🧄' },
  { id: 32, name: 'Corn',        weight: 2, value: 25,  category: 'vegetables', emoji: '🌽' },
  { id: 33, name: 'Spinach',     weight: 1, value: 15,  category: 'vegetables', emoji: '🥬' },
  { id: 34, name: 'Cucumber',    weight: 1, value: 15,  category: 'vegetables', emoji: '🥒' },
  { id: 35, name: 'Brinjal',     weight: 2, value: 20,  category: 'vegetables', emoji: '🍆' },
  { id: 36, name: 'Chili',       weight: 1, value: 30,  category: 'vegetables', emoji: '🌶️' },
  { id: 37, name: 'Capsicum',    weight: 1, value: 20,  category: 'vegetables', emoji: '🫑' },
  { id: 38, name: 'Butter',      weight: 1, value: 35,  category: 'dairy',   emoji: '🧈' },
  { id: 39, name: 'Ice Cream',   weight: 2, value: 45,  category: 'dairy',   emoji: '🍦' },
  { id: 40, name: 'Croissant',   weight: 1, value: 25,  category: 'bakery',  emoji: '🥐' },
  { id: 41, name: 'Baguette',    weight: 2, value: 30,  category: 'bakery',  emoji: '🥖' },
  { id: 42, name: 'Rice',          weight: 5, value: 30,  category: 'grains',   emoji: '🍚' },
  { id: 43, name: 'Wheat',         weight: 5, value: 25,  category: 'grains',   emoji: '🌾' },
  { id: 44, name: 'Flour',         weight: 3, value: 20,  category: 'grains',   emoji: '🥖' },
  { id: 45, name: 'Pasta',         weight: 2, value: 35,  category: 'grains',   emoji: '🍝' },
  { id: 46, name: 'Noodles',       weight: 1, value: 15,  category: 'grains',   emoji: '🍜' },
  { id: 47, name: 'Tortilla',      weight: 1, value: 20,  category: 'grains',   emoji: '🌮' },
  { id: 80, name: 'Pizza',         weight: 3, value: 50,  category: 'grains',   emoji: '🍕' },
  { id: 48, name: 'Canned Beans',  weight: 2, value: 15,  category: 'packaged', emoji: '🫘' },
  { id: 49, name: 'Soup',          weight: 1, value: 25,  category: 'packaged', emoji: '🍲' },
  { id: 50, name: 'Corn Can',      weight: 1, value: 10,  category: 'packaged', emoji: '🌽' },
  { id: 51, name: 'Tuna Can',      weight: 2, value: 40,  category: 'packaged', emoji: '🐟' },
  { id: 52, name: 'Instant Meals', weight: 3, value: 45,  category: 'packaged', emoji: '🍜' },
  { id: 53, name: 'Cereal',        weight: 2, value: 30,  category: 'packaged', emoji: '🥣' },
  { id: 54, name: 'Salt',          weight: 1, value: 5,   category: 'spices',   emoji: '🧂' },
  { id: 55, name: 'Pepper',        weight: 1, value: 10,  category: 'spices',   emoji: '🌶️' },
  { id: 56, name: 'Honey',         weight: 2, value: 50,  category: 'spices',   emoji: '🍯' },
  { id: 57, name: 'Ketchup',       weight: 1, value: 15,  category: 'spices',   emoji: '🍅' },
  { id: 58, name: 'Mayonnaise',    weight: 1, value: 20,  category: 'spices',   emoji: '🥫' },
  { id: 59, name: 'Pickles',       weight: 2, value: 25,  category: 'spices',   emoji: '🫙' },
  { id: 60, name: 'Popcorn',       weight: 1, value: 15,  category: 'snacks',   emoji: '🍿' },
  { id: 61, name: 'Candy',         weight: 1, value: 10,  category: 'snacks',   emoji: '🍬' },
  { id: 62, name: 'Pretzels',      weight: 2, value: 20,  category: 'snacks',   emoji: '🥨' },
  { id: 63, name: 'Nuts',          weight: 1, value: 35,  category: 'snacks',   emoji: '🥜' },
  { id: 64, name: 'Soft Drinks',   weight: 2, value: 20,  category: 'beverages', emoji: '🥤' },
  { id: 65, name: 'Juice',         weight: 1, value: 25,  category: 'beverages', emoji: '🧃' },
  { id: 66, name: 'Coffee',        weight: 1, value: 30,  category: 'beverages', emoji: '☕' },
  { id: 67, name: 'Tea',           weight: 1, value: 15,  category: 'beverages', emoji: '🍵' },
  { id: 68, name: 'Flavored Milk', weight: 2, value: 25,  category: 'beverages', emoji: '🥛' },
  { id: 69, name: 'Bubble Tea',    weight: 1, value: 35,  category: 'beverages', emoji: '🧋' },
  { id: 74, name: 'Soap',          weight: 1, value: 10,  category: 'household', emoji: '🧼' },
  { id: 75, name: 'Shampoo',       weight: 2, value: 25,  category: 'household', emoji: '🧴' },
  { id: 76, name: 'Toothpaste',    weight: 1, value: 15,  category: 'household', emoji: '🪥' },
  { id: 77, name: 'Tissue Paper',  weight: 1, value: 5,   category: 'household', emoji: '🧻' },
  { id: 78, name: 'Dishwash',      weight: 2, value: 20,  category: 'household', emoji: '🧽' },
  { id: 79, name: 'Cleaning Supply',weight: 4, value: 35, category: 'household', emoji: '🧹' },
  { id: 81, name: 'Notebook',      weight: 1, value: 20,  category: 'stationery', emoji: '📓' },
  { id: 82, name: 'A4 Sheets',     weight: 2, value: 15,  category: 'stationery', emoji: '📄' },
  { id: 83, name: 'Sticky Notes',  weight: 1, value: 10,  category: 'stationery', emoji: '📑' },
  { id: 84, name: 'Pencil',        weight: 1, value: 5,   category: 'stationery', emoji: '✏️' },
  { id: 85, name: 'Pen',           weight: 1, value: 10,  category: 'stationery', emoji: '🖊️' },
  { id: 86, name: 'Crayons',       weight: 1, value: 25,  category: 'stationery', emoji: '🖍️' },
  { id: 87, name: 'Marker',        weight: 1, value: 15,  category: 'stationery', emoji: '🖌️' },
  { id: 88, name: 'Ruler',         weight: 1, value: 10,  category: 'stationery', emoji: '📏' },
  { id: 89, name: 'Geometry Box',  weight: 2, value: 40,  category: 'stationery', emoji: '📐' },
  { id: 90, name: 'Paper Clips',   weight: 1, value: 5,   category: 'stationery', emoji: '📎' },
  { id: 91, name: 'Push Pins',     weight: 1, value: 5,   category: 'stationery', emoji: '📌' },
  { id: 92, name: 'Scissors',      weight: 1, value: 25,  category: 'stationery', emoji: '✂️' },
  { id: 93, name: 'Paint Set',     weight: 2, value: 50,  category: 'stationery', emoji: '🎨' },
  { id: 94, name: 'Glue',          weight: 1, value: 15,  category: 'stationery', emoji: '🧴' },
  { id: 95, name: 'Calculator',    weight: 1, value: 60,  category: 'stationery', emoji: '🧮' },
];

let nextId = 96;

/** Current items list (mutable — user can add custom items) */
let groceryItems = [...GROCERY_ITEMS];

/** Set of selected item IDs */
let selectedIds = new Set();

/** Get selected items as array */
function getSelectedItems() {
  return groceryItems.filter(i => selectedIds.has(i.id));
}

/** Get knapsack capacity from input */
function getCapacity() {
  return Math.max(1, parseInt(document.getElementById('knapsack-capacity').value) || 6);
}
