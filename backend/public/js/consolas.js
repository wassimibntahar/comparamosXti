function obtenerFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function guardarFavoritos(favs) {
    localStorage.setItem("favoritos", JSON.stringify(favs));
}

function esFavorito(id) {
    return obtenerFavoritos().includes(id);
}

function toggleFavorito(idProducto, favImg) {
    let favoritos = obtenerFavoritos();

    if (favoritos.includes(idProducto)) {
        favoritos = favoritos.filter(f => f !== idProducto);
        favImg.src = "img/fav_vacio.png";
    } else {
        favoritos.push(idProducto);
        favImg.src = "img/fav_lleno.png";
    }

    guardarFavoritos(favoritos);
}


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

    // Activar selección de nuevos elementos
    setupSeleccionador(`almacenamientoOpciones${marca}`);
}

// Mostrar popup
function mostrarPopup(modelo, almacenamientoDefault) {
    const overlay = document.getElementById('overlay');
    const popupContenido = document.getElementById('popupContenido');
    const popupPrecio = document.getElementById("popupPrecio");
    const popupImg = document.getElementById("popupImagen");
    const tabsContainer = document.getElementById("popupAlmacenamientos");

    const favBtn = document.getElementById("favBtn");
    const favImg = favBtn ? favBtn.querySelector("img") : null;

    const modeloValue = modelo.dataset.value.trim();
    let almacenamientoActual = almacenamientoDefault.dataset.value.trim();

    popupContenido.innerText = `Modelo: ${modeloValue}`;
    popupImg.src =
        "img/" + modeloValue.toLowerCase().replace(/\s+/g, "") + ".png";

    function actualizarPrecioYFav() {
        const idProducto = `${modeloValue}-${almacenamientoActual}`;

        popupPrecio.innerText =
            `Precio: ${precios[idProducto] || "ND"} €`;

        if (favBtn && favImg) {
            favImg.src = esFavorito(idProducto)
                ? "img/fav_lleno.png"
                : "img/fav_vacio.png";

            favBtn.onclick = () => toggleFavorito(idProducto, favImg);
        }
    }

    const almacenamientos = [...new Set(
        productos
            .filter(p => p.modelo === modeloValue)
            .map(p => p.almacenamiento)
    )];

    tabsContainer.innerHTML = "";

    almacenamientos.forEach(a => {
        const tab = document.createElement("div");
        tab.className = "almacenamiento-tab";
        tab.innerText = a;

        if (a === almacenamientoActual) tab.classList.add("active");

        tab.addEventListener("click", () => {
            document.querySelectorAll(".almacenamiento-tab")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");
            almacenamientoActual = a;
            actualizarPrecioYFav();
        });

        tabsContainer.appendChild(tab);
    });

    actualizarPrecioYFav();
    overlay.style.display = 'flex';
}


/* ===============================
   TOGGLE FAVORITO
================================ */
function toggleFavorito(idProducto, favImg) {
    let favoritos = obtenerFavoritos();

    if (favoritos.includes(idProducto)) {
        favoritos = favoritos.filter(f => f !== idProducto);
        favImg.src = "img/fav_vacio.png";
    } else {
        favoritos.push(idProducto);
        favImg.src = "img/fav_lleno.png";
    }

    guardarFavoritos(favoritos);
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

    const marcas = [...new Set(productos.map(p => p.marca))]; // ["Sony", "Nintendo"]

    marcas.forEach(marca => {
      const modeloContainer = document.getElementById(`modeloOpciones${marca}`);
      const almacenContainer = document.getElementById(`almacenamientoOpciones${marca}`);
      const btn = document.getElementById(`buscar${marca}`);
      if (!modeloContainer || !almacenContainer || !btn) return;

      const modelos = [...new Set(productos.filter(p => p.marca === marca).map(p => p.modelo))];

      modeloContainer.innerHTML = "";
      almacenContainer.innerHTML = "";

      modelos.forEach(m => {
        const div = document.createElement('div');
        div.className = "selector-opcion";
        div.dataset.value = m;
        div.innerText = m;
        modeloContainer.appendChild(div);
      });

      setupSeleccionador(`modeloOpciones${marca}`, (opcion) => {
        actualizarAlmacenamientos(marca, opcion);
      });

      actualizarAlmacenamientos(marca, {dataset: {value: modelos[0]}});

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modelo = document.querySelector(`#modeloOpciones${marca} .selected`);
        const almacenamiento = document.querySelector(`#almacenamientoOpciones${marca} .selected`);
        if (!modelo || !almacenamiento) return alert(`Selecciona un modelo y almacenamiento de ${marca}`);
        mostrarPopup(modelo, almacenamiento);
      });

      setupSeleccionador(`almacenamientoOpciones${marca}`);
    });
  });


// ===============================
// AUTO–SELECCIÓN DESDE EL BUSCADOR
// ===============================
const params = new URLSearchParams(window.location.search);
const modeloBuscado = params.get("modelo");

if (modeloBuscado) {
    setTimeout(() => {

        // Buscar modelo en Sony + Nintendo
        const modeloDiv = [...document.querySelectorAll(
            "#modeloOpcionesSony .selector-opcion, \
             #modeloOpcionesNintendo .selector-opcion"
        )].find(el => el.dataset.value === modeloBuscado);

        if (modeloDiv) {
            modeloDiv.click();

            // Identificar marca
            const marca = modeloDiv.parentElement.id.replace("modeloOpciones", "");

            // Seleccionar almacenamiento base
            const almacenDiv = document.querySelector(`#almacenamientoOpciones${marca} .selector-opcion`);

            if (almacenDiv) almacenDiv.click();

            // Mostrar popup
            mostrarPopup(modeloDiv, almacenDiv);
        }
    }, 400);
}


// Toggle filtros
toggleFiltros("SonyTitulo", "SonyFiltros");
toggleFiltros("nintendoTitulo", "nintendoFiltros");
toggleFiltros("xboxTitulo", "xboxFiltros");


