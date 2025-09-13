const tg = window.Telegram?.WebApp || { showPopup: d=>alert(d.title+"\n"+d.message), sendData: d=>console.log("sendData:",d) };

let frontendBalance = 50;
let backendBalance = 40;
let cart = [];
let currentCategory = "all";

const categories = [
  {id:"all", name:"All"},
  {id:"frontend", name:"Frontend"},
  {id:"backend", name:"Backend"},
  {id:"common", name:"Common"}
];

const products = [
  {id:1,name:"Authorization", description:"Login and registration module", frontend:3, backend:2, category:"common"},
  {id:2,name:"Homepage", description:"Frontend and logic of main page", frontend:5, backend:2, category:"frontend"},
  {id:3,name:"User API", description:"CRUD for users", frontend:1, backend:4, category:"backend"},
  {id:4,name:"Feedback Form", description:"User interaction form", frontend:2, backend:1, category:"frontend"},
  {id:5,name:"Reports", description:"Report generation module", frontend:2, backend:3, category:"backend"}
];

function initApp() { renderCategories(); renderProducts(); updateBalanceDisplay(); setupEventListeners(); }

function renderCategories() {
  document.getElementById("categories").innerHTML = categories.map(c=>`<div class="category ${c.id===currentCategory?"active":""}" data-category="${c.id}">${c.name}</div>`).join("");
}

function renderProducts() {
  const filtered = currentCategory === "all" ? products : products.filter(p => p.category === currentCategory);
  document.getElementById("products").innerHTML = filtered.map(p => {
    const canAdd = frontendBalance >= p.frontend && backendBalance >= p.backend;
    return `
      <div class="product-card ${cart.find(i => i.product.id===p.id)?"disabled":""} ${!canAdd?"unavailable":""}" data-id="${p.id}">
        <div class="product-image">${p.name}</div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-description">${p.description}</div>
          <div class="product-price">
            <span class="chip chip-frontend">Frontend: ${p.frontend}</span>
            <span class="chip chip-backend">Backend: ${p.backend}</span>
          </div>
        </div>
      </div>`;
  }).join("");
}

function updateBalanceDisplay() {
  document.getElementById("frontendBalanceChip").textContent = `Frontend: ${frontendBalance}`;
  document.getElementById("backendBalanceChip").textContent = `Backend: ${backendBalance}`;
}

function setupEventListeners() {
  document.getElementById("categories").addEventListener("click", e=>{
    const cat = e.target.closest(".category");
    if(cat){ currentCategory=cat.dataset.category; renderCategories(); renderProducts(); }
  });

  document.getElementById("products").addEventListener("click", e=>{
    const card = e.target.closest(".product-card");
    if(card && !card.classList.contains("disabled") && !card.classList.contains("unavailable")) addToCart(parseInt(card.dataset.id));
  });

  document.getElementById("cartButton").addEventListener("click", openCart);
  document.getElementById("cartModal").addEventListener("click", e=>{
    if(e.target===document.getElementById("cartModal")) closeCart();
  });
  document.getElementById("checkoutBtn").addEventListener("click", checkout);
}

function addToCart(id) {
  const product = products.find(p=>p.id===id);
  if(!product || cart.find(i=>i.product.id===id)) return;
  if(frontendBalance<product.frontend || backendBalance<product.backend){
    tg.showPopup({title:"Error", message:"Not enough resources"});
    return;
  }
  frontendBalance -= product.frontend;
  backendBalance -= product.backend;
  cart.push({product, quantity:1});
  updateBalanceDisplay();
  updateCart();
  renderProducts();
  tg.showPopup({title:"Added", message:`${product.name} added to plan`});
}

function removeFromCart(id){
  const index = cart.findIndex(i=>i.product.id===id);
  if(index>-1){
    frontendBalance += cart[index].product.frontend;
    backendBalance += cart[index].product.backend;
    cart.splice(index,1);
    updateBalanceDisplay();
    updateCart();
    renderProducts();
  }
}

function updateCart(){
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  cartCount.textContent = cart.length;
  cartItems.innerHTML = cart.map(item=>`
    <div class="cart-item">
      <div>
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-price">
          <span class="chip chip-frontend">Frontend: ${item.product.frontend}</span>
          <span class="chip chip-backend">Backend: ${item.product.backend}</span>
        </div>
      </div>
      <button onclick="removeFromCart(${item.product.id})" style="background:none;border:none;color:red;cursor:pointer;">✕</button>
    </div>`).join("");

  const totalFrontend = cart.reduce((s,i)=>s+i.product.frontend,0);
  const totalBackend = cart.reduce((s,i)=>s+i.product.backend,0);
  cartTotal.textContent = `Total: Frontend ${totalFrontend}, Backend ${totalBackend}`;
  checkoutBtn.disabled = (cart.length===0);
}

function openCart(){ document.getElementById("cartModal").classList.add("active"); }
function closeCart(){ document.getElementById("cartModal").classList.remove("active"); }

async function checkout() {
  try {
    await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: cart, frontendBalance, backendBalance })
    });

    cart = [];
    frontendBalance = 50;
    backendBalance = 40;
    updateBalanceDisplay();
    updateCart();
    renderProducts();
    closeCart();
    tg.showPopup({ title: "Success", message: "Plan saved to file" });

  } catch (err) {
    console.error(err);
    tg.showPopup({ title: "Error", message: "Failed to save plan" });
  }
}


document.addEventListener("DOMContentLoaded", initApp);
window.removeFromCart = removeFromCart;
