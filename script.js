// Ürün verileri (json formatında)
const products = [
    {
        id: 1,
        name: "Kablosuz Kulaklık",
        price: 899.89,
        icon: "fas fa-headphones",
        category: "Elektronik"
    },
    {
        id: 2,
        name: "Akıllı Saat",
        price: 1499.99,
        icon: "fas fa-clock",
        category: "Elektronik"
    },
    {
        id: 3,
        name: "Klavye",
        price: 499.99,
        icon: "fas fa-keyboard",
        category: "Elektronik"
    },
    {
        id: 4,
        name: "Mouse",
        price: 299.99,
        icon: "fas fa-mouse",
        category: "Elektronik"
    },
    {
        id: 5,
        name: "Usb Bellek 128GB",
        price: 199.99,
        icon: "fas fa-save",
        category: "Depolama"
    },
    {
        id: 6,
        name: "Powerbank 20000mAh",
        price: 399.89,
        icon: "fas fa-battery-full",
        category: "Aksesuar"
    }
];

// Sepet verileri
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elementleri

const productsGrid = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Ürünleri göster
function displayProducts() {
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)}₺</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Sepete Ekle
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// Sepete Ekle
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} sepete eklendi`);
}

// Sepeti Güncelle
function updateCart() {
    // localStorage'a Kaydet
    localStorage.setItem('cart', JSON.stringify(cart));

    // Sepet sayacını güncelle
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = `${totalItems} ürün`;

    // Sepet öğelerini göster
    displayCartItems();

    // Toplamları hesapla
    updateTotals();
}

// Sepet öğelerini göster
function displayCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Sepetiniz boş</p>';
        return;
    }

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #eee;
        `;

        cartItem.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="${item.icon}" style="font-size:1.2rem; color: #667eea;"></i>
                <div>
                    <h4 style="margin-bottom:5px;">${item.name}</h4>
                    <p style="color: #667eea; font-weight: bold;">${item.price.toFixed(2)}₺</p>
                </div>
            </div>
            <div style="display:flex; align-items: center; gap:10px;">
                    <button onClick="updateQuantity(${item.id}, -1)" style="padding:5px 10px; background:#f1f2f6; border: none; border-radius: 3px; cursor: pointer;">-</button>
                    <span style="font-weight:bold;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id},1)" style="padding: 5px 10px; background: #f1f2f6; border:none; border-radius:3px; cursor: pointer;">+</button>
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; padding: 5px 10px; background: #ff6b81; color:white; border:none; border-radius: 3px; cursor: pointer;">Sil</button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });
}

// Miktarı güncelle
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id === productId);
        }

        updateCart();
    }
}

// Sepetten çıkar
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Ürün sepetten çıkarıldı!')
}

// Toplamları hesapla
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 29.99;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    subtotalElement.textContent = `${subtotal.toFixed(2)}₺`;
    shippingElement.textContent = `${shipping.toFixed(2)}₺`;
    taxElement.textContent = `${tax.toFixed(2)}₺`;
    totalElement.textContent = `${total.toFixed(2)}₺`;
}

// Bildirim göster
function showNotification(message) {
    // Basit bir bildirim sistemi
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4cd137;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Ödeme butonu event'i
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }

    const total = parseFloat(totalElement.textContent);
    alert(`Ödeme simülasyonu: ${total.toFixed(2)}₺ tutarında ödeme alındı. Teşekkürler!`);
    cart = [];
    updateCart();
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
})
