// CONFIGURACIÓN DE DATOS
const data = {
    techlens: { 
        title: "FIG. 01 — NEBULA KERNEL STATION",
        desc: "Estación de desarrollo backend. Ejecutando entorno UNIX en tiempo real para gestión de redes neuronales y ciberseguridad ofensiva. La herramienta definitiva del Arquitecto de Sistemas."
    }
};

// REFERENCIAS AL DOM
const uiCard = document.getElementById('info-card');
const uiTitle = document.getElementById('obj-title');
const uiDesc = document.getElementById('obj-desc');
const marker = document.querySelector('#marker-techlens');

// EVENTO: MARCADOR DETECTADO
marker.addEventListener('markerFound', () => {
    // Actualizar texto
    uiTitle.innerText = data.techlens.title;
    uiDesc.innerText = data.techlens.desc;
    
    // Mostrar tarjeta con animación
    uiCard.classList.add('visible');
    console.log("System Marker Detected: Access Granted.");
});

// EVENTO: MARCADOR PERDIDO
marker.addEventListener('markerLost', () => {
    // Ocultar tarjeta
    uiCard.classList.remove('visible');
    console.log("Signal Lost.");
});