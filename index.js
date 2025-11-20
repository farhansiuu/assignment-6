const categoryList = document.getElementById('category-list');
const plantsContainer = document.getElementById('plants-container');
const cartList = document.getElementById('cart');
const totalPrice = document.getElementById('total');

let cart = [];
let activeCategory = null;


fetch('https://openapi.programming-hero.com/api/categories')
  .then(res => res.json())
  .then(data => {
    categoryList.innerHTML = '';
    data.categories.forEach(carts => {
      const li = document.createElement('li');
      const name = carts?.category ; 
      const id = carts.id ;

      li.innerHTML = `
        <button 
          id="cart-${id}"
          class="w-full text-left py-1 rounded hover:text-green-600 no-underline"
          onclick="loadCategory(${id})"
        >
          ${name}
        </button>`;
      categoryList.appendChild(li);
    });
  })
  .catch(err => console.error("Category fetch error:", err));


fetch('https://openapi.programming-hero.com/api/plants')
  .then(res => res.json())
  .then(data => displayPlants(data.plants))
  .catch(err => console.error("Plants fetch error:", err));

function loadCategory(id) {
 
  if (activeCategory) {
    const prev = document.getElementById(`cat-${activeCategory}`);
    if(prev) prev.classList.remove("bg-green-600", "text-white");
  }
  activeCategory = id;
  document.getElementById(`cart-${id}`).classList.add("bg-green-600", "text-white");

  
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(data => displayPlants(data.data))
    .catch(err => console.error( err));
}

function displayPlants(plants) {
  plantsContainer.innerHTML = '';
  plants.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-white shadow-md rounded-lg p-4';
    const name = p.name ;
    const category = p.category ;
    const price = p.price ?? 0;
    const image = p.image ?? "https://via.placeholder.com/150";

    card.innerHTML = `
      <img src='${image}' class='h-32 w-full object-cover rounded'/>
      <h3 class='font-bold mt-2 cursor-pointer' onclick='showDetail(${p.id})'>${name}</h3>
      <p class='text-sm text-gray-500'>${category}</p>
      <p class='font-semibold mt-1'>${price}৳</p>
      <button onclick='addToCart(${p.id}, "${name}", ${price})' 
        class='mt-2 bg-green-600 text-white w-full py-2 rounded'>
        Add to Cart
      </button>`;
    plantsContainer.appendChild(card);
  });
}

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  renderCart();
}

function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price}৳`;
    cartList.appendChild(li);
  });
  totalPrice.textContent = total;
}

function showDetail(id) {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => alert(JSON.stringify(data.data, null, 2)))
    .catch(err => console.error("Plant detail fetch error:", err));
}
