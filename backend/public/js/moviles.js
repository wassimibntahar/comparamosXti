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
function mostrarPopup(modelo, almacenamientoDefault, precios) {
    const overlay = document.getElementById('overlay');
    const popupContenido = document.getElementById('popupContenido');
    const popupPrecio = document.getElementById("popupPrecio");
    const popupImg = document.getElementById("popupImagen");
    const tabsContainer = document.getElementById("popupAlmacenamientos");

    const modeloValue = modelo.dataset.value.trim();

    const favBtn = document.getElementById("favBtn");
    const favImg = favBtn.querySelector("img");

    let almacenamientoActual = almacenamientoDefault.dataset.value.trim();

    function actualizarFav() {
        const idProducto = `${modeloValue}-${almacenamientoActual}`;

        favImg.src = esFavorito(idProducto)
            ? "img/fav_lleno.png"
            : "img/fav_vacio.png";

        favBtn.onclick = () => toggleFavorito(idProducto, favImg);
    }

    // Obtener TODOS los almacenamientos disponibles para ese modelo
    const almacenamientos = [...new Set(
        Object.keys(precios)
            .filter(k => k.startsWith(modeloValue))
            .map(k => k.split("-")[1])
    )];

    // Crear pestañas de almacenamiento
    tabsContainer.innerHTML = "";
    almacenamientos.forEach(a => {
        const tab = document.createElement("div");
        tab.className = "almacenamiento-tab";
        tab.innerText = a;

        if (a === almacenamientoDefault.dataset.value.trim()) {
            tab.classList.add("active");
        }

        // Evento: cambiar almacenamiento
        tab.addEventListener("click", () => {
            document.querySelectorAll(".almacenamiento-tab")
                .forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            almacenamientoActual = a;          // 🔥 CLAVE
            actualizarFav();                   // 🔥 CLAVE

            const clave = `${modeloValue}-${a}`;
            popupPrecio.innerText =
                "Precio: " + (precios[clave] ? precios[clave] + " €" : "Selecciona almacenamiento válido");
        });


        tabsContainer.appendChild(tab);
    });

    popupContenido.innerText =
        `Modelo: ${modeloValue}`;

    const claveDefault =
        `${modeloValue}-${almacenamientoDefault.dataset.value.trim()}`;

    popupPrecio.innerText =
        `Precio: ${precios[claveDefault] || "Selecciona almacenamiento válido"} €`;

    popupImg.src =
        "img/" + modeloValue.toLowerCase().replace(/\s+/g, "") + ".png";

    actualizarFav();

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

    // Leer query param
    const params = new URLSearchParams(window.location.search);
    const modeloBuscado = params.get("modelo");

    if (modeloBuscado) {
        setTimeout(() => {
            // Seleccionar modelo automáticamente
            const modeloDiv = [...document.querySelectorAll("#modeloOpcionesIphone .selector-opcion, #modeloOpcionesSamsung .selector-opcion")]
                            .find(el => el.dataset.value === modeloBuscado);

            if (modeloDiv) {
                modeloDiv.click();

                // seleccionar almacenamiento base automáticamente
                const almacenDiv = modeloDiv.parentElement.id.includes("Iphone") ?
                    document.querySelector("#almacenamientoOpcionesIphone .selector-opcion") :
                    document.querySelector("#almacenamientoOpcionesSamsung .selector-opcion");

                if (almacenDiv) almacenDiv.click();

                // abrir popup
                mostrarPopup(modeloDiv, almacenDiv, precios);
            }
        }, 400);
    }



// Toggle filtros
toggleFiltros("iphoneTitulo", "iphoneFiltros");
toggleFiltros("samsungTitulo", "samsungFiltros");
toggleFiltros("xiaomiTitulo", "xiaomiFiltros");
toggleFiltros("huaweiTitulo", "huaweiFiltros");
