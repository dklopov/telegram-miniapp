const tg = window.Telegram?.WebApp || { showPopup: d=>alert(d.title+"\n"+d.message), sendData: d=>console.log("sendData:",d) };

let frontendBalance = 85;
let backendBalance = 125;
let cart = [];
let currentCategory = "all";

const categories = [
  {id:"all", name:"All"},
  {id:"vit", name:"Вкусно - и точка"},
  {id:"rostics", name:"Rostics"},
  {id:"vendorApp", name:"Vendor App"},
  {id:"integration", name:"Integration"},
  {id:"admin", name:"RTE Admin"}
];

const products = [
  {id:1,name:"Управление остатками через dc-adapter", description:"Реализация принесет вертикали дополнительные заказы за счет подключения партнеров \"Милти\", \"Азбука Вкуса\", \"Дикси\".", frontend:0, backend:15, category:"integration", effect:"+3700 заказов"},
  {id:2,name:"Конфигуратор периодичности формирования финансовых отчетов", description:"Для запуска \"Вкусно - и точка\" необходимо научиться конфигурировать период генерации финансовых отчетов и отправлять несколько отчетов в рамках недели и месяца.", frontend:3, backend:20, category:"vit", effect:"+16000 заказов"},
  {id:3,name:"Раздел \"Поддержка\" в Vendor App", description:"Для запуска \"Вкусно - и точка\" необходимо реализовать раздел, в рамках которого сотрудники ресторана смогут создать обращение в поддержку \"Магнит Рестораны\".", frontend:5, backend:15, category:"vit", effect:"+16000 заказов"},
  {id:4,name:"Ролевая модель с ограничением доступа к вендорам в Vendor App", description:"Для запуска \"Вкусно - и точка\" необходимо реализовать механизм ограничения доступа к конкретным вендорам.", frontend:0, backend:20, category:"vit", effect:"+16000 заказов"},
  {id:5,name:"Ролевая модель с ограничением доступа к разделам в Vendor App", description:"Для запуска \"Вкусно - и точка\" необходимо реализовать механизм разграничения прав доступа сотрудников ресторанов к разделам и функциям в Vendor App.", frontend:0, backend:20, category:"vit", effect:"+16000 заказов"},
  {id:6,name:"Мобильное приложение Vendor App для Android и iOS", description:"Разработать и опубликовать в сторы версию для мобильных телефонов и планшетов для Android и iOS.", frontend:25, backend:15, category:"vit", effect:"+16000 заказов"},
  {id:7,name:"Раздел \"Отчеты\" в Vendor App", description:"Реализовать в Vendor App раздел \"Отчеты\", интегрированный с сервисом rte-reports, с возможностью скачивания отчетов в формате .excel и подачи апелляций по спорным отчетам.", frontend:5, backend:30, category:"vendorApp", effect:"+200 брендов в 2025"},
  {id:8,name:"Отображение коммерческих условий ресторана в Vendor App", description:"Реализовать в Vendor App информационный блок, отображающий актуальные коммерческие условия ресторана", frontend:5, backend:15, category:"vendorApp", effect:"+2000 брендов в 2026"},
  {id:9,name:"Отключение вендора с указанием причины отключения и автора", description:"Сбор причин отключений позволит RestOps быстрее выявлять системные проблемы (технические сбои, проблемы с каталогом) и сократит среднее время восстановления работы ресторанов.", frontend:5, backend:20, category:"admin", effect:"Улучшение операционных метрик"},
  {id:10,name:"Интеграция с Rostics", description:"Провести комплексное тестирование существующего функционала интеграции и доработать dc-adapter для обеспечения полного цикла работы с партнером.", frontend:0, backend:20, category:"rostics", effect:"+7000 заказов"},
  {id:11,name:"Самовывоз в Vendor App", description:"Реализовать функцонал самовывоза в приложении Vendor App.", frontend:5, backend:15, category:"vendorApp", effect:"+1000 заказов"},
  {id:12,name:"Самовывоз в dc-adapter", description:"Реализовать функцонал самовывоза в dc-adapter.", frontend:2, backend:5, category:"integration", effect:"+1000 заказов"},
  {id:13,name:"Автоматическая генерация зон доставки при создании вендора", description:"Для сокращения времени, требуемого для запуска вендора и автоматизации ручных процессов необходимо автоматизировать процесс генерации зон доставки вендорам сразу после их создания.", frontend:10, backend:20, category:"admin", effect:"-24 часа LeadTime"},
  {id:14,name:"Слотовая доставка", description:"Для запуска \"Grow Food\" необходимо реализовать механизм создания заказа в слот.", frontend:2, backend:3, category:"integration", effect:"+1000 заказов"},
  {id:16,name:"API для внешних витрин", description:"Для запуска внешних витрин в \"ТБанк\", \"ВТБ\" необходимо реализовать сервис и публичный API, позволяющие внешним витринам создавать заказы в OMS RTE и получать актуальную информацию о ресторанах (активность, адрес, график работы, меню и тд).", frontend:10, backend:50, category:"integration", effect:"Ожидаем эффект"},
  {id:17,name:"Ручное редактирование полигона доставки вендора в RTE Admin", description:"Для внесеня корректировок в уже существующие полигоны доставки необходимо иметь интерфейс редактирования в RTE Admin", frontend:5, backend:20, category:"admin", effect:"Улучшение операционных метрик"},
  {id:18,name:"Использование функционала Vendor App ресторанами на интеграции", description:"Для запуска \"Вкусно - и точка\" необходимо реализовать механизм использования функционала Vendor App.", frontend:5, backend:20, category:"vit", effect:"+16000 заказов"},
  {id:19,name:"Получение и передача причин отмен", description:"Для запуска \"Rostics\" необходимо реализовать механизм получения и передачи причин отмен в dc-adapter.", frontend:0, backend:10, category:"rostics", effect:"+7000 заказов"},
  {id:20,name:"Передача дополнительных статусов заказа", description:"Для запуска \"Rostics\" необходимо реализовать механизм передачи дополнительных статусов заказа (курьерских).", frontend:0, backend:10, category:"rostics", effect:"+7000 заказов"},
  {id:21,name:"Функционал retry-заказов", description:"Для масштабирования \"Rostics\" необходимо реализовать повтороной отправки заказа в случае его отмены при создании", frontend:0, backend:20, category:"rostics", effect:"~0,3% FR"},
  {id:22,name:"Прекращение опроса статуса после получение статуса \"Выдан\"", description:"Для запуска \"Rostics\" необходимо реализовать повтороной отправки заказа в случае его отмены при создании", frontend:0, backend:10, category:"rostics", effect:"+7000 заказов"},
  {id:23,name:"Добавление статуса заказа \"Выдан\" в статусную модель RTE", description:"Для запуска \"Rostics\" необходимо добавить новый статус заказа в статусную модель RTE.", frontend:0, backend:10, category:"rostics", effect:"+7000 заказов"}

];

function initApp() { renderCategories(); renderProducts(); updateBalanceDisplay(); setupEventListeners(); }

function renderCategories() {
  document.getElementById("categories").innerHTML = categories.map(c=>`<div class="category ${c.id===currentCategory?"active":""}" data-category="${c.id}">${c.name}</div>`).join("");
}

function renderProducts() {
  const filtered = currentCategory === "all" ? products : products.filter(p => p.category === currentCategory);
  document.getElementById("products").innerHTML = filtered.map(p => {
    const canAdd = frontendBalance >= p.frontend && backendBalance >= p.backend;
    const inCart = cart.find(i => i.product.id===p.id);
    
    return `
      <div class="product-card ${inCart?"in-cart":""} ${!canAdd && !inCart?"unavailable":""}" data-id="${p.id}">
        <div class="product-image">
          <img src="assets/product.png" alt="${p.name}" onerror="this.style.display='none'">
          <div class="product-image-placeholder"></div>
          <div class="product-effect">${p.effect}</div>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-description">${p.description}</div>
          <div class="product-price">
            <span class="chip chip-frontend">Frontend: ${p.frontend}</span>
            <span class="chip chip-backend">Backend: ${p.backend}</span>
          </div>
          ${inCart ? `<div class="product-in-cart">В корзине</div>` : ''}
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
    if(!card) return;
    
    const productId = parseInt(card.dataset.id);
    const inCart = cart.find(i => i.product.id === productId);
    
    if(inCart) {
      removeFromCart(productId);
    } else if(!card.classList.contains("unavailable")) {
      addToCart(productId);
    }
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
    tg.showPopup({title:"Ошибка", message:"Недостаточно ресурсов"});
    return;
  }
  frontendBalance -= product.frontend;
  backendBalance -= product.backend;
  cart.push({product, quantity:1});
  updateBalanceDisplay();
  updateCart();
  renderProducts();
  tg.showPopup({title:"Добавлено", message:`${product.name} добавлена в план`});
}

function removeFromCart(id){
  const index = cart.findIndex(i=>i.product.id===id);
  if(index>-1){
    const product = cart[index].product;
    frontendBalance += product.frontend;
    backendBalance += product.backend;
    cart.splice(index,1);
    updateBalanceDisplay();
    updateCart();
    renderProducts();
    tg.showPopup({title:"Удалено", message:`${product.name} убрана из плана`});
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
      <div class="cart-item-name">${item.product.name}</div>
      <button onclick="removeFromCart(${item.product.id})" style="background:none;border:none;color:red;cursor:pointer;font-size:16px;">✕</button>
    </div>`).join("");

  const totalFrontend = cart.reduce((s,i)=>s+i.product.frontend,0);
  const totalBackend = cart.reduce((s,i)=>s+i.product.backend,0);
  cartTotal.textContent = `Использовано: Frontend ${totalFrontend}, Backend ${totalBackend}`;
  checkoutBtn.disabled = (cart.length===0);
}

function openCart(){ document.getElementById("cartModal").classList.add("active"); }
function closeCart(){ document.getElementById("cartModal").classList.remove("active"); }

async function checkout() {
  try {
    const user = tg.initDataUnsafe?.user || {};
    const response = await fetch("https://webhook.site/8455c2d1-03c4-4cb8-9b8f-8e6d9b483f31", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: cart,
        user: user.first_name || "Anonymous",
        telegramUsername: user.username || "Anonymous"
      })
    });

    if (response.ok) {
      // очистка корзины и восстановление балансов
      cart = [];
      frontendBalance = 85;
      backendBalance = 125;
      updateBalanceDisplay();
      renderProducts();
      closeCart();

      tg.showPopup?.({ title: "Успех", message: "План успешно отправлен!" })
        || alert("Plan sent successfully!");
    } else {
      throw new Error("Request failed with status " + response.status);
    }
  } catch (err) {
    console.error(err);
    tg.showPopup?.({ title: "Ошибка", message: "Не удалось отправить план" })
      || alert("Failed to send plan");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
window.removeFromCart = removeFromCart;