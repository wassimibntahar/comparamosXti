// =============================
//  BUSCADOR GLOBAL COMPARARMOSXTI
// =============================

// Normaliza texto: minúsculas + sin espacios
function normalizar(texto) {
    return texto.toLowerCase().replace(/\s+/g, "");
}

// Cargar base de datos
let BD = [];

fetch('../db.json')
    .then(res => res.json())
    .then(data => {
        BD = data.productos;
        console.log("BD cargada", BD);
    });

// Detecta categoría según modelo normalizado
function buscarProducto(entrada) {
    const clean = normalizar(entrada);

    // Buscar coincidencia por modelo
    return BD.find(p => normalizar(p.modelo).includes(clean));
}

// ========================================
//  CAPTURAR ENTER EN TODAS LAS BÚSQUEDAS
// ========================================

document.querySelectorAll(".busqueda input").forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            procesarBusqueda(input.value);
        }
    });
});

// ===============================
//  LÓGICA PRINCIPAL DEL BUSCADOR
// ===============================
function procesarBusqueda(texto) {
    if (!texto.trim()) return;

    const resultado = buscarProducto(texto);

    if (!resultado) {
        alert("Producto no encontrado");
        return;
    }

    // Redirigir según categoría
    if (resultado.categoria === "moviles") {
        window.location.href = "moviles.html?modelo=" + encodeURIComponent(resultado.modelo);
    }

    else if (resultado.categoria === "consolas") {
        window.location.href = "consolas.html?modelo=" + encodeURIComponent(resultado.modelo);
    }

    else if (resultado.categoria === "camaras") {
        window.location.href = "camaras.html?modelo=" + encodeURIComponent(resultado.modelo);
    }

    else if (resultado.categoria === "drones") {
        window.location.href = "drones.html?modelo=" + encodeURIComponent(resultado.modelo);
    }
}
