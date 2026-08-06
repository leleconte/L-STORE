
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
function buildSummary(){if(!form||!summary)return;const f=new FormData(form);const lines=['RICHIESTA L-STORE','',`Nome / server: ${f.get('name')||'-'}`,`Servizio: ${f.get('service')||'-'}`,`Budget: ${f.get('budget')||'-'}`,`Tempistiche: ${f.get('timing')||'-'}`,'',`Dettagli:\n${f.get('details')||'-'}`];summary.textContent=lines.join('\n')}
if(form){form.addEventListener('input',buildSummary);buildSummary();form.addEventListener('submit',e=>{e.preventDefault();buildSummary();const blob=new Blob([summary.textContent],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='richiesta-l-store.txt';a.click();URL.revokeObjectURL(a.href);toast('Riepilogo scaricato')});const c=$('#copyRequest');if(c)c.addEventListener('click',async()=>{buildSummary();try{await navigator.clipboard.writeText(summary.textContent);toast('Richiesta copiata')}catch{toast('Copia non disponibile')}})}
