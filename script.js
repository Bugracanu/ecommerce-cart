// Ürün verileri (JSON formatında)
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
        name: "USB Bellek 128GB",
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
    },
    {
        id: 7,
        name: "Web Kamera",
        price: 349.99,
        icon: "fas fa-video",
        category: "Elektronik"
    },
    {
        id: 8,
        name: "Bluetooth Hoparlör",
        price: 599.99,
        icon: "fas fa-volume-up",
        category: "Elektronik"
    },
    {
        id: 9,
        name: "Tablet Standı",
        price: 149.99,
        icon: "fas fa-tablet-alt",
        category: "Aksesuar"
    },
    {
        id: 10,
        name: "USB Hub",
        price: 129.99,
        icon: "fas fa-plug",
        category: "Aksesuar"
    }
];

const coupons = [
    {
        code: "WELCOME10",
        discount: 10,
        type: "percentage",
        description: "Hoşgeldin indirimi -%10",
        minCartAmount: 0
    },
    {
        code: "SAVE20",
        discount: 20,
        type: "percentage",
        description: "Büyük indirim -%20",
        minCartAmount: 200
    },
    {
        code: "FIFTYOFF",
        discount: 50,
        type: "fixed",
        description: "50 TL indirim",
        minCartAmount: 100
    },
    {
        code: "FREESHIP",
        discount: "free-shipping",
        type: "special",
        description: "Ücretsiz kargo",
        minCartAmount: 150
    },
    {
        code: "TECH25",
        discount: 25,
        type: "percentage",
        description: "Teknoloji indirimi -%25",
        minCartAmount: 300
    }
];

//Aktif kupon
let activeCoupon = null;

// Sepet verileri
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elementleri
const productsGrid = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const couponInput = document.getElementById('coupon-input');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponMessage = document.getElementById('coupon-message');
const discountRow = document.getElementById('discount-row');
const discountAmount = document.getElementById('discount-amount');


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

// Sepete ekle
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
    showNotification(`${product.name} sepete eklendi!`);
}

// Sepeti güncelle
function updateCart() {
    // LocalStorage'a kaydet
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
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';

        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <i class="${item.icon} cart-item-icon"></i>
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}₺</p>
                </div>
            </div>
            <div class="cart-item-buttons">
                <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">Sil</button>
            </div>
        `;

        cartItems.appendChild(cartItemElement);
    });
}

// Miktarı güncelle
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += change;

        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }

        updateCart();
    }
}

// Sepetten çıkar
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Ürün sepetten çıkarıldı!');
}

// Toplamları hesapla
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let shipping = subtotal > 500 ? 0 : 29.99;

    if (activeCoupon) {
        if (activeCoupon.type === "percentage") {
            discount = subtotal * (activeCoupon.discount / 100);
        } else if (activeCoupon.type === "fixed") {
            discount = activeCoupon.discount;
        } else if (activeCoupon.type === "special" && activeCoupon.discount === "free-shipping") {
            shipping = 0;
        }
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18;
    const total = discountedSubtotal + shipping + tax;

    subtotalElement.textContent = `${subtotal.toFixed(2)}₺`;

    if (discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-${discount.toFixed(2)}₺`;
    } else if (activeCoupon && activeCoupon.discount === "free-shipping") {
        discountRow.style.display = 'flex';
        discountAmount.textContent = 'Ücretsiz Kargo';
    } else {
        discountRow.style.display = 'none';
    }

    shippingElement.textContent = shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)}₺`;
    taxElement.textContent = `${tax.toFixed(2)}₺`;
    totalElement.textContent = `${total.toFixed(2)}₺`;
}

// Bildirim göster
function showNotification(message) {
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
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2700);
}

// Kupon uygulama fonksiyonu
function applyCoupon() {
    const couponCode = couponInput.value.trim().toUpperCase();

    if (!couponCode) {
        showCouponMessage("Lütfen bir kupon kodu girin", "error");
        return;
    }

    if (activeCoupon) {
        showCouponMessage("Zaten bir kupon uygulandı!", "error");
        return;
    }

    const coupon = coupons.find(c => c.code === couponCode);

    if (!coupon) {
        showCouponMessage('Geçersiz kupon kodu', "error");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (subtotal < coupon.minCartAmount) {
        showCouponMessage(`Bu kupon için minimum ${coupon.minCartAmount}₺ alışveriş yapmalısınız`, "error");
        return;
    }


    activeCoupon = coupon;
    showCouponMessage(`${coupon.description} uygulandı!`, "success");


    couponInput.disabled = true;
    applyCouponBtn.disabled = true;
    applyCouponBtn.innerHTML = `<i class="fas fa-check"></i> Uygulandı`;

    discountRow.style.display = 'flex';
    updateTotals();
}

function showCouponMessage(message, type) {
    couponMessage.textContent = message;
    couponMessage.className = `coupon-message ${type}`;

    if (type === "error") {
        setTimeout(() => {
            couponMessage.textContent = "";
            couponMessage.className = "coupon-message";
        }, 5000);
    }
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

    // Kupon butonu tıklama
    applyCouponBtn.addEventListener('click', applyCoupon);

    couponInput.addEventListener('keypress', (e) => {
        if (e.key === "Enter") {
            applyCoupon();
        }
    });
});