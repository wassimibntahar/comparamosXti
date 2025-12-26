// =============================
//  BUSCADOR GLOBAL COMPARAMOSXTI
// =============================

// ============
// ALIAS MARCAS
// ============
const aliasMarca = {
    "apple": ["apple", "iphone", "iphon", "ipone", "ifon", "aifon", "ifone", "ipon"],
    
    "samsung": [
        "samsung", "sansun", "samzung", "samsun", "samusng", "sansum",
        "galaxy", "galaxi", "galax", "galxy"
    ],
    
    "sony": [
        "sony",
        "playstation", "play station", "pley", "plei", "play", 
        "plestation", "pleiston", "ps5", "ps 5", "ps4", "ps"
    ],
    
    "nintendo": [
        "nintendo", "nitendo", "nitedo", "nintedo", "ninendo",
        "switch", "swich", "switsh", "nswitch"
    ]
};


// Normaliza texto (minúsculas + sin espacios)
function normalizar(texto) {
    return texto.toLowerCase().replace(/\s+/g, "");
}

// ===============================
// Detectar MARCA + extraer MODELO
// ===============================
function detectarMarcaYModelo(query) {
    let clean = normalizar(query);
    let marca = null;

    for (const oficial in aliasMarca) {
        for (const variante of aliasMarca[oficial]) {

            const v = normalizar(variante);

            // Si el texto empieza por el alias → es la marca
            if (clean.startsWith(v)) {
                marca = oficial;
                clean = clean.slice(v.length); // eliminar alias = dejar solo el modelo
                return { marca, modeloTexto: clean };
            }
        }
    }

    // Si NO detecta marca, busca usando todo el texto como modelo
    return { marca: null, modeloTexto: clean };
}

// =============================
// Cargar base de datos
// =============================
let BD = [];

fetch('../db.json')
    .then(res => res.json())
    .then(data => {
        BD = data.productos;
        console.log("BD cargada", BD);
    });

// =============================
// Búsqueda REAL
// =============================
function buscarProducto(query) {
    const { marca, modeloTexto } = detectarMarcaYModelo(query);

    const modeloClean = normalizar(modeloTexto);

    return BD.find(p => {
        const modeloBD = normalizar(p.modelo);
        const marcaBD = normalizar(p.marca);

        const coincideModelo = modeloBD.includes(modeloClean);
        const coincideMarca = marca ? marcaBD === marca : true;

        return coincideModelo && coincideMarca;
    });
}

// =============================
// Capturar ENTER en la barra
// =============================
document.querySelectorAll(".busqueda input").forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            procesarBusqueda(input.value);
        }
    });
});

// =============================
// Lógica principal del buscador
// =============================
function procesarBusqueda(texto) {
    if (!texto.trim()) return;

    const resultado = buscarProducto(texto);

    if (!resultado) {
        alert("Producto no encontrado");
        return;
    }

    const url = {
        moviles: "moviles.html",
        consolas: "consolas.html",
        camaras: "camaras.html",
        drones: "drones.html"
    }[resultado.categoria];

    if (url) {
        window.location.href = `${url}?modelo=${encodeURIComponent(resultado.modelo)}`;
    }
}
