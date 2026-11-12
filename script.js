// ===== Data destinasi =====
const destinations = [
  {n:'Gunung Bromo',l:'Probolinggo, Jawa Timur',c:['populer','gunung'],img:'bromo.jpg'},
  {n:'Pantai Klayar',l:'Pacitan, Jawa Timur',c:['populer','pantai'],img:'klayar.jpg'},
  {n:'Telaga Sarangan',l:'Magetan, Jawa Timur',c:['populer','gunung'],img:'sarangan.jpg'},
  {n:'Hutan Djawatan',l:'Banyuwangi, Jawa Timur',c:['populer'],img:'djawatan.jpg'},
  {n:'Kawah Ijen',l:'Banyuwangi, Jawa Timur',c:['gunung'],img:'ijen.jpg'},
  {n:'Gunung Semeru',l:'Lumajang, Jawa Timur',c:['gunung'],img:'semeru.jpg'},
  {n:'Pantai Papuma',l:'Jember, Jawa Timur',c:['pantai'],img:'papuma.jpg'},
  {n:'Pantai Balekambang',l:'Malang, Jawa Timur',c:['pantai'],img:'balekambang.jpg'},
  {n:'Tumpak Sewu',l:'Lumajang, Jawa Timur',c:['airterjun'],img:'tumpaksewu.jpg'},
  {n:'Coban Rondo',l:'Malang, Jawa Timur',c:['airterjun'],img:'cobanrondo.jpg'},
  {n:'Air Terjun Madakaripura',l:'Probolinggo, Jawa Timur',c:['airterjun'],img:'madakaripura.jpg'},
  {n:'Candi Penataran',l:'Blitar, Jawa Timur',c:['sejarah'],img:'penataran.jpg'},
  {n:'Kota Lama Surabaya',l:'Surabaya, Jawa Timur',c:['sejarah'],img:'kotalama.jpg'},
  {n:'Situs Trowulan',l:'Mojokerto, Jawa Timur',c:['sejarah'],img:'trowulan.jpg'}
];
let cat = 'populer', showAll = false;
const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

function renderCards(){
  const list = destinations.filter(d => d.c.includes(cat));
  const shown = showAll ? destinations.filter(d=>true) : list.slice(0,4);
  const data = showAll ? destinations : shown;
  $('#cards').innerHTML = data.map(d =>
    `<article class="card"><img src="images/${d.n}.png" alt="${d.n}" loading="lazy"><h3>${d.n}</h3><p>${d.l}</p></article>`).join('');
  $('#moreDest').textContent = showAll ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Destinasi';
}
$('#tabs').addEventListener('click', e => {
  const t = e.target.closest('.tab'); if(!t) return;
  $$('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active'); cat = t.dataset.cat; showAll = false; renderCards();
});
$('#moreDest').addEventListener('click', () => { showAll = !showAll; renderCards(); });
renderCards();

// ===== Navbar: shadow, burger, active link =====
const nav = $('#navbar'), toTop = $('#toTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 10);
  toTop.classList.toggle('show', scrollY > 500);
});
toTop.onclick = () => scrollTo({top:0});
$('#burger').onclick = () => $('#menu').classList.toggle('open');
$$('.menu a').forEach(a => a.addEventListener('click', () => $('#menu').classList.remove('open')));
const links = [...$$('.menu a')];
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), {rootMargin:'-40% 0px -55% 0px'});
$$('main section[id]').forEach(s => io.observe(s));

// ===== Video play (TikTok) =====
$('#playBtn').onclick = () => {
  const box = $('#videoThumb');
  box.style.transform = 'none';
  box.innerHTML = '<iframe src="https://www.tiktok.com/embed/v2/7652955014058511623" title="Jeep Bromo Tour" allowfullscreen allow="encrypted-media; fullscreen" style="width:100%;height:580px;border:0;display:block"></iframe>';
};

// ===== Newsletter =====
$('#subForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#email').value.trim(), m = $('#subMsg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ m.textContent = 'Alamat email tidak valid. Periksa lagi, lalu coba kirim ulang.'; m.className = 'msg error'; return; }
  m.textContent = 'Terima kasih! Kamu sudah berlangganan.'; m.className = 'msg ok'; e.target.reset();
});

// ===== Modal Login / Register =====
const modal = $('#modal'); let mode = 'Login';
function openModal(t){
  mode = t; $('#modalTitle').textContent = t; $('#authSubmit').textContent = t;
  $('#name').hidden = t === 'Login'; $('#authErr').textContent = ''; modal.hidden = false; $('#mEmail').focus();
}
$$('[data-modal]').forEach(b => b.onclick = () => openModal(b.dataset.modal));
const closeM = () => modal.hidden = true;
$('#closeModal').onclick = closeM;
modal.addEventListener('click', e => { if(e.target === modal) closeM(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeM(); });
$('#authForm').addEventListener('submit', e => {
  e.preventDefault();
  const err = $('#authErr');
  if(mode === 'Register' && !$('#name').value.trim()) return err.textContent = 'Nama lengkap wajib diisi.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#mEmail').value)) return err.textContent = 'Format email belum benar.';
  if($('#mPass').value.length < 6) return err.textContent = 'Kata sandi minimal 6 karakter.';
  alert(mode + ' berhasil!'); e.target.reset(); closeM();
});

// ===== Gambar: otomatis coba format .jpg .jpeg .png .webp .jfif .avif =====
const EXT = ['jpg','jpeg','png','webp','jfif','avif','JPG','PNG'];
function handleBroken(img){
  const n = +(img.dataset.try || 0);
  if(n < EXT.length){
    img.dataset.try = n + 1;
    img.src = img.getAttribute('src').replace(/\.[a-zA-Z0-9]+$/, '.' + EXT[n]);
  } else {
    if(img.alt){ img.setAttribute('aria-label', img.alt); img.alt = ''; }
    img.removeAttribute('src');
  }
}
document.addEventListener('error', e => { if(e.target.tagName === 'IMG') handleBroken(e.target); }, true);
$$('img').forEach(i => { if(i.complete && i.naturalWidth === 0) handleBroken(i); });

