const dataInicio = new Date(2025, 11, 20);

function atualizarContador() {
    const agora = new Date();
    const diferenca = agora - dataInicio;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);

    const counterElement = document.getElementById('counter');

    counterElement.innerText =
        `Desde ${dataInicio.toLocaleDateString('pt-BR')} vivendo ${dias} dias (${meses} meses) com você 💖`;
}

// Revelação suave ao rolar
function revelarCards() {
    const cards = document.querySelectorAll('.moment-card');

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

window.onload = () => {
    atualizarContador();
    revelarCards();
};

window.addEventListener('scroll', revelarCards);
