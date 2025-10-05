let precios = {}; // objeto plano para popup
let productos = []; // almacenar productos de consolas

// Toggle filtros
function toggleFiltros(tituloId, filtrosId) {
    const titulo = document.getElementById(tituloId);
    const filtros = document.getElementById(filtrosId);

    titulo.addEventListener('click', () => {
        filtros.style.display = filtros.style.display === 'block' ? 'none' : 'block';
    });
}

// Activar selección de opciones en un grupo
function setupSeleccionador(grupoId, callback) {
    const grupo = document.getElementById(grupoId);
    let seleccionActual = null;

    grupo.querySelectorAll('.selector-opcion').forEach(opcion => {
        opcion.addEventListener('click', () => {
            if (seleccionActual) seleccionActual.classList.remove('selected');
            opcion.classList.add('selected');
            seleccionActual = opcion;

            if (callback) callback(opcion); // ejecutar función extra al seleccionar
        });
    });
}

// Actualizar almacenamientos según modelo seleccionado
function actualizarAlmacenamientos(marca, modelo) {
    const almacenContainer = document.getElementById(`almacenamientoOpciones${marca}`);
    almacenContainer.innerHTML = "";

    const almacenamientos = [...new Set(productos
        .filter(p => p.marca === marca && p.modelo === modelo.dataset.value)
        .map(p => p.almacenamiento))];

    almacenamientos.forEach(a => {
        const div = document.createElement('div');
        div.className = "selector-opcion";
        div.dataset.value = a;
        div.innerText = a;
        almacenContainer.appendChild(div);
    });

    // Activar selección de los nuevos elementos
    setupSeleccionador(`almacenamientoOpciones${marca}`);
}

// Mostrar popup
function mostrarPopup(modelo, almacenamiento) {
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

// ---------------------
// Manejo dinámico de consolas
// ---------------------
fetch('../db.json')
  .then(res => res.json())
  .then(data => {
    productos = data.productos.filter(p => p.categoria === "consolas");

    // Llenar objeto de precios
    productos.forEach(p => {
      const clave = `${p.modelo.trim()}-${p.almacenamiento.trim()}`;
      precios[clave] = p.precio;
    });

    const marcas = [...new Set(productos.map(p => p.marca))]; // ["Sony", "Nintendo", ...]

    marcas.forEach(marca => {
      const modeloContainer = document.getElementById(`modeloOpciones${marca}`);
      const almacenContainer = document.getElementById(`almacenamientoOpciones${marca}`);
      const btn = document.getElementById(`buscar${marca}`);
      if (!modeloContainer || !almacenContainer || !btn) return;

      // Modelos únicos por marca
      const modelos = [...new Set(productos.filter(p => p.marca === marca).map(p => p.modelo))];

      // Limpiar contenedores
      modeloContainer.innerHTML = "";
      almacenContainer.innerHTML = "";

      // Crear selectores de modelos
      modelos.forEach(m => {
        const div = document.createElement('div');
        div.className = "selector-opcion";
        div.dataset.value = m;
        div.innerText = m;
        modeloContainer.appendChild(div);
      });

      // Activar selección de modelos con callback para actualizar almacenamientos
      setupSeleccionador(`modeloOpciones${marca}`, (opcion) => {
        actualizarAlmacenamientos(marca, opcion);
      });

      // Inicializar almacenamientos con el primer modelo
      actualizarAlmacenamientos(marca, {dataset: {value: modelos[0]}});

      // Botón buscar
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modelo = document.querySelector(`#modeloOpciones${marca} .selected`);
        const almacenamiento = document.querySelector(`#almacenamientoOpciones${marca} .selected`);
        if (!modelo || !almacenamiento) return alert(`Selecciona un modelo y almacenamiento de ${marca}`);
        mostrarPopup(modelo, almacenamiento);
      });

      // Activar selección de almacenamientos iniciales
      setupSeleccionador(`almacenamientoOpciones${marca}`);
    });
  });

// Toggle filtros
toggleFiltros("SonyTitulo", "SonyFiltros");
toggleFiltros("nintendoTitulo", "nintendoFiltros");
