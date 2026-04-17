/* ===============================
   script.js (COMPLETO)
================================ */

/* ===============================
   Contador
================================ */
const dataInicio = new Date(2025, 11, 20);

function atualizarContador() {
    const agora = new Date();
    const dias = Math.floor((agora - dataInicio) / (1000 * 60 * 60 * 24));
    const counter = document.getElementById('counter');
    if (counter) {
        counter.innerText = `Desde ${dataInicio.toLocaleDateString('pt-BR')} vivendo ${dias} dias com você 💖`;
    }
}

/* ===============================
   Música
================================ */
const audio = document.getElementById('bgMusic');
const btnMusic = document.getElementById('playMusic');

if (btnMusic && audio) {
    btnMusic.addEventListener('click', () => {
        audio.play().catch(() => {});
        btnMusic.classList.add('hidden');
    });
}

/* ===============================
   Carta que se escreve sozinha
================================ */
const textoCarta = `Jezz, feliz 4 meses com você 💖

Eu amo como a gente se entende, como você me faz bem e como cada momento ao seu lado vira lembrança boa.

Obrigado por ser você.
Eu te amo.`;

function escreverTextoDigitando(texto, elemento, velocidade = 35) {
    if (!elemento) return;

    elemento.textContent = '';
    let i = 0;

    function digitar() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(digitar, velocidade);
        }
    }
    digitar();
}

function iniciarCarta() {
    const el = document.getElementById('cartaTexto');
    escreverTextoDigitando(textoCarta, el, 28);
}

const btnReplay = document.getElementById('replayCarta');
if (btnReplay) {
    btnReplay.addEventListener('click', () => iniciarCarta());
}

/* ===============================
   Gerador de Motivos
================================ */
const motivosArray = [
    "Amo o jeito que você sorri quando me vê.",
    "Cada segundo com você parece um sonho.",
    "Você me faz querer ser uma pessoa melhor todos os dias.",
    "Amo como a gente se entende só com um olhar.",
    "Sua companhia é o meu lugar favorito no mundo.",
    "Amo a sua risada, ela ilumina o meu dia.",
    "Você é a parte mais bonita da minha rotina.",
    "Me perco no seu olhar toda vez que te vejo.",
    "Amo a forma como você cuida de mim.",
    "Cada momento ao seu lado é um presente que eu agradeço todos os dias.",
    "Você é a melhor coisa que já me aconteceu.",
    "Amo seu cheiro, ele é o meu perfume favorito.",
    "Amo como você me entende mesmo quando eu não digo nada.",
    "Você é a razão de muitos dos meus sorrisos.",
];

const btnMotivo = document.getElementById('btnMotivo');
const motivoTexto = document.getElementById('motivoTexto');

if (btnMotivo && motivoTexto) {
    btnMotivo.addEventListener('click', () => {
        motivoTexto.style.opacity = 0;
        
        setTimeout(() => {
            const indexAleatorio = Math.floor(Math.random() * motivosArray.length);
            motivoTexto.textContent = `"${motivosArray[indexAleatorio]}"`;
            motivoTexto.style.opacity = 1;
        }, 300);
    });
}

/* ===============================
   Cupons Românticos
================================ */
const cupons = document.querySelectorAll('.cupom-card');
cupons.forEach(cupom => {
    cupom.addEventListener('click', () => {
        cupom.classList.toggle('flipped');
    });
});

/* ===============================
   Modo Cinema (Replay automático)
================================ */
const cinemaBtn = document.getElementById('btnCinema');
const cinemaOverlay = document.getElementById('cinemaOverlay');
const cinemaClose = document.getElementById('cinemaClose');
const cinemaMedia = document.getElementById('cinemaMedia');
const cinemaCaption = document.getElementById('cinemaCaption');
const cinemaPrev = document.getElementById('cinemaPrev');
const cinemaNext = document.getElementById('cinemaNext');
const cinemaPlayPause = document.getElementById('cinemaPlayPause');
const cinemaBar = document.getElementById('cinemaBar');

let cinemaLista = [];
let cinemaIndex = 0;
let cinemaTimer = null;
let cinemaRunning = false;

const CINEMA_TEMPO_MS = 4500;

function coletarMomentosDoDOM() {
    const cards = Array.from(document.querySelectorAll('.moment-card'));
    const itens = [];

    cards.forEach(card => {
        const info = card.querySelector('.moment-info')?.textContent?.trim() || '💖';

        const video = card.querySelector('video');
        const img = card.querySelector('img');

        if (video) {
            const srcTag = video.querySelector('source');
            const src = srcTag?.getAttribute('src') || video.getAttribute('src') || video.currentSrc;
            if (src) itens.push({ tipo: 'video', src, legenda: info });
        } else if (img) {
            const src = img.getAttribute('src');
            if (src) itens.push({ tipo: 'image', src, legenda: info });
        }
    });

    return itens;
}

function montarListaCinema() {
    cinemaLista = coletarMomentosDoDOM().filter(x => x?.src);
    if (cinemaLista.length === 0) {
        cinemaLista = [{ tipo: 'image', src: '', legenda: 'Sem momentos para exibir 💖' }];
    }
}

function resetProgressBar() {
    if (!cinemaBar) return;
    cinemaBar.style.transition = 'none';
    cinemaBar.style.width = '0%';
    void cinemaBar.offsetWidth;
    cinemaBar.style.transition = `width ${CINEMA_TEMPO_MS}ms linear`;
    cinemaBar.style.width = '100%';
}

function renderCinemaItem() {
    if (!cinemaMedia || !cinemaCaption) return;
    const item = cinemaLista[cinemaIndex];
    if (!item) return;

    cinemaMedia.classList.remove('fade-in');
    cinemaMedia.innerHTML = '';

    if (item.tipo === 'video') {
        const v = document.createElement('video');
        v.src = item.src;
        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.loop = true;
        v.className = 'cinema-video';
        cinemaMedia.appendChild(v);
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = '';
        img.className = 'cinema-img';
        cinemaMedia.appendChild(img);
    }

    cinemaCaption.textContent = item.legenda || '💖';

    requestAnimationFrame(() => {
        cinemaMedia.classList.add('fade-in');
    });

    resetProgressBar();
}

function cinemaNextItem() {
    if (!cinemaLista.length) return;
    cinemaIndex = (cinemaIndex + 1) % cinemaLista.length;
    renderCinemaItem();
}

function cinemaPrevItem() {
    if (!cinemaLista.length) return;
    cinemaIndex = (cinemaIndex - 1 + cinemaLista.length) % cinemaLista.length;
    renderCinemaItem();
}

function cinemaStartLoop() {
    cinemaStopLoop();
    cinemaRunning = true;
    if (cinemaPlayPause) cinemaPlayPause.textContent = '⏸';

    cinemaTimer = setInterval(() => {
        cinemaNextItem();
    }, CINEMA_TEMPO_MS);
}

function cinemaStopLoop() {
    if (cinemaTimer) clearInterval(cinemaTimer);
    cinemaTimer = null;
    cinemaRunning = false;
    if (cinemaPlayPause) cinemaPlayPause.textContent = '▶';

    if (cinemaBar) {
        const computed = getComputedStyle(cinemaBar);
        const width = computed.width;
        cinemaBar.style.transition = 'none';
        cinemaBar.style.width = width;
    }
}

function cinemaToggleLoop() {
    if (cinemaRunning) cinemaStopLoop();
    else {
        resetProgressBar();
        cinemaStartLoop();
    }
}

function abrirCinema() {
    if (!cinemaOverlay) return;

    montarListaCinema();
    cinemaIndex = 0;
    renderCinemaItem();

    cinemaOverlay.classList.add('show');
    cinemaOverlay.setAttribute('aria-hidden', 'false');

    if (audio) audio.play().catch(() => {});
    if (btnMusic) btnMusic.classList.add('hidden');

    cinemaStartLoop();
}

function fecharCinema() {
    if (!cinemaOverlay) return;

    cinemaStopLoop();
    cinemaOverlay.classList.remove('show');
    cinemaOverlay.setAttribute('aria-hidden', 'true');

    const v = cinemaOverlay.querySelector('video');
    if (v) v.pause();
}

if (cinemaBtn) cinemaBtn.addEventListener('click', abrirCinema);
if (cinemaClose) cinemaClose.addEventListener('click', fecharCinema);

if (cinemaOverlay) {
    cinemaOverlay.addEventListener('click', (e) => {
        if (e.target === cinemaOverlay) fecharCinema();
    });
}

if (cinemaNext) cinemaNext.addEventListener('click', () => {
    cinemaNextItem();
    if (cinemaRunning) cinemaStartLoop();
});

if (cinemaPrev) cinemaPrev.addEventListener('click', () => {
    cinemaPrevItem();
    if (cinemaRunning) cinemaStartLoop();
});

if (cinemaPlayPause) cinemaPlayPause.addEventListener('click', cinemaToggleLoop);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaOverlay?.classList.contains('show')) {
        fecharCinema();
    }
});

/* ===============================
   MODO UNIVERSO (Canvas de estrelas + mensagem)
================================ */
const btnUniverse = document.getElementById('btnUniverse');
const universeStatus = document.getElementById('universeStatus');
const universeCanvas = document.getElementById('universeCanvas');
const universeMessage = document.getElementById('universeMessage');
const ctx = universeCanvas ? universeCanvas.getContext('2d') : null;

let universeOn = false;
let stars = [];
let rafId = null;

function starCountForArea(w, h) {
    const area = w * h;
    const base = Math.floor(area / 9000);
    return Math.max(120, Math.min(base, 380));
}

function resizeUniverse() {
    if (!universeCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    universeCanvas.width = Math.floor(window.innerWidth * dpr);
    universeCanvas.height = Math.floor(window.innerHeight * dpr);
    universeCanvas.style.width = '100%';
    universeCanvas.style.height = '100%';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createStars() {
    stars = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = starCountForArea(w, h);

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.2,
            a: Math.random() * 0.55 + 0.15,
            tw: Math.random() * 0.02 + 0.003,
            sp: Math.random() * 0.12 + 0.02,
            d: Math.random() < 0.5 ? -1 : 1
        });
    }
}

function drawUniverse() {
    if (!ctx || !universeCanvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(w * 0.65, h * 0.35, 20, w * 0.65, h * 0.35, Math.max(w, h));
    g.addColorStop(0, 'rgba(160, 90, 255, 0.10)');
    g.addColorStop(0.45, 'rgba(70, 160, 255, 0.06)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
        s.a += s.tw * s.d;
        if (s.a > 0.9) s.d = -1;
        if (s.a < 0.12) s.d = 1;

        s.y += s.sp;
        if (s.y > h + 10) {
            s.y = -10;
            s.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
    }
}

function loopUniverse() {
    if (!universeOn) return;
    drawUniverse();
    rafId = requestAnimationFrame(loopUniverse);
}

function setUniverseUI(on) {
    document.body.classList.toggle('universe-on', on);
    if (universeStatus) universeStatus.textContent = on ? 'ligado' : 'desligado';
    if (btnUniverse) btnUniverse.textContent = on ? '🌌 Modo Universo (ON)' : '🌌 Modo Universo';
}

function mostrarMensagemUniverso() {
    if (!universeMessage) return;

    universeMessage.classList.remove('show');
    universeMessage.setAttribute('aria-hidden', 'false');

    void universeMessage.offsetWidth;

    universeMessage.classList.add('show');

    setTimeout(() => {
        universeMessage.classList.remove('show');
        universeMessage.setAttribute('aria-hidden', 'true');
    }, 3050);
}

function startUniverse() {
    universeOn = true;
    setUniverseUI(true);

    resizeUniverse();
    createStars();

    if (rafId) cancelAnimationFrame(rafId);
    loopUniverse();

    mostrarMensagemUniverso();

    if (audio) audio.play().catch(() => {});
    if (btnMusic) btnMusic.classList.add('hidden');
}

function stopUniverse() {
    universeOn = false;
    setUniverseUI(false);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function toggleUniverse() {
    if (universeOn) stopUniverse();
    else startUniverse();
}

if (btnUniverse) btnUniverse.addEventListener('click', toggleUniverse);

window.addEventListener('resize', () => {
    if (!universeOn) return;
    resizeUniverse();
    createStars();
});

/* ===============================
   NOVA FUNCIONALIDADE: Botão de Pânico (Dia Ruim)
================================ */
const btnDiaRuim = document.getElementById('btnDiaRuim');
const diaRuimOverlay = document.getElementById('diaRuimOverlay');
const diaRuimClose = document.getElementById('diaRuimClose');
let audioFoiPausadoPeloPânico = false;

function abrirDiaRuim() {
    if (!diaRuimOverlay) return;
    diaRuimOverlay.classList.add('show');
    diaRuimOverlay.setAttribute('aria-hidden', 'false');
    
    // Pausar música principal (se estiver tocando) para trazer paz
    if (audio && !audio.paused) {
        audio.pause();
        audioFoiPausadoPeloPânico = true;
    }
}

function fecharDiaRuim() {
    if (!diaRuimOverlay) return;
    diaRuimOverlay.classList.remove('show');
    diaRuimOverlay.setAttribute('aria-hidden', 'true');
    
    // Retornar música se foi pausada pelo botão de pânico
    if (audioFoiPausadoPeloPânico && audio) {
        audio.play().catch(() => {});
        audioFoiPausadoPeloPânico = false;
    }
}

if (btnDiaRuim) btnDiaRuim.addEventListener('click', abrirDiaRuim);
if (diaRuimClose) diaRuimClose.addEventListener('click', fecharDiaRuim);

// Fechar ao clicar fora da caixinha principal
if (diaRuimOverlay) {
    diaRuimOverlay.addEventListener('click', (e) => {
        if (e.target === diaRuimOverlay) fecharDiaRuim();
    });
}

// Fechar com a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && diaRuimOverlay?.classList.contains('show')) {
        fecharDiaRuim();
    }
});

/* ===============================
   Init
================================ */
window.onload = () => {
    atualizarContador();
    iniciarCarta();
    resizeUniverse();
};