// product-list.js
// CẬP NHẬT: gửi email tự động khi tạo đơn
// - Nếu bạn triển khai backend (Phương án A), set window.ORDER_EMAIL_API_BASE = 'https://your-api-host' (không có slash cuối).
//   Server phải có endpoint POST /api/orders nhận order JSON và gửi email (ví dụ server/server.js đã cung cấp trước).
// - Nếu bạn không có backend, bạn có thể dùng mailto fallback: chỉnh SHOP_EMAIL bên dưới thành email cửa hàng của bạn.
// LƯU Ý: mailto sẽ mở mail client của người dùng (không gửi tự động từ server).

/* --------------- CẤU HÌNH --------------- */
// Mail fallback (mailto). Thay bằng email thật của shop nếu bạn chỉ dùng mailto.
const SHOP_EMAIL = 'goitronyeuthuong25@gmail.com';

// Nếu bạn có server API để gửi email tự động, set URL ở đây (ví dụ: 'https://api.yourshop.com')
// Bạn có thể set window.ORDER_EMAIL_API_BASE từ ngoài (ví dụ trong index.html trước khi load script)
// window.ORDER_EMAIL_API_BASE = 'https://your-server.com';
/* ----------------------------------------- */

// helper format
const fmtVND = n => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

// --- Dữ liệu sản phẩm ---
const products = [
  { name: "Sweet Cube Box", price: 115000, image: "image/set1/z7124239187524_868f8b61170673cacecc18baed123784.jpg", isNew: true,
    variants: [
      { name: "Xanh", images: ["image/set1/z7124239187555_3a0c20d0da75fc041e0d40b448d494c9.jpg"] }, { name: "Tím", images: ["image/set1/z7124239187560_48e7bb9087d3d15d30d3e5af07503974.jpg"] },
      { name: "Vàng", images: ["image/set1/z7124239187556_650c352f8bf6cfc787931aaab34f2bc9.jpg"] },
      { name: "Hồng", images: ["image/set1/z7124239187565_c43202dd33a0c2dddc43220ca3594860.jpg"] },
      { name: "Đỏ", images: ["image/set1/z7124239187566_c2dd1a1b23874e7eeae267286a7a561c.jpg"] },
      { name: "Xanh lá", images: ["image/set1/z7124239187567_65f6fc7d1b676580a861912ab1f37f5f.jpg"] }
    ]
  },
 {
    name: "Sweetie Box",
    price: 55000,
    image: "image/set2/z7124240730848_fd1fa692da6ec65d11201c19426a7b05.jpg",
    variants: [
      { name: "Đỏ", images: ["image/set2/z7124240730848_fd1fa692da6ec65d11201c19426a7b05.jpg"] },
      { name: "Hồng", images: ["image/set2/z7124240730828_d142ffeb8d2cb826fd05ef3ea6bfbd33.jpg"] },
      { name: "Xanh lá", images: ["image/set2/z7124240730828_d142ffeb8d2cb826fd05ef3ea6bfbd33.jpg"] },
      { name: "Tím", images: ["image/set2/z7124240730846_e5224a60cabc8c6c95ed7451eb4a7532.jpg"] },
      { name: "Xanh lam", images: ["image/set2/z7124240730850_c5268319edb37c2d9176a0e0bbceca3e.jpg"] },
      { name: "Cam", images: ["image/set2/z7124240730849_fb0a716837596e77d1575cf65042b520.jpg"] },
      { name: "Vàng", images: ["image/set2/z7124240730856_2e8da3abd4eb01d2ab99f25f3dedf90b.jpg"] }
    ]
  },
  {
    name: "Butterfly Kiss Box",
    price: 145000,
    image: "image/set3/z7124241522530_ac4236ab79b760eafe2e63b723154cf5.jpg",
    isNew: true,
    variants: [
      { name: "Xanh lá", images: ["image/set3/z7124241522541_dc77462d7f97f91d858cd46ef83a76c2.jpg"] },
      { name: "Đỏ", images: ["image/set3/z7124241522527_81f67b00c097d4fe0944cb7543e4ccc3.jpg"] },
      { name: "Hồng", images: ["image/set3/z7124241522519_2e5e4fcf71793720258a4ce01f921717.jpg"] },
      { name: "Xanh mint", images: ["image/set3/z7124241522529_8f3d090cec5907cf5e66ebf3b04575ab.jpg"] },
      { name: "Tím", images: ["image/set3/z7124241522590_cb469668e29d2353a9a4b58db9de42de.jpg"] },
    
    ]
  },
  {
    name: "Lovely Basket",
    price: 130000,
    image: "image/set4/z7124243291203_f6be4233220309588a945dc767f72ee2.jpg",
    variants: [
      { name: "Tím", images: ["image/set4/z7124243233483_6dce6e57c986bbed0dd2aafb68e932a8.jpg"] },
      { name: "Hồng", images: ["image/set4/z7124243291203_f6be4233220309588a945dc767f72ee2.jpg"] },
      { name: "Xanh", images: ["image/set4/z7124243233476_ffb7a659d2d2766b6f85fd2c0cd42de9.jpg"] },
    ]
  },
  {
    name: "Baby Candy",
    price: 70000,
    image: "image/set5/z7124244035751_f9dae76e26ab3d2c71d34df11f561c1e.jpg",
    variants: [
      { name: "Hồng", images: ["image/set5/z7124244035751_f9dae76e26ab3d2c71d34df11f561c1e.jpg"] },
      { name: "Đỏ", images: ["image/set5/z7124244035726_78d42451e0deaa735226bf676c31c803.jpg"] },
      { name: "Xanh mint", images: ["image/set5/z7124244035752_59e6b4b117ac0f130f3b6b69268212e8.jpg"] },
      { name: "Tím", images: ["image/set5/z7124244035750_a3d9be4a6e0e8fb8a7e2499a7eaebd15.jpg"] },
      { name: "Xanh lá", images: ["image/set5/z7124244035721_6b7b5a961d6a7a5f94de72a777f00e4c.jpg"] },
    ]
  },
  {
    name: "Sweet Bloom",
    price: 90000,
    image: "image/set6/z7141353654013_a30d0c0ae0b692682f55096f3732b712.jpg",
    variants: [
      { name: "Hồng", images: ["image/set6/z7141353654346_60e808782c3d0f9691cc4db9ef9f1a3f.jpg"] },
     
      { name: "Xanh mint", images: ["image/set6/z7141353646865_de32ec1273319853ec24eddef087a6fe.jpg"] },
    ]
  }
];

// --- UI references ---
const productGrid = document.getElementById('productGrid');
const detailModal = document.getElementById('detailModal');
const detailImg = document.getElementById('detailImg');
const thumbsWrap = document.getElementById('thumbs');
const detailName = document.getElementById('detailName');
const detailPrice = document.getElementById('detailPrice');
const colorWrap = document.getElementById('colorWrap');
const qtyInput = document.getElementById('qtyInput');
const qtyPlus = document.getElementById('qtyPlus');
const qtyMinus = document.getElementById('qtyMinus');
const addCartBtn = document.getElementById('addCartBtn');
const buyNowBtn = document.getElementById('buyNowBtn');
const modalClose = document.getElementById('modalClose');

const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');

const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const grandTotalEl = document.getElementById('grandTotal');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutBtnInModal = document.getElementById('submitOrderBtn');
const cancelOrderBtn = document.getElementById('cancelOrderBtn');
const checkoutTotal = document.getElementById('checkoutTotal');
const buyerName = document.getElementById('buyerName');
const buyerPhone = document.getElementById('buyerPhone');
const buyerAddress = document.getElementById('buyerAddress');
const buyerNote = document.getElementById('buyerNote');
const paymentMethods = document.getElementById('paymentMethods');

let currentProductIndex = 0;
let currentColorIndex = 0;
let selectedPayment = 'cod';

// --- Cart (persist in localStorage) ---
let cart = JSON.parse(localStorage.getItem('gt_cart') || '[]');

function saveCart(){
  localStorage.setItem('gt_cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(productIndex, variantIndex, qty){
  const p = products[productIndex];
  const variant = p.variants[variantIndex] || { name: '', images: [p.image] };
  const key = `${productIndex}::${variantIndex}`;
  const existing = cart.find(i=>i.key===key);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      key,
      productIndex,
      variantIndex,
      name: p.name,
      variantName: variant.name || '',
      price: p.price,
      image: (variant.images && variant.images[0]) || p.image,
      qty
    });
  }
  saveCart();
  showToast('Đã thêm vào giỏ');
}

function removeFromCart(key){
  cart = cart.filter(i=>i.key !== key);
  saveCart();
}

function changeQtyCart(key, qty){
  const it = cart.find(i=>i.key===key);
  if(!it) return;
  it.qty = Math.max(1, qty);
  saveCart();
}

function computeTotal(){
  return cart.reduce((s,i)=>s + i.price * i.qty, 0);
}

function renderCart(){
  // badge
  const totalItems = cart.reduce((s,i)=>s + i.qty, 0);
  if(totalItems > 0){
    cartBadge.style.display = 'inline-block';
    cartBadge.textContent = totalItems;
  } else {
    cartBadge.style.display = 'none';
  }

  // list
  cartList.innerHTML = '';
  if(cart.length === 0){
    cartList.innerHTML = '<div style="padding:20px;color:#6b7280">Giỏ hàng trống</div>';
  } else {
    cart.forEach(item=>{
      const el = document.createElement('div');
      el.className = 'drawer-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${escapeHtml(item.name)}">
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:700">${escapeHtml(item.name)}</div>
              <div style="color:#6b7280;font-size:13px">${escapeHtml(item.variantName)}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:800;color:var(--pink-700)">${fmtVND(item.price * item.qty)}</div>
              <div style="font-size:13px;color:#6b7280">${fmtVND(item.price)} / cái</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
            <button data-action="dec" data-key="${item.key}" style="padding:6px 8px;border-radius:8px;border:1px solid #eee;background:#fff;cursor:pointer">−</button>
            <input data-key="${item.key}" type="number" min="1" value="${item.qty}" style="width:60px;text-align:center;padding:6px;border:1px solid #eee;border-radius:8px">
            <button data-action="inc" data-key="${item.key}" style="padding:6px 8px;border-radius:8px;border:1px solid #eee;background:#fff;cursor:pointer">+</button>
            <button data-action="remove" data-key="${item.key}" style="margin-left:auto;padding:6px 10px;border-radius:8px;border:none;background:#ffefef;color:#ef4444;cursor:pointer">Xóa</button>
          </div>
        </div>
      `;
      cartList.appendChild(el);
    });
  }
  grandTotalEl.textContent = fmtVND(computeTotal());
}

// cart events delegated
cartList.addEventListener('click', (e)=>{
  const b = e.target.closest('button[data-action]');
  if(!b) return;
  const action = b.dataset.action;
  const key = b.dataset.key;
  if(action === 'remove'){ removeFromCart(key); return; }
  const item = cart.find(i=>i.key === key);
  if(!item) return;
  if(action === 'inc'){ changeQtyCart(key, item.qty + 1); }
  if(action === 'dec'){ changeQtyCart(key, item.qty - 1); }
});
cartList.addEventListener('change', (e)=>{
  const input = e.target;
  if(input.tagName.toLowerCase() !== 'input') return;
  const key = input.dataset.key;
  const val = parseInt(input.value||'1',10);
  changeQtyCart(key, val);
});

// --- Render product grid ---
function renderProducts(){
  productGrid.innerHTML = '';
  products.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = 'card';
    li.innerHTML = `
      <div class="img-wrap" data-index="${i}">
        ${p.isNew ? '<span class="new-badge">New</span>' : ''}
        <img loading="lazy" src="${p.image}" alt="${escapeHtml(p.name)}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
        <button class="quick-btn" data-index="${i}" aria-label="Xem chi tiết ${escapeHtml(p.name)}">Xem</button>
      </div>
      <div class="meta">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="price">${fmtVND(p.price)}</div>
      </div>
    `;
    productGrid.appendChild(li);
  });

  // attach quick buttons
  document.querySelectorAll('.quick-btn').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const idx = Number(btn.dataset.index);
      openDetail(idx);
      ev.stopPropagation();
    });
  });

  // attach card click to open detail too
  document.querySelectorAll('.img-wrap').forEach(w=>{
    w.addEventListener('click', ()=>openDetail(Number(w.dataset.index)));
  });
}

// --- Modal interactions ---
function openDetail(index){
  currentProductIndex = index;
  currentColorIndex = 0;
  const p = products[index];
  detailName.textContent = p.name;
  detailPrice.textContent = fmtVND(p.price);
  qtyInput.value = 1;
  loadColorOptions();
  loadVariantImages();
  openModal();
}

function loadVariantImages(){
  const p = products[currentProductIndex];
  const imgs = (p.variants[currentColorIndex] && p.variants[currentColorIndex].images) || [p.image];
  detailImg.src = imgs[0];
  thumbsWrap.innerHTML = '';
  imgs.forEach((src, idx)=>{
    const im = document.createElement('img');
    im.src = src;
    im.loading = 'lazy';
    if(idx === 0) im.classList.add('active');
    im.addEventListener('click', ()=>{
      document.querySelectorAll('#thumbs img').forEach(el=>el.classList.remove('active'));
      im.classList.add('active');
      detailImg.src = src;
    });
    thumbsWrap.appendChild(im);
  });
}

function loadColorOptions(){
  const p = products[currentProductIndex];
  colorWrap.innerHTML = '';
  p.variants.forEach((v, i)=>{
    const btn = document.createElement('button');
    btn.textContent = v.name;
    if(i===0) btn.classList.add('active');
    btn.addEventListener('click', ()=>{
      currentColorIndex = i;
      colorWrap.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      loadVariantImages();
    });
    colorWrap.appendChild(btn);
  });
}

function openModal(){
  detailModal.classList.add('open');
  detailModal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// Modal close handlers
modalClose.addEventListener('click', closeModal);
detailModal.addEventListener('click', (e)=>{
  if(e.target === detailModal) closeModal();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && detailModal.classList.contains('open')) closeModal();
});

// qty handlers
qtyPlus.addEventListener('click', ()=>qtyInput.stepUp());
qtyMinus.addEventListener('click', ()=>{ if(Number(qtyInput.value) > 1) qtyInput.stepDown(); });
qtyInput.addEventListener('input', ()=>{ if(!qtyInput.value || Number(qtyInput.value) < 1) qtyInput.value = 1; });

// add to cart / buy now
addCartBtn.addEventListener('click', ()=>{
  const qty = Math.max(1, parseInt(qtyInput.value||'1',10));
  addToCart(currentProductIndex, currentColorIndex, qty);
});
buyNowBtn.addEventListener('click', ()=>{
  const qty = Math.max(1, parseInt(qtyInput.value||'1',10));
  addToCart(currentProductIndex, currentColorIndex, qty);
  openCart();
});

// --- Popup: show once per visit ---
function showPopupOnce(){
  try{
    const seen = localStorage.getItem('gt_popup_seen');
    if(!seen){
      popup.style.display = 'flex';
    }
  }catch(e){ console.warn(e); popup.style.display = 'flex'; }
}
popupClose.addEventListener('click', ()=>{
  popup.style.display = 'none';
  try{ localStorage.setItem('gt_popup_seen', '1'); }catch(e){}
});
document.getElementById('popupCta')?.addEventListener('click', ()=>{
  popup.style.display = 'none';
  try{ localStorage.setItem('gt_popup_seen', '1'); }catch(e){}
});
popup.addEventListener('click', (e)=>{ if(e.target === popup){ popup.style.display='none'; try{ localStorage.setItem('gt_popup_seen','1'); }catch(e){} } });

// --- Cart drawer ---
function openCart(){
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden','false');
  cartToggle.setAttribute('aria-expanded','true');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden','true');
  cartToggle.setAttribute('aria-expanded','false');
}
cartToggle.addEventListener('click', ()=>{ if(cartDrawer.classList.contains('open')) closeCart(); else openCart(); });
cartClose.addEventListener('click', closeCart);

/* ----------------- Email sending helpers ----------------- */

/**
 * sendOrderEmail(order)
 * - If window.ORDER_EMAIL_API_BASE is set -> POST to `${ORDER_EMAIL_API_BASE}/api/orders`
 * - Else if SHOP_EMAIL is set (and not the placeholder) -> open mailto: (fallback)
 * - Else: warn and return { ok:false, reason }
 *
 * Returns a Promise resolving to { ok:true } or { ok:false, detail }
 */
async function sendOrderEmail(order){
  // 1) try server API if provided
  const apiBase = (window.ORDER_EMAIL_API_BASE || '').replace(/\/$/, '');
  if(apiBase){
    try{
      const resp = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await resp.json().catch(()=>null);
      if(!resp.ok){
        console.warn('Server responded with non-OK when sending order email', resp.status, data);
        return { ok:false, detail: data || `HTTP ${resp.status}` };
      }
      showToast('Đã gửi thông tin đơn đến cửa hàng');
      return { ok:true, data };
    }catch(err){
      console.error('Error posting order to API:', err);
      // fallthrough to mailto fallback if configured
    }
  }

  // 2) mailto fallback
  if(SHOP_EMAIL && SHOP_EMAIL !== 'shop@example.com'){
    try{
      const subject = `Đơn hàng mới ${order.id}`;
      const lines = [];
      lines.push(`Mã đơn: ${order.id}`);
      lines.push(`Ngày: ${new Date(order.createdAt).toLocaleString()}`);
      lines.push(`Họ và tên: ${order.buyer.name}`);
      lines.push(`Số điện thoại: ${order.buyer.phone}`);
      lines.push(`Địa chỉ: ${order.buyer.address}`);
      lines.push(`Ghi chú: ${order.buyer.note || '-'}`);
      lines.push('');
      lines.push('Sản phẩm:');
      order.items.forEach(it => {
        lines.push(`- ${it.name} (${it.variant || '—'}) x${it.qty} — ${fmtVND(it.price * it.qty)}`);
      });
      lines.push('');
      lines.push(`Tổng: ${fmtVND(order.total)}`);
      lines.push('');
      lines.push('Vui lòng xử lý đơn hàng.');

      const body = lines.join('\n');
      const mailto = `mailto:${encodeURIComponent(SHOP_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Try to open new window/tab; if blocked, set location.href
      try {
        window.open(mailto, '_blank');
      } catch (e) {
        window.location.href = mailto;
      }
      showToast('Mở mail client để gửi đơn (mailto)');
      return { ok:true, method:'mailto' };
    }catch(err){
      console.error('mailto error', err);
      return { ok:false, detail: err };
    }
  }

  console.warn('No email method configured: set window.ORDER_EMAIL_API_BASE or update SHOP_EMAIL in product-list.js');
  return { ok:false, detail: 'no_email_config' };
}

/* ----------------- Checkout flow ----------------- */

// Checkout flow
checkoutBtn.addEventListener('click', openCheckout);
checkoutClose.addEventListener('click', closeCheckout);
cancelOrderBtn.addEventListener('click', closeCheckout);

function openCheckout(){
  if(cart.length === 0){ alert('Giỏ hàng trống'); return; }
  checkoutOverlay.classList.add('open');
  checkoutOverlay.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  checkoutTotal.textContent = fmtVND(computeTotal());
  // reset fields a bit
  buyerName.value = '';
  buyerPhone.value = '';
  buyerAddress.value = '';
  buyerNote.value = '';
  selectedPayment = 'cod';
  updatePaymentUI();
}

function closeCheckout(){
  checkoutOverlay.classList.remove('open');
  checkoutOverlay.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

paymentMethods.addEventListener('click', (e)=>{
  const pm = e.target.closest('.pm');
  if(!pm) return;
  selectedPayment = pm.dataset.method;
  updatePaymentUI();
});

function updatePaymentUI(){
  document.querySelectorAll('.pm').forEach(p=>{
    p.classList.toggle('active', p.dataset.method === selectedPayment);
  });
}

// submit order
checkoutBtnInModal.addEventListener('click', async ()=>{
  const name = buyerName.value.trim();
  const phone = buyerPhone.value.trim();
  const address = buyerAddress.value.trim();
  const note = buyerNote.value.trim();

  if(!name){ alert('Vui lòng nhập họ và tên'); return; }
  if(!phone || !/^[0-9\+\-\s]{7,15}$/.test(phone)){ alert('Số điện thoại không hợp lệ'); return; }
  if(!address){ alert('Vui lòng nhập địa chỉ giao hàng'); return; }

  const order = {
    id: 'ORD' + Date.now(),
    buyer: { name, phone, address, note },
    items: cart.map(i=>({ name:i.name, variant:i.variantName, price:i.price, qty:i.qty })),
    total: computeTotal(),
    paymentMethod: selectedPayment,
    createdAt: new Date().toISOString()
  };

  // Save demo order to localStorage orders
  const orders = JSON.parse(localStorage.getItem('gt_orders') || '[]');
  orders.push(order);
  localStorage.setItem('gt_orders', JSON.stringify(orders));

  // Handle payment methods
  if(selectedPayment === 'cod'){
    // COD: send email (server or mailto) and finish order
    try{
      await sendOrderEmail(order);
    }catch(e){
      console.warn('sendOrderEmail error', e);
    }
    clearCartAfterOrder(order);
    showOrderSuccess(order, 'Chọn phương thức COD. Đơn hàng đã được tạo.');
  } else {
    // simulate online payment (demo)
    // Typically here you'd call your backend to create a payment link (Momo/ZaloPay) and redirect the customer.
    // For demo: open a new tab to a placeholder URL and simulate success after delay.
    const paymentUrl = `https://example.com/pay?order=${encodeURIComponent(order.id)}&method=${selectedPayment}`;
    const w = window.open(paymentUrl, '_blank');
    showToast('Chuyển tới cổng thanh toán demo...');
    // Simulate payment confirmation after 2.5s
    setTimeout(async ()=>{
      // In real integration you'd verify with server callback. Here we assume success.
      if(w) { try{ w.close(); } catch(e){} }
      // After payment success: send email (server or mailto)
      try{
        await sendOrderEmail(order);
      }catch(e){
        console.warn('sendOrderEmail error after payment', e);
      }
      clearCartAfterOrder(order);
      showOrderSuccess(order, `Thanh toán (${selectedPayment}) thành công (demo).`);
    }, 2500);
  }
});

function clearCartAfterOrder(order){
  cart = [];
  saveCart();
  closeCheckout();
  closeCart();
  // Save last order for potential display
  localStorage.setItem('gt_last_order', JSON.stringify(order));
}

function showOrderSuccess(order, message){
  alert(`Đặt hàng thành công!\nMã đơn: ${order.id}\n${message}`);
}

/* ----------------- small utilities ----------------- */
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed',right:'20px',bottom:'20px',background:'#111',color:'#fff',padding:'10px 14px',borderRadius:'10px',zIndex:9999,opacity:0,transition:'opacity .25s'
  });
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity = 1);
  setTimeout(()=>{ t.style.opacity = 0; setTimeout(()=>t.remove(),280); }, 1600);
}

/* ----------------- init ----------------- */
renderProducts();
renderCart();
showPopupOnce();

// expose for debugging
window.__GT = { products, cart, addToCart, removeFromCart, renderCart, computeTotal, sendOrderEmail };
