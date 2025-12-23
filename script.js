/* ===============================
   Contador
================================ */
const dataInicio = new Date(2025, 11, 20);

function atualizarContador() {
    const agora = new Date();
    const dias = Math.floor((agora - dataInicio) / (1000 * 60 * 60 * 24));
    document.getElementById('counter').innerText =
        `Desde ${dataInicio.toLocaleDateString('pt-BR')} vivendo ${dias} dias com você 💖`;
}

/* ===============================
   Música
================================ */
const audio = document.getElementById('bgMusic');
const btnMusic = document.getElementById('playMusic');

btnMusic.addEventListener('click', () => {
    audio.play();
    btnMusic.classList.add('hidden');
});

/* ===============================
   Upload + LocalStorage
================================ */
const STORAGE_KEY = 'nossosMomentos';
const mediaInput = document.getElementById('mediaInput');
const captionInput = document.getElementById('captionInput');
const videoGrid = document.querySelector('.video-grid');

function salvarMomentos(momentos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(momentos));
}

function carregarMomentos() {
    const momentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    momentos.forEach((m, index) => criarCard(m, index));
}

function criarCard(momento, index) {
    const card = document.createElement('div');
    card.className = 'moment-card';

    card.innerHTML = `
        <button class="delete-btn">✕</button>
        <div class="video-wrapper">
            ${
                momento.tipo === 'video'
                    ? `<video controls src="${momento.dados}"></video>`
                    : `<img src="${momento.dados}">`
            }
        </div>
        <div class="moment-info">${momento.legenda || '💖'}</div>
    `;

    card.querySelector('.delete-btn').onclick = () => {
        const momentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        momentos.splice(index, 1);
        salvarMomentos(momentos);
        card.remove();
    };

    videoGrid.prepend(card);
}

mediaInput.addEventListener('change', () => {
    const file = mediaInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const momentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        const novoMomento = {
            tipo: file.type.startsWith('video') ? 'video' : 'image',
            dados: reader.result,
            legenda: captionInput.value
        };

        momentos.push(novoMomento);
        salvarMomentos(momentos);
        criarCard(novoMomento, momentos.length - 1);

        captionInput.value = '';
        mediaInput.value = '';
    };

    reader.readAsDataURL(file);
});

/* ===============================
   Init
================================ */
window.onload = () => {
    atualizarContador();
    carregarMomentos();
};


