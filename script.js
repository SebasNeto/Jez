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
const textoCarta = `Jezz, feliz 2 meses com você 💖

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

const STORAGE_KEY = 'nossosMomentos'; // (se você já tinha momentos salvos antes, o cinema também inclui)

let cinemaLista = [];
let cinemaIndex = 0;
let cinemaTimer = null;
let cinemaRunning = false;

const CINEMA_TEMPO_MS = 4500;

function getMomentosSalvos() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function coletarMomentosDoDOM() {
    const cards = Array.from(document.querySelectorAll('.moment-card'));
    const itens = [];

    cards.forEach(card => {
        const info = card.querySelector('.moment-info')?.textContent?.trim() || '💖';

        const video = card.querySelector('video');
        const img = card.querySelector('img');

        if (video) {
            // pega source se existir; fallback pra currentSrc
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
    const dom = coletarMomentosDoDOM();

    // inclui momentos salvos no localStorage (se existirem)
    const salvos = getMomentosSalvos().map(m => ({
        tipo: m.tipo === 'video' ? 'video' : 'image',
        src: m.dados,
        legenda: m.legenda || '💖'
    }));

    // Para evitar duplicar se você já tiver cards do storage no DOM (não tem agora),
    // a gente só concatena.
    cinemaLista = [...dom, ...salvos].filter(x => x?.src);

    if (cinemaLista.length === 0) {
        cinemaLista = [{ tipo: 'image', src: '', legenda: 'Sem momentos para exibir 💖' }];
    }
}

function resetProgressBar() {
    if (!cinemaBar) return;
    cinemaBar.style.transition = 'none';
    cinemaBar.style.width = '0%';
    // força reflow
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
        v.muted = true;        // evita briga com a música
        v.playsInline = true;
        v.loop = true;         // como a troca é por tempo, loop é ok
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

    // animação de entrada
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
    // congela barra
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

    // tenta tocar música e esconder botão (se ainda estiver visível)
    if (audio) audio.play().catch(() => {});
    if (btnMusic) btnMusic.classList.add('hidden');

    cinemaStartLoop();
}

function fecharCinema() {
    if (!cinemaOverlay) return;

    cinemaStopLoop();
    cinemaOverlay.classList.remove('show');
    cinemaOverlay.setAttribute('aria-hidden', 'true');

    // pausa qualquer vídeo que estiver no overlay
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
    if (cinemaRunning) cinemaStartLoop(); // reseta timer
});

if (cinemaPrev) cinemaPrev.addEventListener('click', () => {
    cinemaPrevItem();
    if (cinemaRunning) cinemaStartLoop(); // reseta timer
});

if (cinemaPlayPause) cinemaPlayPause.addEventListener('click', cinemaToggleLoop);

// tecla ESC fecha
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaOverlay?.classList.contains('show')) {
        fecharCinema();
    }
});

/* ===============================
   Init
================================ */
window.onload = () => {
    atualizarContador();
    iniciarCarta();
};

