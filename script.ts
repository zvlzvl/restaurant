interface DishInterface {
    name: string;
    ingredients: string[];
}

const dishes: DishInterface[] = [
    {name: "Toast 🍞", ingredients: ["🍞", "🧈"]},
    {name: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"]},
    {name: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"]},
    {name: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"]},
    {name: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"]},
    {name: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"]},
    {name: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"]},
    {name: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"]},
    {name: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"]},
    {name: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"]}
];
const products: string[] = ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇", "🍜", "🥚",
    "🌿", "🧄", "🧅", "🍚", "🐟", "🥢", "🥑", "🍋", "🌮", "🥩", "🧀", "🥬", "🍅", "🍝", "🌭", "🥕", "🥒", "🧈"];

///_________________________________________///
const topDiv = document.querySelector(".top") as HTMLDivElement;
const productsDiv = document.querySelector(".products") as HTMLDivElement;
const tableLeft = document.querySelector(".left") as HTMLDivElement;
const tableRight = document.querySelector(".right") as HTMLDivElement;
const scoreElement = document.getElementById("score") as HTMLDivElement;
const timerElement = document.getElementById("timer") as HTMLDivElement;
const levelElement = document.getElementById("level") as HTMLDivElement;
const endScreen =document.querySelector(".end-screen") as HTMLDivElement;
let orders: DishInterface[] = [];

let orderPicked: DishInterface|undefined = undefined;
let ingredientsPicked: string[] = [];
let ingredientsNeed: string[] = [];
let score:number = 0;
let timer:number = 120;
let fullOrder: boolean = false;
let ordersCount:number = 1;
let ordersMade:number = 0;
let orderInterval:number;
let ordersInterval: number;
let level:number = 0;
products.forEach(product => {
    productsDiv.innerHTML +=
        `<div class="product">${product}</div>`
})
start();
///-------------start orders----------------
function start() {
    clearAllIntervals();
    endScreen.style.display = "none";
    ordersMade = 0;
    level+=1;
    updateLevel();
    setTimer();
    let i: number = ordersCount;
    ordersInterval = setInterval(() => {
        let dish: DishInterface = dishes[rnd(dishes.length)];
        orders.push(dish);
        i--;
        creatOrderHTML(dish);
        if (i === 0) {
            clearInterval(ordersInterval);
        }
    }, 5000);

}

function addProducts(prod: string) {
    ingredientsPicked.push(prod);
    tableRight.innerHTML = "";
    for (let i = 0; i < ingredientsNeed.length; i++) {
        tableRight.innerHTML +=
            `<div class="text">${ingredientsPicked[i] !== undefined ? ingredientsPicked[i] : "?"}</div>`
    }
    return ingredientsPicked.length !== 0 && JSON.stringify([...ingredientsPicked].sort()) === JSON.stringify([...ingredientsNeed].sort());
}


const productDiv = document.querySelectorAll(".product") as NodeListOf<HTMLDivElement>;

///------------make dish-------------///

productDiv.forEach(product => {
    product.onclick = () => {
        if (typeof product.textContent === "string") {
            fullOrder = addProducts(product.textContent);
        }
        if (fullOrder) {
            ordersMade+=1;
            // @ts-ignore
            let index = orders.findIndex(obj => obj.name === orderPicked.name);
             orders.splice(index, 1);
             score += 1;
             updateScore();

             tableLeft.innerText ='';
             tableRight.innerText ='';
             topDiv.innerHTML='';
             orders.forEach(order => {
                 creatOrderHTML(order);
             })

            if(ordersMade === ordersCount) {
                timer-=10;
                console.log(timer);

                start();
            }
         }

    }
})



function creatOrderHTML(dish: DishInterface) {
    topDiv.innerHTML +=`
            <div class="order flex d-column j-center">
                <div class="circle"></div>
                <div class="text">${dish.name}</div>
            </div>`

    const orderDivs = document.querySelectorAll(".order") as NodeListOf<HTMLDivElement>;
    orderDivs.forEach(order => {

        order.onclick = () => {

            ingredientsPicked = [];
            let selected: string | null = order.children[1].textContent;
            let findDish:DishInterface | undefined = dishes.find(dish => dish.name === selected);
            orderPicked  = findDish;
            // @ts-ignore
            ingredientsNeed = findDish.ingredients.sort();
            tableLeft.innerHTML = "";
            tableRight.innerHTML = "";
            ingredientsNeed.forEach((ingredient) => {
                tableLeft.innerHTML +=
                    `<div class="text">${ingredient}</div>`
                tableRight.innerHTML +=
                   `<div class="text">?</div>`
            })
            clearBorders();
            order.style.border = "1px solid red";

        }
    })

    function clearBorders() {
        orderDivs.forEach(order => {
            order.style.border = "none";
        })
    }

}

function setTimer() {
     let i:number = timer;
      orderInterval = setInterval(() => {
            i--;
            updateTimer(i);
            if (i <= 0) endGame();
        }, 1000);

}

function updateTimer(time:number) {
    // @ts-ignore
    timerElement.textContent = time;
}

function updateScore() {
    // @ts-ignore
    scoreElement.textContent = score;
}
function updateLevel() {
    // @ts-ignore
    levelElement.textContent = level;
}
function rnd(num: number) {
    return Math.floor(Math.random() * num);
}

function endGame() {
    clearAllIntervals();
    // finalScoreElement.textContent = score;
    // gameContainer.style.display = "none";
    endScreen.style.display = "block";

}

function clearAllIntervals() {
    clearInterval(orderInterval);
    clearInterval(ordersInterval);
}