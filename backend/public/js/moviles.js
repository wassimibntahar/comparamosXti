let precios = {}; // objeto plano para popup

// Toggle filtros
function toggleFiltros(tituloId, filtrosId) {
    const titulo = document.getElementById(tituloId);
    const filtros = document.getElementById(filtrosId);

    titulo.addEventListener('click', () => {
        filtros.style.display = filtros.style.display === 'block' ? 'none' : 'block';
    });
}

// Activar selección de opciones en un grupo
function setupSeleccionador(grupoId) {
    const grupo = document.getElementById(grupoId);
    let seleccionActual = null;
    grupo.querySelectorAll('.selector-opcion').forEach(opcion => {
        opcion.addEventListener('click', () => {
            if (seleccionActual) seleccionActual.classList.remove('selected');
            opcion.classList.add('selected');
            seleccionActual = opcion;
        });
    });
}

// Mostrar popup
function mostrarPopup(modelo, almacenamiento, precios) {
    const overlay = document.getElementById('overlay');
    const popupContenido = document.getElementById('popupContenido');

    const clave = `${modelo.dataset.value}-${almacenamiento.dataset.value.trim()}`;
    const precio = precios[clave] ? precios[clave] + " €" : "Precio no disponible";

    popupContenido.innerText = `Modelo: ${modelo.dataset.value.trim()}\nAlmacenamiento: ${almacenamiento.dataset.value.trim()}`;
    document.getElementById("popupPrecio").innerText = `Precio: ${precio}`;

    const nombreArchivo = "img/" + modelo.dataset.value.toLowerCase().replace(/\s+/g, '') + ".png";
    document.getElementById("popupImagen").src = nombreArchivo;

    overlay.style.display = 'flex';
}

// Cerrar popup
document.getElementById("cerrarPopup").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
});

// Inicializar selección de todos los grupos que ya existen en HTML
const grupos = [
    "modeloOpcionesIphone", "almacenamientoOpcionesIphone",
    "modeloOpcionesSamsung", "almacenamientoOpcionesSamsung"
];
grupos.forEach(setupSeleccionador);

// Botones buscar
document.getElementById("buscarIphone").addEventListener("click", (e) => {
    e.preventDefault(); // evita recarga
    const modelo = document.querySelector("#modeloOpcionesIphone .selected");
    const almacenamiento = document.querySelector("#almacenamientoOpcionesIphone .selected");
    if (!modelo || !almacenamiento) return alert("Selecciona un modelo y almacenamiento de iPhone");
    mostrarPopup(modelo, almacenamiento, precios);
});


document.getElementById("buscarSamsung").addEventListener("click", () => {
    const modelo = document.querySelector("#modeloOpcionesSamsung .selected");
    const almacenamiento = document.querySelector("#almacenamientoOpcionesSamsung .selected");
    if (!modelo || !almacenamiento) return alert("Selecciona un modelo y almacenamiento de Samsung");
    mostrarPopup(modelo, almacenamiento, precios);
});

fetch('../db.json')
    .then(res => res.json())
    .then(data => {
        const productos = data.productos.filter(p => p.categoria === "moviles");

        productos.forEach(p => {
            const clave = `${p.modelo.trim()}-${p.almacenamiento.trim()}`;
            precios[clave] = p.precio;
        });        

        // Opcional: si quieres llenar los selectores dinámicamente
        // por ejemplo para iPhone
        const modelosIphone = [...new Set(productos.filter(p => p.marca==="Apple").map(p=>p.modelo))];
        const almacenIphone = [...new Set(productos.filter(p => p.marca==="Apple" && p.modelo===modelosIphone[0]).map(p=>p.almacenamiento))];

        const modeloContainer = document.getElementById("modeloOpcionesIphone");
        const almacenContainer = document.getElementById("almacenamientoOpcionesIphone");

        modeloContainer.innerHTML = "";
        almacenContainer.innerHTML = "";

        modelosIphone.forEach(m => {
            const div = document.createElement('div');
            div.className = "selector-opcion";
            div.dataset.value = m;
            div.innerText = m;
            modeloContainer.appendChild(div);
        });

        almacenIphone.forEach(a => {
            const div = document.createElement('div');
            div.className = "selector-opcion";
            div.dataset.value = a;
            div.innerText = a;
            almacenContainer.appendChild(div);
        });

        // Activar selección
        setupSeleccionador("modeloOpcionesIphone");
        setupSeleccionador("almacenamientoOpcionesIphone");
    });


// Toggle filtros
toggleFiltros("iphoneTitulo", "iphoneFiltros");
toggleFiltros("samsungTitulo", "samsungFiltros");
toggleFiltros("xiaomiTitulo", "xiaomiFiltros");
