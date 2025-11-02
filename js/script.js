// js/script.js - Campus OLX (products, modal, favorites, contact demo)

// ----------------------------- Utilities -----------------------------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function safeParse(key){ try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

// ----------------------------- Product functions -----------------------------
function loadProducts(){
  const container = $('#product-list');
  if(!container) return;
  const products = safeParse('products');

  if(products.length === 0){
    container.innerHTML = `<p class="small">No items listed yet. Post one from Resources page.</p>`;
    return;
  }

  container.innerHTML = products.map((p, idx) => {
    return `
      <div class="product-card card" data-id="${idx}">
        <button class="favorite-btn ${isFavorited(idx) ? 'active' : ''}" data-fav="${idx}" title="Toggle favorite">${isFavorited(idx) ? '♥' : '♡'}</button>
        <img src="${p.img || 'images/sample.jpg'}" alt="${escapeHtml(p.title)}">
        <h4>${escapeHtml(p.title)}</h4>
        <p class="small">${escapeHtml(truncate(p.desc, 100))}</p>
        <div class="resource-meta"><span class="badge">${escapeHtml(p.category || 'Misc')}</span><strong>₹${p.price || '—'}</strong></div>
      </div>
    `;
  }).join('');

  // attach click handlers
  container.querySelectorAll('.product-card').forEach(card=>{
    const id = card.getAttribute('data-id');
    // open modal on card click (but not when favorite btn clicked)
    card.addEventListener('click', (e)=>{
      if(e.target.closest('.favorite-btn')) return;
      openProductModal(parseInt(id,10));
    });
  });

  // favorite button handlers
  container.querySelectorAll('.favorite-btn').forEach(btn=>{
    const id = parseInt(btn.getAttribute('data-fav'),10);
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggleFavorite(id);
      btn.classList.toggle('active');
      btn.innerText = isFavorited(id) ? '♥' : '♡';
    });
  });
}

function truncate(s, n){
  return s && s.length > n ? s.slice(0,n) + '…' : (s || '');
}
function escapeHtml(str){
  return String(str || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// ----------------------------- Favorites -----------------------------
function favoritesKey(){ return 'favorites_v1'; }
function getFavorites(){ return safeParse(favoritesKey()); }
function isFavorited(id){ return getFavorites().includes(id); }
function toggleFavorite(id){
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if(idx === -1) favs.push(id);
  else favs.splice(idx,1);
  save(favoritesKey(), favs);
}

// ----------------------------- Modal & Contact -----------------------------
function openProductModal(id){
  const products = safeParse('products');
  const p = products[id];
  if(!p) return;

  $('#modalTitle').innerText = p.title;
  $('#modalDesc').innerText = p.desc || '';
  $('#modalPrice').innerText = '₹' + (p.price || '—');
  $('#modalCategory').innerText = p.category || 'Misc';
  $('#modalImage').src = p.img || 'images/sample.jpg';

  // favorite button state
  const favBtn = $('#toggleFavBtn');
  favBtn.dataset.id = id;
  favBtn.classList.toggle('active', isFavorited(id));
  favBtn.innerText = isFavorited(id) ? '♥ Favorited' : '♡ Favorite';

  // contact thread load
  loadContactThread(id);

  // show modal
  $('#modalOverlay').classList.add('show');
  $('#modalOverlay').setAttribute('aria-hidden','false');
}

function closeProductModal(){
  $('#modalOverlay').classList.remove('show');
  $('#modalOverlay').setAttribute('aria-hidden','true');
  $('#contactArea').style.display = 'none';
  $('#contactInput').value = '';
  $('#contactThread').innerHTML = '';
}

function loadContactThread(productId){
  const key = `contact_thread_${productId}`;
  const msgs = safeParse(key);
  const thread = $('#contactThread');
  thread.innerHTML = msgs.map(m => `<div class="card" style="padding:8px;margin-bottom:6px"><strong>${escapeHtml(m.from)}:</strong><div class="small">${escapeHtml(m.text)}</div></div>`).join('');
  // ensure visible
  $('#contactArea').style.display = 'none'; // contact collapsed initially
}

// send contact (demo)
function sendContactMessage(productId){
  const input = $('#contactInput');
  const text = (input.value || '').trim();
  if(!text) return alert('Please type a message.');
  const key = `contact_thread_${productId}`;
  const msgs = safeParse(key);
  msgs.push({ from: 'You', text, at: new Date().toISOString() });
  save(key, msgs);
  // auto-reply demo
  setTimeout(()=> {
    msgs.push({ from: 'Seller', text: 'Thanks — I got your message (demo).', at: new Date().toISOString() });
    save(key, msgs);
    loadContactThread(productId);
  }, 700);
  loadContactThread(productId);
  input.value = '';
}

// ----------------------------- Product Add (used on resources page) -----------------------------
function addProductFormHandler(e){
  if(e) e.preventDefault();
  const title = document.getElementById('title') ? document.getElementById('title').value.trim() : '';
  const desc = document.getElementById('description') ? document.getElementById('description').value.trim() : '';
  const category = document.getElementById('category') ? document.getElementById('category').value : 'Misc';
  const price = document.getElementById('price') ? document.getElementById('price').value : '';
  const img = document.getElementById('image') ? document.getElementById('image').value : '';

  if(!title) return alert('Please enter a title.');
  const products = safeParse('products');
  products.push({ title, desc, category, price, img });
  save('products', products);
  alert('Listing created (demo).');
  // if on resources page, reload there; if on index, refresh products
  if(location.pathname.split('/').pop().includes('resources')) location.reload();
  else loadProducts();
}

// ----------------------------- Init & Event binding -----------------------------
document.addEventListener('DOMContentLoaded', ()=> {
  // initial products load
  loadProducts();

  // modal close
  $('#closeModal').addEventListener('click', closeProductModal);
  $('#modalOverlay').addEventListener('click', (e)=>{
    if(e.target === $('#modalOverlay')) closeProductModal();
  });

  // contact show/hide and send
  $('#contactSellerBtn').addEventListener('click', ()=>{
    const area = $('#contactArea');
    area.style.display = (area.style.display === 'none' || area.style.display === '') ? 'block' : 'none';
  });
  $('#sendContactBtn').addEventListener('click', ()=>{
    const pid = parseInt($('#toggleFavBtn').dataset.id,10);
    sendContactMessage(pid);
  });

  // toggle fav in modal
  $('#toggleFavBtn').addEventListener('click', ()=>{
    const pid = parseInt($('#toggleFavBtn').dataset.id,10);
    toggleFavorite(pid);
    $('#toggleFavBtn').classList.toggle('active', isFavorited(pid));
    $('#toggleFavBtn').innerText = isFavorited(pid) ? '♥ Favorited' : '♡ Favorite';
    // refresh product list fav icons too
    loadProducts();
  });

  // search - as-you-type (optional live)
  const searchInput = document.getElementById('searchInput');
  const searchCategory = document.getElementById('searchCategory');
  if(searchInput){
    const doFilter = ()=> {
      const q = (searchInput.value || '').toLowerCase();
      const cat = (searchCategory.value || '');
      const products = safeParse('products');
      const filtered = products.map((p, idx) => ({...p, _id: idx})).filter(p=>{
        const matchesQ = q ? ((p.title + ' ' + p.desc).toLowerCase().includes(q)) : true;
        const matchesCat = cat ? (p.category === cat) : true;
        return matchesQ && matchesCat;
      });
      const container = $('#product-list');
      if(!container) return;
      if(filtered.length === 0) {
        container.innerHTML = '<p class="small">No items match your search (demo)</p>';
        return;
      }
      container.innerHTML = filtered.map(p => `
        <div class="product-card card" data-id="${p._id}">
          <button class="favorite-btn ${isFavorited(p._id) ? 'active' : ''}" data-fav="${p._id}">${isFavorited(p._id) ? '♥' : '♡'}</button>
          <img src="${p.img || 'images/sample.jpg'}" alt="${escapeHtml(p.title)}">
          <h4>${escapeHtml(p.title)}</h4>
          <p class="small">${escapeHtml(truncate(p.desc,100))}</p>
          <div class="resource-meta"><span class="badge">${escapeHtml(p.category || 'Misc')}</span><strong>₹${p.price || '—'}</strong></div>
        </div>
      `).join('');
      // rebind handlers
      container.querySelectorAll('.product-card').forEach(card=>{
        const id = card.getAttribute('data-id');
        card.addEventListener('click', (e)=>{ if(e.target.closest('.favorite-btn')) return; openProductModal(parseInt(id,10)); });
      });
      container.querySelectorAll('.favorite-btn').forEach(btn=>{
        const id = parseInt(btn.getAttribute('data-fav'),10);
        btn.addEventListener('click',(e)=>{ e.stopPropagation(); toggleFavorite(id); loadProducts(); });
      });
    };
    searchInput.addEventListener('input', doFilter);
    searchCategory.addEventListener('change', doFilter);
  }
});
/* ================= Export / Import & navbar badge ================= */

// update favorite count badge in navbar (call this after any fav change or on load)
function updateFavBadge(){
  try{
    const favs = safeParse('favorites_v1');
    const el = document.getElementById('favCount');
    if(el) el.innerText = (Array.isArray(favs) ? favs.length : 0);
  }catch(e){}
}

// Build the export JSON (collect keys we use in demo)
function buildExportJson(){
  const payload = {
    products: safeParse('products'),
    favorites: safeParse('favorites_v1'),
    // collect all contact threads (keys start with contact_thread_)
    contact_threads: {}
  };
  // enumerate localStorage keys and gather contact threads
  for(let i=0;i<localStorage.length;i++){
    const key = localStorage.key(i);
    if(key && key.startsWith('contact_thread_')){
      try{ payload.contact_threads[key] = JSON.parse(localStorage.getItem(key)); } catch(e){}
    }
  }
  return payload;
}

// download a JSON file
function downloadJson(filename='campus_olx_export.json'){
  const json = buildExportJson();
  const blob = new Blob([JSON.stringify(json, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

// load JSON object into localStorage (overwrites keys used by demo)
function importJsonObject(obj){
  if(!obj) return alert('Invalid JSON object');
  if(Array.isArray(obj.products)) save('products', obj.products);
  if(Array.isArray(obj.favorites)) save('favorites_v1', obj.favorites);
  if(obj.contact_threads && typeof obj.contact_threads === 'object'){
    Object.keys(obj.contact_threads).forEach(k => {
      try{ localStorage.setItem(k, JSON.stringify(obj.contact_threads[k])); } catch(e){}
    });
  }
  updateFavBadge();
  loadProducts && loadProducts();
  alert('Imported demo data (local only).');
}

// load from selected file input
function handleFileLoad(file){
  if(!file) return alert('No file selected');
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const parsed = JSON.parse(e.target.result);
      document.getElementById('jsonPreview').value = JSON.stringify(parsed, null, 2);
      // keep the parsed object for later import by 'Load selected JSON'
      document.getElementById('jsonPreview').dataset.parsed = JSON.stringify(parsed);
      alert('JSON loaded into preview. Click "Load selected JSON" to import into local demo.');
    }catch(err){
      alert('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
}

// import from textarea content
function importFromTextarea(){
  try{
    const txt = document.getElementById('jsonPreview').value;
    if(!txt) return alert('No JSON in textarea.');
    const parsed = JSON.parse(txt);
    if(!confirm('Importing will overwrite demo keys (products, favorites, contact threads). Continue?')) return;
    importJsonObject(parsed);
  }catch(e){
    alert('Invalid JSON.');
  }
}

// reset demo data (optional)
function resetDemoData(){
  if(!confirm('Reset demo data? This will clear products, favorites and contact threads.')) return;
  localStorage.removeItem('products');
  localStorage.removeItem('favorites_v1');
  // remove contact thread keys
  const toRemove = [];
  for(let i=0;i<localStorage.length;i++){
    const key = localStorage.key(i);
    if(key && key.startsWith('contact_thread_')) toRemove.push(key);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
  updateFavBadge();
  loadProducts && loadProducts();
  alert('Demo data reset.');
}

// wire up modal & buttons (run on DOMContentLoaded)
document.addEventListener('DOMContentLoaded', ()=>{
  updateFavBadge();

  const modal = document.getElementById('jsonModal');
  if(!modal) return;

  document.getElementById('exportBtn').addEventListener('click', ()=> {
    // show modal and populate preview
    document.getElementById('jsonPreview').value = JSON.stringify(buildExportJson(), null, 2);
    modal.classList.add('show');
  });

  document.getElementById('importBtn').addEventListener('click', ()=> {
    // show modal
    document.getElementById('jsonPreview').value = JSON.stringify(buildExportJson(), null, 2);
    modal.classList.add('show');
  });

  document.getElementById('closeJsonModal').addEventListener('click', ()=> modal.classList.remove('show'));

  document.getElementById('downloadJson').addEventListener('click', ()=> downloadJson());

  const fileInput = document.getElementById('jsonFile');
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) handleFileLoad(f);
  });

  document.getElementById('loadJson').addEventListener('click', ()=>{
    const parsed = document.getElementById('jsonPreview').dataset.parsed;
    if(parsed){
      if(!confirm('Importing file will overwrite demo keys. Continue?')) return;
      importJsonObject(JSON.parse(parsed));
      modal.classList.remove('show');
    } else {
      alert('No parsed JSON loaded. Choose a file first or paste JSON into the textarea.');
    }
  });

  document.getElementById('importFromTextarea').addEventListener('click', importFromTextarea);
  document.getElementById('resetDemo').addEventListener('click', resetDemoData);
});
