const data = [
    { id: 1, year: "1971", title: "Intel 4004", desc: "El primer microprocesador comercial. Contenía 2,300 transistores y ejecutaba 60,000 operaciones por segundo.", model: "entity-microchip" },
    { id: 2, year: "Años 80s", title: "Disquete 3.5\"", desc: "La forma universal de guardar datos por décadas. Su capacidad máxima era 1.44 MB.", model: "entity-floppy" },
    { id: 3, year: "1981", title: "IBM PC 5150", desc: "El equipo que definió el estándar 'PC'. ¡El inicio de la era personal!", model: "entity-pc" },
    { id: 101, year: "1982", title: "El CD-ROM", desc: "El Disco Compacto revolucionó el almacenamiento. Capaz de guardar 700MB de música digital.", model: "entity-cd" },
    { id: 4, year: "1984", title: "Macintosh", desc: "Primera computadora popular con mouse e interfaz gráfica. 'Hello, I'm Macintosh'.", model: "entity-mac" },
    { id: 5, year: "1991", title: "WWW", desc: "Tim Berners-Lee inventa la web. El primer sitio solo tenía texto.", model: "entity-www" },
    { id: 102, year: "Años 90s", title: "La Laptop", desc: "Las computadoras portátiles se vuelven poderosas para llevar la oficina a cualquier parte.", model: "entity-laptop" },
    { id: 103, year: "2000", title: "Memoria USB", desc: "Adiós a los disquetes. Gigabytes de información en el bolsillo.", model: "entity-usb" },
    { id: 104, year: "2005", title: "PC Multimedia", desc: "Torres para gaming y video en alta definición.", model: "entity-pc-moderna" },
    { id: 6, year: "2007", title: "Primer iPhone", desc: "Revolucionó la telefonía. Pantalla táctil, internet y apps.", model: "entity-smartphone" },
    { id: 105, year: "2010", title: "La Tablet", desc: "Dispositivos como el iPad crearon una nueva categoría de movilidad.", model: "entity-tablet" },
    { id: 106, year: "Hoy", title: "Procesadores", desc: "CPUs con miles de millones de transistores y múltiples núcleos.", model: "entity-cpu-moderno" },
    { id: 7, year: "Actualidad", title: "IA", desc: "Redes neuronales y aprendizaje automático transformando industrias.", model: "entity-ai" }
];

let index = 0;
let isPlaying = false;

const infoPanel = document.getElementById('info-panel');
const welcomeScreen = document.getElementById('welcome-screen');
const dotsContainer = document.getElementById('dots-container');
const modal = document.getElementById('modal-logout');

// Puntos
data.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = `p-dot ${i===0 ? 'active' : ''}`;
    d.style.width = "4px"; d.style.height = "4px";
    dotsContainer.appendChild(d);
});

// --- LÓGICA DE MODAL ---
function openModal() {
    modal.classList.add('active');
}
function closeModal() {
    modal.classList.remove('active');
}
function confirmLogout() {
    closeModal();
    // Efecto Apagado
    document.body.style.filter = "grayscale(100%) brightness(0)";
    setTimeout(() => {
        // Ocultamos completamente la escena AR
        const aScene = document.querySelector('a-scene');
        if (aScene) {
            aScene.style.display = 'none';
        }
        
        // Restauramos la pantalla de bienvenida
        document.body.style.filter = "";
        welcomeScreen.style.display = 'flex';
        welcomeScreen.style.opacity = '1';
        infoPanel.style.transform = 'translateX(-50%) translateY(120%)';
        
        // Reiniciamos estado
        index = 0;
        updateUI();
        window.speechSynthesis.cancel();
        
        // También reseteamos el estado del marcador
        statusPill.classList.remove('active');
        statusText.innerText = "Escaneando...";
    }, 800);
}

// --- INICIO ---
function startApp() {
    const silentUtterance = new SpeechSynthesisUtterance("");
    silentUtterance.volume = 0;
    window.speechSynthesis.speak(silentUtterance);

    // Mostramos la escena AR
    const aScene = document.querySelector('a-scene');
    if (aScene) {
        aScene.style.display = 'block';
    }

    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        infoPanel.style.transform = 'translateX(-50%) translateY(0)';
        updateUI();
        speak(); 
    }, 800);
}

const marker = document.querySelector('#main-marker');
const statusPill = document.getElementById('status-pill');
const statusText = document.getElementById('status-text');

marker.addEventListener('markerFound', () => {
    statusPill.classList.add('active');
    statusText.innerText = "Objetivo Localizado";
});

marker.addEventListener('markerLost', () => {
    statusPill.classList.remove('active');
    statusText.innerText = "Buscando Marcador...";
});

function moveSlide(dir) {
    index += dir;
    if (index < 0) index = 0;
    if (index >= data.length) index = data.length - 1;
    
    updateUI();
    update3D();
    speak(); 
}

function updateUI() {
    const item = data[index];
    document.getElementById('txt-year').innerText = item.year;
    document.getElementById('txt-title').innerText = item.title;
    document.getElementById('txt-desc').innerText = item.desc;
    
    document.getElementById('btn-prev').disabled = index === 0;
    const nextBtn = document.getElementById('btn-next');
    nextBtn.innerHTML = index === data.length - 1 ? 'Fin <i class="ph-bold ph-check"></i>' : 'Sig. <i class="ph-bold ph-arrow-right"></i>';

    document.querySelectorAll('.p-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
        d.style.width = (i === index) ? "16px" : "4px";
    });
}

function update3D() {
    data.forEach(d => {
        const el = document.getElementById(d.model);
        if(el) el.setAttribute('visible', 'false');
    });
    const cur = document.getElementById(data[index].model);
    if(cur) cur.setAttribute('visible', 'true');
}

function speak() {
    window.speechSynthesis.cancel();
    const item = data[index];
    const utterance = new SpeechSynthesisUtterance(`${item.title}. ${item.desc}`);
    utterance.lang = "es-MX";
    utterance.rate = 1.0;

    utterance.onstart = () => { isPlaying = true; updateAudioUI(true); };
    utterance.onend = () => { isPlaying = false; updateAudioUI(false); };
    window.speechSynthesis.speak(utterance);
}

function togglePlay() {
    if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            isPlaying = true;
            updateAudioUI(true);
        } else {
            window.speechSynthesis.pause();
            isPlaying = false;
            updateAudioUI(false);
        }
    } else {
        speak();
    }
}

function resetAudio() {
    speak();
}

function updateAudioUI(playing) {
    const btn = document.getElementById('btn-play');
    const eq = document.getElementById('equalizer');
    const label = document.getElementById('audio-label');
    
    if (playing) {
        btn.innerHTML = '<i class="ph-fill ph-pause"></i>';
        eq.classList.add('playing');
        label.innerText = "Reproduciendo";
        label.style.color = "var(--accent)";
    } else {
        btn.innerHTML = '<i class="ph-fill ph-play"></i>';
        eq.classList.remove('playing');
        label.innerText = window.speechSynthesis.paused ? "Pausado" : "Escuchar Info";
        label.style.color = "var(--text-gray)";
    }
}