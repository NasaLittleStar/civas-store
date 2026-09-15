// DATA PRODUK (Tanaman, Makanan, Jasa, Aksesori)
const products = [
    {
        id: 1,
        name: "Pachypodium Saundersii",
        category: "tanaman",
        price: 150000,
        desc: "Tanaman hias sukulen eksotik khas Afrika dengan batang unik.",
        icon: "fa-seedling"
    },
    {
        id: 2,
        name: "Monstera Deliciosa",
        category: "tanaman",
        price: 85000,
        desc: "Tanaman indoor daun lebar estetis untuk dekorasi ruangan.",
        icon: "fa-leaf"
    },
    {
        id: 3,
        name: "Civa's Special Burger",
        category: "makanan",
        price: 35000,
        desc: "Burger daging sapi juicy dengan saus rahasia ala Civa's.",
        icon: "fa-hamburger"
    },
    {
        id: 4,
        name: "Kopi Susu Gula Aren",
        category: "makanan",
        price: 20000,
        desc: "Espresso mentega dipadu susu segar & gula aren murni.",
        icon: "fa-mug-hot"
    },
    {
        id: 5,
        name: "Jasa Desain Website/UI",
        category: "jasa",
        price: 500000,
        desc: "Layanan pembuatan landing page profesional & modern.",
        icon: "fa-laptop-code"
    },
    {
        id: 6,
        name: "Jasa Web Development",
        category: "jasa",
        price: 1200000,
        desc: "Pengembangan sistem web penuh dengan database & API.",
        icon: "fa-code"
    },
    {
        id: 7,
        name: "Totebag Kanvas Civa",
        category: "aksesoris",
        price: 45000,
        desc: "Tas kanvas minimalis ramah lingkungan & tahan lama.",
        icon: "fa-bag-shopping"
    },
    {
        id: 8,
        name: "Bonsai Ficus Microcarpa",
        category: "tanaman",
        price: 250000,
        desc: "Bonsai artistik cocok untuk meja kerja atau teras.",
        icon: "fa-tree"
    }
];

let cart = [];
let currentCategory = 'all';

// AUTH & NAVIGATION LOGIC
function switchTab(tab) {
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

function handleAuth(e, type) {
    e.preventDefault();
    let name = type === 'login' ? document.getElementById('login-username').value : document.getElementById('reg-name').value;
    
    document.getElementById('display-user-name').innerText = name.split(' ')[0];
    document.getElementById('user-avatar-text').innerText = name.charAt(0).toUpperCase();

    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');

    showToast(`Selamat datang di Civa's Store, ${name}! 🎉`);
    renderProducts();
}

function logout() {
    document.getElementById('app-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    showToast("Berhasil keluar.");
}

// PRODUCT RENDER & FILTERING
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const search = document.getElementById('search-input').value.toLowerCase();

    const filtered = products.filter(p => {
        const matchCat = currentCategory === 'all' || p.category === currentCategory;
        const matchSearch = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
        return matchCat && matchSearch;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-img-box">
                <span class="badge-tag">${p.category}</span>
                <i class="fa-solid ${p.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-bottom">
                    <span class="price">Rp ${p.price.toLocaleString('id-ID')}</span>
                    <button class="add-cart-btn" onclick="addToCart(${p.id})" title="Tambah ke Keranjang">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
}

function filterProducts() {
    renderProducts();
}

// CART MANAGEMENT
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    const exist = cart.find(item => item.id === id);

    if (exist) {
        exist.qty += 1;
    } else {
        cart.push({ ...prod, qty: 1 });
    }

    updateCartUI();
    showToast(`${prod.name} ditambahkan ke keranjang!`);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cart-count').innerText = totalCount;
    document.getElementById('cart-total').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:40px;">Keranjang kamu masih kosong.</p>`;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function checkout() {
    if (cart.length === 0) {
        showToast("Keranjang belanja masih kosong!");
        return;
    }

    // ⚠️ GANTI DENGAN NOMOR WHATSAPP KAMU (Gunakan awalan 62, contoh: 628123456789)
    const nomorWA = "6282115014709"; 

    // Menyusun rincian pesanan
    let pesananText = "*PESANAN BARU - CIVA'S STORE*\n\n";
    pesananText += "Halo Civa's Store, saya ingin memesan:\n";

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        pesananText += `${index + 1}. ${item.name} (${item.qty}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    pesananText += `\n*Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}\n\n`;
    pesananText += "Mohon info nomor rekening / DANA / GoPay untuk pembayarannya. Terima kasih!";

    // Buka WhatsApp Otomatis
    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesananText)}`;
    window.open(urlWA, '_blank');

    // Kosongkan keranjang
    cart = [];
    updateCartUI();
    toggleCart();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}