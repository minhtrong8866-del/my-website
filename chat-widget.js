// Widget chat nổi góc màn hình — hỗ trợ fallback cục bộ hoặc gọi API server (window.CHAT_API_BASE)
// Cấu hình (tùy):
// - window.CHAT_API_BASE = 'https://your-server.com'  // optional; expects POST /api/chat { message, sessionId }
// - window.SHOP_EMAIL = 'goitronyeuthuong25@gmail.com'  // used for "Gửi mail cho shop"
// - window.CHAT_TITLE = 'Gói Trọn Yêu Thương - Trợ giúp' // optional

(function(){
  // config defaults (can be overridden by setting window.* before loading this file)
  const API_BASE = (window.CHAT_API_BASE || '').replace(/\/$/, '');
  const SHOP_EMAIL = window.SHOP_EMAIL || 'goitronyeuthuong25@gmail.com';
  const CHAT_TITLE = window.CHAT_TITLE || 'Tư vấn trực tuyến';
  const STORAGE_KEY = 'gt_chat_widget_history_v1';
  const sessionId = localStorage.getItem('gt_chat_session') || ('sess_' + Date.now());
  try{ localStorage.setItem('gt_chat_session', sessionId); }catch(e){}

  // insert styles
  const style = document.createElement('style');
  style.textContent = `
  .gt-chat-btn { position: fixed; right: 20px; bottom: 20px; width:56px; height:56px; border-radius:50%; background: linear-gradient(90deg,#1877F2,#0b66d1); color:#fff; display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(24,119,242,0.18); cursor:pointer; z-index:99999; border:none; }
  .gt-chat-bubble { font-size:22px; line-height:1; }
  .gt-chat-window { position: fixed; right: 20px; bottom: 90px; width: 360px; max-width: calc(100% - 40px); height: 480px; background: #fff; border-radius:12px; box-shadow: 0 20px 60px rgba(16,24,40,0.2); z-index:99999; display:flex;flex-direction:column; overflow:hidden; font-family: Poppins, system-ui, sans-serif; }
  .gt-chat-header { background: linear-gradient(90deg,#1877F2,#0b66d1); color:#fff; padding:12px; display:flex;align-items:center; gap:8px; }
  .gt-chat-title { font-weight:700; font-size:14px; flex:1; }
  .gt-chat-close { background:none; border:none; color:#fff; font-size:18px; cursor:pointer; }
  .gt-chat-messages { padding:12px; flex:1; overflow:auto; display:flex; flex-direction:column; gap:8px; background: linear-gradient(180deg,#fff,#f8fbff); }
  .gt-msg { max-width:82%; padding:8px 10px; border-radius:10px; line-height:1.3; }
  .gt-msg.user { margin-left:auto; background:#111; color:#fff; border-bottom-right-radius:4px; }
  .gt-msg.bot { margin-right:auto; background:#f3f6ff; color:#111; }
  .gt-chat-input { display:flex; padding:10px; gap:8px; border-top:1px solid #eee; }
  .gt-chat-input input { flex:1; padding:10px;border-radius:8px;border:1px solid #eee; }
  .gt-chat-input button { background:linear-gradient(90deg,#d63384,#b02266); color:#fff; border:none; padding:10px 12px; border-radius:8px; cursor:pointer; font-weight:700; }
  .gt-chat-footer { font-size:12px; color:#6b7280; padding:8px 12px; border-top:1px solid #f3f4f6; text-align:center; }
  .gt-quick { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
  .gt-quick button{ padding:6px 8px; border-radius:8px; border:1px solid #eee; background:#fff; cursor:pointer; font-size:13px; }
  `;
  document.head.appendChild(style);

  // create elements
  const chatBtn = document.createElement('button');
  chatBtn.className = 'gt-chat-btn';
  chatBtn.title = 'Trợ giúp';
  chatBtn.innerHTML = `<span class="gt-chat-bubble">💬</span>`;

  const chatWindow = document.createElement('div');
  chatWindow.className = 'gt-chat-window';
  chatWindow.style.display = 'none';
  chatWindow.innerHTML = `
    <div class="gt-chat-header">
      <div style="display:flex;align-items:center;gap:8px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2C6.48 2 2 5.58 2 10c0 2.4 1.34 4.56 3.56 5.99L4 22l5.51-1.39C11.16 21.8 11.57 22 12 22c5.52 0 10-3.58 10-8s-4.48-12-10-12z" fill="#fff"/></svg>
      </div>
      <div class="gt-chat-title">${CHAT_TITLE}</div>
      <button class="gt-chat-close" aria-label="Đóng">✕</button>
    </div>
    <div class="gt-chat-messages" role="log" aria-live="polite"></div>
    <div style="padding:0 12px;">
      <div class="gt-quick">
        <button data-quick="Xin chào">Xin chào</button>
        <button data-quick="Giờ mở cửa">Giờ mở cửa</button>
        <button data-quick="Phí ship">Phí ship</button>
        <button data-quick="Thanh toán">Thanh toán</button>
      </div>
    </div>
    <div class="gt-chat-input">
      <input type="text" placeholder="Nhập câu hỏi của bạn..." aria-label="Nhập câu hỏi" />
      <button type="button">Gửi</button>
    </div>
    <div class="gt-chat-footer">Bạn có thể nhấn "Gửi mail cho shop" nếu muốn chuyển tiếp cho nhân viên <button id="gt-mail-btn" style="margin-left:8px;padding:6px 8px;border-radius:8px;border:1px solid #eee;background:#fff;cursor:pointer">Gửi mail cho shop</button></div>
  `;

  // append to body
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatWindow);

  // references
  const messagesEl = chatWindow.querySelector('.gt-chat-messages');
  const inputEl = chatWindow.querySelector('.gt-chat-input input');
  const sendBtn = chatWindow.querySelector('.gt-chat-input button');
  const closeBtn = chatWindow.querySelector('.gt-chat-close');
  const quickContainer = chatWindow.querySelector('.gt-quick');
  const mailBtn = chatWindow.querySelector('#gt-mail-btn');

  // load history
  let history = [];
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) history = JSON.parse(raw);
  }catch(e){ history = []; }

  function saveHistory(){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }catch(e){}
  }

  function renderMessages(){
    messagesEl.innerHTML = '';
    history.forEach(m=>{
      const el = document.createElement('div');
      el.className = 'gt-msg ' + (m.role === 'user' ? 'user' : 'bot');
      el.textContent = m.text;
      messagesEl.appendChild(el);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // basic local bot rules (fallback)
  function localBotReply(msg){
    const t = msg.toLowerCase();
    if(/\b(xin chào|chào|hello|hi)\b/.test(t)) return 'Chào bạn! Mình có thể giúp gì cho bạn?';
    if(/\b(giờ mở cửa|mấy giờ|giờ làm việc)\b/.test(t)) return 'Cửa hàng mở từ 8:00 - 20:00 hàng ngày.';
    if(/\b(phí ship|ship|giao hàng)\b/.test(t)) return 'Phí ship tuỳ khu vực: trong nội thành 25k, ngoại thành từ 35k. Cho mình biết địa chỉ để báo chính xác nhé.';
    if(/\b(thanh toán|pay|momo|zalopay|cod)\b/.test(t)) return 'Chúng tôi hỗ trợ COD, Momo, ZaloPay. Bạn muốn thanh toán phương thức nào?';
    if(/\b(bao lâu|giao|thời gian)\b/.test(t)) return 'Thời gian giao hàng: 1-2 ngày (Hà Nội/HCM), 2-4 ngày khu vực khác.';
    if(/\b(lien he|lien hệ|hotline|số điện thoại)\b/.test(t)) return 'Hotline: 0966625217 — bạn có thể gọi hoặc để lại số, nhân viên sẽ liên hệ.';
    // fallback
    return "Mình chưa hiểu lắm. Bạn có thể thử hỏi khác hoặc nhấn 'Gửi mail cho shop' để nhân viên hỗ trợ trực tiếp.";
  }

  async function queryServerChat(message){
    if(!API_BASE) return { ok:false, detail:'no_api' };
    try{
      const resp = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId })
      });
      if(!resp.ok){
        const t = await resp.text().catch(()=>null);
        return { ok:false, detail: t || `HTTP ${resp.status}` };
      }
      const j = await resp.json();
      // expects { reply: '...' }
      return { ok:true, reply: j.reply || j.response || '' };
    }catch(err){
      return { ok:false, detail: err.message || err };
    }
  }

  async function handleUserMessage(text){
    if(!text) return;
    history.push({ role:'user', text });
    renderMessages();
    saveHistory();

    // show typing bot message
    history.push({ role:'bot', text:'...' });
    renderMessages();

    // if API configured -> call server
    if(API_BASE){
      const res = await queryServerChat(text);
      history.pop(); // remove '...'
      if(res.ok){
        history.push({ role:'bot', text: res.reply || 'Xin lỗi, shop chưa trả lời.' });
      } else {
        // fallback to local bot
        history.push({ role:'bot', text: localBotReply(text) });
      }
    } else {
      // local quick reply
      history.pop(); // remove '...'
      history.push({ role:'bot', text: localBotReply(text) });
    }
    renderMessages();
    saveHistory();
  }

  // events
  chatBtn.addEventListener('click', ()=>{
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    if(chatWindow.style.display === 'flex') {
      inputEl.focus();
    }
  });
  closeBtn.addEventListener('click', ()=> chatWindow.style.display = 'none');
  sendBtn.addEventListener('click', ()=>{
    const t = inputEl.value.trim();
    if(!t) return;
    inputEl.value = '';
    handleUserMessage(t);
  });
  inputEl.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendBtn.click();
    }
  });
  quickContainer.addEventListener('click', (e)=>{
    const b = e.target.closest('button[data-quick]');
    if(!b) return;
    const q = b.dataset.quick;
    inputEl.value = q;
    inputEl.focus();
  });
  mailBtn.addEventListener('click', ()=>{
    // prepare mailto with chat history
    const subject = `Yêu cầu hỗ trợ - từ website`;
    const lines = [];
    lines.push('Khách hàng cần hỗ trợ:');
    try{
      history.forEach(m=>{
        lines.push(`${m.role === 'user' ? 'Khách:' : 'Bot:'} ${m.text}`);
      });
    }catch(e){}
    const body = lines.join('\n');
    const mailto = `mailto:${encodeURIComponent(SHOP_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // open mail client
    try{ window.open(mailto, '_blank'); } catch(e){ window.location.href = mailto; }
  });

  // initial render
  if(history.length === 0){
    // greeting from bot
    history.push({ role:'bot', text: 'Chào bạn! Mình là trợ lý ảo. Bạn cần tư vấn gì hôm nay?' });
    saveHistory();
  }
  renderMessages();

  // expose for debugging
  window.__GT_CHAT = {
    open: ()=> { chatWindow.style.display = 'flex'; inputEl.focus(); },
    close: ()=> { chatWindow.style.display = 'none'; },
    clearHistory: ()=> { history = []; saveHistory(); renderMessages(); }
  };

})();