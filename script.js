"use strict";
const dishes = [
    { name: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { name: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { name: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { name: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { name: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { name: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { name: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { name: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { name: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { name: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] }
];
const products = ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇", "🍜", "🥚",
    "🌿", "🧄", "🧅", "🍚", "🐟", "🥢", "🥑", "🍋", "🌮", "🥩", "🧀", "🥬", "🍅", "🍝", "🌭", "🥕", "🥒", "🧈"];
///_________________________________________///
const topDiv = document.querySelector(".top");
const productsDiv = document.querySelector(".products");
const tableLeft = document.querySelector(".left");
const tableRight = document.querySelector(".right");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const levelElement = document.getElementById("level");
const endScreen = document.querySelector(".end-screen");
const saveLoad = document.querySelectorAll(".save");
const startAgain = document.querySelector(".start-again");
let gameData;
if (localStorage.getItem("saveGame") !== null) {
    saveLoad[0].classList.add("d-none");
    saveLoad[1].classList.remove("d-none");
}
else {
    saveLoad[1].classList.add("d-none");
    saveLoad[0].classList.remove("d-none");
    gameData = {
        "orders": [],
        "orderPicked": undefined,
        "ingredientsPicked": [],
        "ingredientsNeed": [],
        "score": 0,
        "timer": 120,
        "fullOrder": false,
        "ordersCount": 3,
        "ordersMade": 0,
        "level": 1,
        "orderInterval": 0,
        "ordersInterval": 0,
    };
    start();
}
/// SAVE
saveLoad[0].onclick = () => {
    clearAllIntervals();
    gameData.ingredientsPicked = [];
    gameData.ingredientsNeed = [];
    gameData.orders = [];
    gameData.ordersCount = 3;
    gameData.ordersMade = 0;
    localStorage.setItem("saveGame", JSON.stringify(gameData));
    saveLoad[0].classList.add("d-none");
    saveLoad[1].classList.remove("d-none");
};
/// LOAD
saveLoad[1].onclick = () => {
    // @ts-ignore
    gameData = JSON.parse(localStorage.getItem("saveGame"));
    console.log(gameData);
    saveLoad[1].classList.add("d-none");
    saveLoad[0].classList.remove("d-none");
    start();
};
startAgain.onclick = () => {
    gameData = {
        "orders": [],
        "orderPicked": undefined,
        "ingredientsPicked": [],
        "ingredientsNeed": [],
        "score": 0,
        "timer": 120,
        "fullOrder": false,
        "ordersCount": 3,
        "ordersMade": 0,
        "level": 1,
        "orderInterval": 0,
        "ordersInterval": 0,
    };
    start();
};
products.forEach(product => {
    productsDiv.innerHTML +=
        `<div class="product">${product}</div>`;
});
///-------------start orders----------------
function start() {
    clearInterval(gameData.orderInterval);
    tableLeft.innerText = '';
    tableRight.innerText = '';
    topDiv.innerHTML = '';
    gameData.orders.forEach(order => {
        creatOrderHTML(order);
    });
    updateLevel();
    endScreen.style.display = "none";
    updateScore();
    setTimer();
    gameData.ordersInterval = setInterval(() => {
        let dish = dishes[rnd(dishes.length)];
        gameData.orders.push(dish);
        gameData.ordersCount -= 1;
        creatOrderHTML(dish);
        if (gameData.ordersCount <= 0) {
            clearInterval(gameData.ordersInterval);
        }
    }, 3000);
}
function addProducts(prod) {
    gameData.ingredientsPicked.push(prod);
    tableRight.innerHTML = "";
    for (let i = 0; i < gameData.ingredientsNeed.length; i++) {
        tableRight.innerHTML +=
            `<div class="text">${gameData.ingredientsPicked[i] !== undefined ? gameData.ingredientsPicked[i] : "?"}</div>`;
    }
    return gameData.ingredientsPicked.length !== 0 && JSON.stringify([...gameData.ingredientsPicked].sort()) === JSON.stringify([...gameData.ingredientsNeed].sort());
}
const productDiv = document.querySelectorAll(".product");
///------------make dish-------------///
productDiv.forEach(product => {
    product.onclick = () => {
        if (typeof product.textContent === "string") {
            gameData.fullOrder = addProducts(product.textContent);
        }
        if (gameData.fullOrder) {
            gameData.ordersMade += 1;
            // @ts-ignore
            let index = gameData.orders.findIndex(obj => obj.name === gameData.orderPicked.name);
            gameData.orders.splice(index, 1);
            gameData.score += 1;
            updateScore();
            gameData.fullOrder = false;
            tableLeft.innerText = '';
            tableRight.innerText = '';
            topDiv.innerHTML = '';
            gameData.orders.forEach(order => {
                creatOrderHTML(order);
            });
            console.log(gameData.ordersMade);
            if (gameData.ordersMade >= 3) {
                gameData.timer -= 10;
                gameData.level += 1;
                gameData.ordersCount = 3;
                start();
            }
        }
    };
});
function creatOrderHTML(dish) {
    topDiv.innerHTML += `
            <div class="order flex d-column j-center">
                <div class="circle"></div>
                <div class="text">${dish.name}</div>
            </div>`;
    const orderDivs = document.querySelectorAll(".order");
    orderDivs.forEach(order => {
        order.onclick = () => {
            gameData.ingredientsPicked = [];
            let selected = order.children[1].textContent;
            let findDish = dishes.find(dish => dish.name === selected);
            gameData.orderPicked = findDish;
            // @ts-ignore
            gameData.ingredientsNeed = findDish.ingredients.sort();
            tableLeft.innerHTML = "";
            tableRight.innerHTML = "";
            gameData.ingredientsNeed.forEach((ingredient) => {
                tableLeft.innerHTML +=
                    `<div class="text">${ingredient}</div>`;
                tableRight.innerHTML +=
                    `<div class="text">?</div>`;
            });
            clearBorders();
            order.style.border = "1px solid red";
        };
    });
    function clearBorders() {
        orderDivs.forEach(order => {
            order.style.border = "none";
        });
    }
}
function setTimer() {
    let i = gameData.timer;
    gameData.orderInterval = setInterval(() => {
        i--;
        updateTimer(i);
        if (i <= 0)
            endGame();
    }, 1000);
}
function updateTimer(time) {
    // @ts-ignore
    timerElement.textContent = time;
}
function updateScore() {
    // @ts-ignore
    scoreElement.textContent = gameData.score;
}
function updateLevel() {
    // @ts-ignore
    levelElement.textContent = gameData.level;
}
function rnd(num) {
    return Math.floor(Math.random() * num);
}
function endGame() {
    clearAllIntervals();
    localStorage.removeItem("saveGame");
    endScreen.style.display = "block";
}
function clearAllIntervals() {
    clearInterval(gameData.orderInterval);
    clearInterval(gameData.ordersInterval);
}
