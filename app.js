const state={tab:'new',captcha:'',logged:false};

const tabs={
  new:{title:'New', heading:'New Orders'},
  pro:{title:'Pro', heading:'Processing'},
  com:{title:'Com', heading:'Completed'},
  ptp:{title:'PTP', heading:'Promise To Pay'},
  mark:{title:'Mark', heading:'Marked Orders'}
};

document.addEventListener('DOMContentLoaded',()=>{
  refreshCaptcha();
  document.getElementById('loginBtn').addEventListener('click',login);
});

function refreshCaptcha(){
  state.captcha=Math.random().toString(36).slice(2,7).toUpperCase();
  document.getElementById('captchaBox').textContent=state.captcha;
}
function togglePassword(){
  const x=document.getElementById('password');
  x.type=x.type==='password'?'text':'password';
}
function login(){
  const u=document.getElementById('username').value.trim();
  const p=document.getElementById('password').value;
  const c=document.getElementById('captcha').value.trim().toUpperCase();
  const msg=document.getElementById('loginMessage');
  if(!u||!p){msg.textContent='Please enter username and password.';return}
  if(c!==state.captcha){msg.textContent='Invalid code. Please try again.';refreshCaptcha();return}
  msg.textContent='';
  state.logged=true;
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainScreen').classList.remove('hidden');
  switchTab('new');
}

function switchTab(tab){
  state.tab=tab;
  document.querySelectorAll('#bottomNav button').forEach(b=>{
    b.classList.toggle('active',b.dataset.tab===tab);
    const img=b.querySelector('img');
    if(img){
      const name=tab===b.dataset.tab?`tab-${tab}-select.png`:`tab-${b.dataset.tab}-normal.png`;
      img.src=`assets/${name}`;
    }
  });
  document.getElementById('pageSubtitle').textContent=tab==='me'?'Mine':tabs[tab]?.title||'Home';
  renderPage();
}

function renderPage(){
  const page=document.getElementById('page');
  if(state.tab==='me'){renderMe(page);return}
  const t=tabs[state.tab];
  page.innerHTML=`
    <div class="filters">
      <button class="filter active">All</button>
      <button class="filter">Today</button>
      <button class="filter">Overdue</button>
      <button class="filter">Follow-up</button>
    </div>
    <div class="stats">
      <div class="stat"><b>${state.tab==='new'?'18':'06'}</b><span>Total</span></div>
      <div class="stat"><b>${state.tab==='ptp'?'09':'12'}</b><span>Pending</span></div>
      <div class="stat"><b>${state.tab==='mark'?'04':'07'}</b><span>Completed</span></div>
    </div>
    <div class="card" style="margin-top:12px">
      <div class="card-head"><span class="card-title">${t.heading}</span><button onclick="showSearch()" style="color:#1976e8">Search</button></div>
      <div class="card-body" id="orders"></div>
    </div>`;
  const orders=[
    ['#CS-100245','Ali Raza','PKR 12,500','Overdue 5 days','red'],
    ['#CS-100198','Muhammad Ahmed','PKR 8,000','Promise 20 Sep','orange'],
    ['#CS-100164','Usman Khan','PKR 15,000','Follow-up','green'],
    ['#CS-100132','Hassan Ali','PKR 6,500','Pending','blue']
  ];
  document.getElementById('orders').innerHTML=orders.map(o=>`
    <div class="order" onclick="openOrder('${o[0]}')">
      <div class="order-row"><strong>${o[0]}</strong><span class="tag ${o[4]}">${o[3]}</span></div>
      <div class="order-row"><span class="k">Name</span><span class="v">${o[1]}</span></div>
      <div class="order-row"><span class="k">Amount</span><span class="v">${o[2]}</span></div>
    </div>`).join('');
}

function renderMe(page){
 page.innerHTML=`
  <div class="card me-head">
    <img class="avatar" src="assets/avatar.png" alt="">
    <div><div class="me-name">${escapeHtml(document.getElementById('username').value||'User')}</div><div class="me-sub">Account & profile</div></div>
  </div>
  <div class="card">
    <div class="menu-row" onclick="toast('Profile selected')"><span>Profile</span><span>›</span></div>
    <div class="menu-row" onclick="toast('Code history selected')"><span>Code History</span><span>›</span></div>
    <div class="menu-row" onclick="toast('Settings selected')"><span>Settings</span><span>›</span></div>
    <div class="menu-row" onclick="logout()"><span style="color:#e44">Logout</span><span>›</span></div>
  </div>`;
}
function showSearch(){
 const m=document.createElement('div');
 m.className='modal';
 m.innerHTML=`<div class="modal-box"><h3>Search Order</h3><div class="search-box"><input id="modalSearch" placeholder="Order ID / CNIC / name"></div><div class="modal-actions"><button onclick="this.closest('.modal').remove()">Cancel</button><button class="ok" onclick="doSearch()">Search</button></div></div>`;
 document.body.appendChild(m);
 setTimeout(()=>document.getElementById('modalSearch')?.focus(),50);
}
function doSearch(){
 const v=document.getElementById('modalSearch').value.trim();
 document.querySelector('.modal')?.remove();
 toast(v?`Searching for ${v}`:'Enter a search value');
}
function openOrder(id){
 toast(`Opening ${id}`);
}
function logout(){
 state.logged=false;
 document.getElementById('mainScreen').classList.add('hidden');
 document.getElementById('loginScreen').classList.remove('hidden');
 document.getElementById('password').value='';
 document.getElementById('captcha').value='';
 refreshCaptcha();
}
function toast(text){
 const t=document.getElementById('toast');
 t.textContent=text;t.classList.add('show');
 clearTimeout(window.__toast);
 window.__toast=setTimeout(()=>t.classList.remove('show'),1800);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
