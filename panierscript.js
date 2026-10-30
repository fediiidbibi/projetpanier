// Produits de démonstration : modifiez les noms, prix et images selon votre projet.
const products = [
  {id:1, name:"Bibliothèque", detail:"Bois naturel · Blanc", price:119.990, icon:"▤", qty:1},
  {id:2, name:"Table ronde", detail:"Bois et finition blanche", price:74.990, icon:"◯", qty:1},
  {id:3, name:"Chaise scandinave", detail:"Bois naturel · Beige", price:34.990, icon:"♧", qty:1}
];
const DELIVERY_FEE = 7;
const money = value => value.toFixed(3).replace(".", ",") + " DT";
const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("item-count");
const shippingNote = document.getElementById("shipping-note");
const toast = document.getElementById("toast");

function getSubtotal(){
  return products.reduce((sum, product) => sum + product.price * product.qty, 0);
}
function getDeliveryFee(){
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  return delivery === "delivery" && products.length > 0 ? DELIVERY_FEE : 0;
}
function renderCart(){
  cartItems.innerHTML = "";
  const isEmpty = products.length === 0;
  emptyCart.hidden = !isEmpty;
  cartItems.hidden = isEmpty;
  document.getElementById("clear-cart").hidden = isEmpty;

  products.forEach(product => {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.innerHTML = `
      <div class="product-image"><div class="product-placeholder">${product.icon}</div></div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.detail}</p>
        <span class="unit-price">${money(product.price)} / unité</span>
      </div>
      <div class="qty-control" aria-label="Quantité">
        <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuer">−</button>
        <span>${product.qty}</span>
        <button type="button" data-action="increase" data-id="${product.id}" aria-label="Augmenter">+</button>
      </div>
      <div class="item-end">
        <div class="item-price">${money(product.price * product.qty)}</div>
        <button class="remove-button" type="button" data-action="remove" data-id="${product.id}">Supprimer</button>
      </div>`;
    cartItems.appendChild(article);
  });

  const subtotal = getSubtotal();
  const fee = getDeliveryFee();
  subtotalEl.textContent = money(subtotal);
  shippingEl.textContent = fee === 0 ? "Gratuit" : money(fee);
  totalEl.textContent = money(subtotal + fee);
  countEl.textContent = `(${products.reduce((sum,p) => sum + p.qty, 0)})`;
  shippingNote.textContent = fee ? "Frais fixes de livraison : 7,000 DT." : "Le retrait en boutique est gratuit.";
}

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if(!button) return;
  const id = Number(button.dataset.id);
  const product = products.find(item => item.id === id);
  if(!product) return;

  if(button.dataset.action === "increase") product.qty++;
  if(button.dataset.action === "decrease") product.qty = Math.max(1, product.qty - 1);
  if(button.dataset.action === "remove"){
    const index = products.findIndex(item => item.id === id);
    products.splice(index, 1);
    showToast("Produit supprimé du panier.");
  }
  renderCart();
});

document.querySelectorAll('input[name="delivery"]').forEach(input => {
  input.addEventListener("change", renderCart);
});

document.getElementById("clear-cart").addEventListener("click", () => {
  products.splice(0, products.length);
  renderCart();
  showToast("Votre panier a été vidé.");
});

document.getElementById("continue-shopping").addEventListener("click", () => {
  showToast("Ajoutez vos produits depuis la page Collection.");
});

document.getElementById("checkout").addEventListener("click", () => {
  if(products.length === 0){
    showToast("Votre panier est vide.");
    return;
  }
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const deliveryText = delivery === "delivery" ? "Livraison à domicile" : "Retrait sur place";
  const paymentText = payment === "delivery" ? "Paiement à la livraison" : "Paiement sur place";
  alert(`Commande enregistrée (simulation) !\n${deliveryText}\n${paymentText}\nTotal : ${totalEl.textContent}`);
});

renderCart();
