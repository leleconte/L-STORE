
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const toggle=$('.nav-toggle'), nav=$('.nav-links');
if(toggle) toggle.addEventListener('click',()=>nav.classList.toggle('open'));
$$('.faq button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
const toast=(text)=>{let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)};
const filterBtns=$$('.filter-btn'), cards=$$('.product-card'), search=$('#shopSearch');
function applyFilter(){const active=$('.filter-btn.active')?.dataset.filter||'all';const q=(search?.value||'').toLowerCase();cards.forEach(card=>{const okCat=active==='all'||card.dataset.category===active;const okQ=card.innerText.toLowerCase().includes(q);card.style.display=okCat&&okQ?'flex':'none'})}
filterBtns.forEach(b=>b.addEventListener('click',()=>{filterBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');applyFilter()}));
if(search) search.addEventListener('input',applyFilter);
$$('[data-copy-link]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copyLink);toast('Link PayPal.Me copiato')}catch{toast('Copia non disponibile')}}));
const form=$('#requestForm'), summary=$('#requestSummary');
function parseAmount(value){const normalized=String(value||'').replace(',','.').trim();const amount=Number(normalized);return Number.isFinite(amount)&&amount>0?Math.round(amount*100)/100:0}
function formatEuro(amount){return new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(amount||0)}
function getPriceMode(){return form?.querySelector('input[name="priceMode"]:checked')?.value||''}
function updatePriceMode(){if(!form)return;const mode=getPriceMode();const budgetField=$('#budgetField');const agreedField=$('#agreedField');const paymentSection=$('#customPaymentSection');if(budgetField)budgetField.hidden=mode!=='budget';if(agreedField)agreedField.hidden=mode!=='agreed';if(paymentSection)paymentSection.hidden=mode!=='agreed';if(mode!=='budget'&&$('#budget'))$('#budget').value='';if(mode!=='agreed'&&$('#agreedAmount'))$('#agreedAmount').value='';$$('.price-choice').forEach(card=>card.classList.toggle('selected',card.querySelector('input')?.checked));}
function updateCustomPayment(){if(!form)return;const mode=getPriceMode();const name=$('#name')?.value.trim()||'';const service=$('#service')?.value||'';const amount=parseAmount($('#agreedAmount')?.value);const preview=$('#paymentAmountPreview');const details=$('#paymentDetails');const payButton=$('#customPayButton');if(preview)preview.textContent=formatEuro(amount);if(details)details.textContent=amount?`${name||'Cliente'} • ${service} • ${formatEuro(amount)}`:'Compila nome, servizio e importo per preparare il pagamento.';if(payButton)payButton.disabled=!(mode==='agreed'&&name&&service&&amount>=1)}
function buildSummary(){if(!form||!summary)return;updatePriceMode();const f=new FormData(form);const mode=getPriceMode();const budget=parseAmount(f.get('budget'));const amount=parseAmount(f.get('agreedAmount'));const priceLine=mode==='budget'?`Budget indicativo: ${budget?formatEuro(budget):'-'}`:mode==='agreed'?`Prezzo concordato: ${amount?formatEuro(amount):'-'}`:'Modalità prezzo: non selezionata';const lines=['RICHIESTA L-STORE','',`Nome / server: ${f.get('name')||'-'}`,`Servizio: ${f.get('service')||'-'}`,priceLine,`Tempistiche: ${f.get('timing')||'-'}`,'',`Dettagli:\n${f.get('details')||'-'}`];summary.textContent=lines.join('\n');updateCustomPayment()}
if(form){form.addEventListener('change',buildSummary);form.addEventListener('input',buildSummary);buildSummary();const payButton=$('#customPayButton');if(payButton)payButton.addEventListener('click',()=>{const mode=getPriceMode();const amount=parseAmount($('#agreedAmount')?.value);const name=$('#name')?.value.trim();const service=$('#service')?.value;if(mode!=='agreed'||!name||!service||amount<1){toast('Seleziona prezzo concordato e completa i dati');return}const amountPath=Number.isInteger(amount)?String(amount):amount.toFixed(2);window.open(`https://paypal.me/LSTORE2026/${amountPath}EUR`,'_blank','noopener');});form.addEventListener('submit',e=>{e.preventDefault();if(!getPriceMode()){toast('Scegli budget o prezzo concordato');return}buildSummary();const blob=new Blob([summary.textContent],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='richiesta-l-store.txt';a.click();URL.revokeObjectURL(a.href);toast('Riepilogo scaricato')});const c=$('#copyRequest');if(c)c.addEventListener('click',async()=>{if(!getPriceMode()){toast('Scegli budget o prezzo concordato');return}buildSummary();try{await navigator.clipboard.writeText(summary.textContent);toast('Richiesta copiata')}catch{toast('Copia non disponibile')}})}


// ============================================================
// L-STORE • SHOP/PREVENTIVI -> DISCORD (NO BACKEND WEB)
// ============================================================
const LSTORE_DISCORD_PANEL_URL='https://discord.com/channels/1516383995619708978/1516390796688101398';
const LSTORE_PRODUCTS={
  'benvenuto':{name:'SISTEMA BENVENUTO',price:3,image:'assets/images/products/benvenuto.png'},
  'verification-system':{name:'VERIFICATION SYSTEM',price:3,image:'assets/images/products/verification-system.png'},
  'ticket-v1':{name:'TICKET V1',price:4,image:'assets/images/products/ticket-v1.png'},
  'bot-moderatore':{name:'BOT MODERATORE',price:5,image:'assets/images/products/bot-moderatore.png'},
  'bandi-panel':{name:'BANDI PANEL',price:5,image:'assets/images/products/bandi-panel.png'},
  'ticket-v2':{name:'TICKET V2',price:7,image:'assets/images/products/ticket-v2.png'},
  'security-v1':{name:'SECURITY V1',price:15,image:'assets/images/products/security-v1.png'},
  'website-statico':{name:'WEBSITE STATICO',price:15,image:'assets/images/products/website-statico.png'},
  'website-shop':{name:'WEBSITE CON SHOP',price:20,image:'assets/images/products/website-shop.png'},
  'security-v2':{name:'SECURITY V2',price:25,image:'assets/images/products/security-v2.png'},
  'bot-custom':{name:'BOT CUSTOM COMPLETO',price:30,image:'assets/images/products/bot-custom.png'}
};
function lstoreRandom(prefix){const a=new Uint32Array(2);crypto.getRandomValues(a);return `${prefix}-${Date.now().toString(36).toUpperCase()}-${a[0].toString(36).toUpperCase().slice(0,5)}`}
function lstoreBase64Url(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function lstoreCopy(text){try{await navigator.clipboard.writeText(text);return true}catch{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}}
async function lstoreOpenDiscordWithCode(prefix,payload){const code=`${prefix}.${lstoreBase64Url(payload)}`;await lstoreCopy(code);toast(prefix==='LQUOTE1'?'Codice preventivo copiato • apertura Discord':'Codice ordine copiato • apertura Discord');setTimeout(()=>{window.location.href=LSTORE_DISCORD_PANEL_URL},350)}

// Pagina ordine Shop.
const orderForm=$('#orderForm');
if(orderForm){
  const pid=new URLSearchParams(location.search).get('product')||'';
  const product=LSTORE_PRODUCTS[pid];
  if(!product){location.href='shop.html'}else{
    $('#orderProductName').textContent=product.name;
    $('#orderProductPrice').textContent=formatEuro(product.price);
    const img=$('#orderProductImage');img.src=product.image;img.alt=`Grafica ${product.name}`;
    const openDirect=$('#openDiscordDirect');if(openDirect)openDirect.href=LSTORE_DISCORD_PANEL_URL;
    const pay=$('#orderPayButton'),paid=$('#orderPaidButton');
    pay?.addEventListener('click',()=>{
      const customer=$('#orderCustomer')?.value.trim()||'';const details=$('#orderDetails')?.value.trim()||'';
      if(!customer||!details){toast('Compila nome/server e dettagli prima di pagare');return}
      window.open(`https://paypal.me/LSTORE2026/${product.price}EUR`,'_blank','noopener');
      if(paid)paid.hidden=false;
      const h=$('#orderHelp');if(h)h.innerHTML='Quando il pagamento è completato premi <strong>Ho effettuato il pagamento</strong>. Ti porterò al pannello Discord e il codice ordine sarà già copiato.';
    });
    paid?.addEventListener('click',async()=>{
      const customer=$('#orderCustomer')?.value.trim()||'';const details=$('#orderDetails')?.value.trim()||'';const transaction=$('#orderTransaction')?.value.trim()||'';
      if(!customer||!details){toast('Compila i dati dell’ordine');return}
      await lstoreOpenDiscordWithCode('LSTORE1',{v:1,order_id:lstoreRandom('LST'),mode:'shop',product_id:pid,customer_name:customer,details,transaction_id:transaction,created_at:new Date().toISOString()});
    });
  }
}

// Prezzo concordato: dopo PayPal compare il passaggio ordine Discord.
if(form){
  const customPaid=$('#customPaidButton');
  const quoteBtn=$('#openQuoteDiscord');
  const oldUpdatePriceMode=updatePriceMode;
  updatePriceMode=function(){oldUpdatePriceMode();const mode=getPriceMode();if(quoteBtn)quoteBtn.hidden=mode!=='budget';if(customPaid&&mode!=='agreed')customPaid.hidden=true};
  const oldBuildSummary=buildSummary;
  buildSummary=function(){oldBuildSummary();updatePriceMode()};
  updatePriceMode();
  $('#customPayButton')?.addEventListener('click',()=>{if(getPriceMode()==='agreed'&&parseAmount($('#agreedAmount')?.value)>=1&&customPaid)customPaid.hidden=false});
  customPaid?.addEventListener('click',async()=>{
    const f=new FormData(form);const amount=parseAmount(f.get('agreedAmount'));const customer=String(f.get('name')||'').trim();const service=String(f.get('service')||'').trim();const details=String(f.get('details')||'').trim();
    if(getPriceMode()!=='agreed'||amount<1||!customer||!service||!details){toast('Completa nome, servizio, dettagli e prezzo concordato');return}
    await lstoreOpenDiscordWithCode('LSTORE1',{v:1,order_id:lstoreRandom('LST'),mode:'custom',product_id:'custom',service,amount,customer_name:customer,details,timing:String(f.get('timing')||''),created_at:new Date().toISOString()});
  });
  quoteBtn?.addEventListener('click',async()=>{
    const f=new FormData(form);const customer=String(f.get('name')||'').trim();const service=String(f.get('service')||'').trim();const details=String(f.get('details')||'').trim();
    if(getPriceMode()!=='budget'||!customer||!service||!details){toast('Per il preventivo completa nome, servizio e dettagli');return}
    await lstoreOpenDiscordWithCode('LQUOTE1',{v:1,quote_id:lstoreRandom('PREV'),customer_name:customer,service,details,budget:parseAmount(f.get('budget')),timing:String(f.get('timing')||''),created_at:new Date().toISOString()});
  });
}
