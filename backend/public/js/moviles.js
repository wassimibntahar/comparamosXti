    //COMUNES
    // Función para desplegar filtros al pulsar título
    function toggleFiltros(tituloId, filtrosId) {
        const titulo = document.getElementById(tituloId);
        const filtros = document.getElementById(filtrosId);

        titulo.addEventListener('click', () => {
            const isVisible = filtros.style.display === 'block';
            filtros.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Función para activar selección de opciones
    function setupSeleccionador(grupoId) {
        const grupo = document.getElementById(grupoId);
        let seleccionActual = null;

        grupo.querySelectorAll('.selector-opcion').forEach(opcion => {
            opcion.addEventListener('click', () => {
                if (seleccionActual) {
                    seleccionActual.classList.remove('selected');
                }
                opcion.classList.add('selected');
                seleccionActual = opcion;
            });
        });
    }

    // Función para mostrar el popup
    function mostrarPopup(modelo, almacenamiento, precios) {
        const overlay = document.getElementById('overlay');
        const popupContenido = document.getElementById('popupContenido');

        const clave = `${modelo.dataset.value}-${almacenamiento.dataset.value}`;
        const precio = precios[clave] || "Precio no disponible";

        popupContenido.innerText = `Modelo: ${modelo.dataset.value}\nAlmacenamiento: ${almacenamiento.dataset.value}`;
        document.getElementById("popupPrecio").innerText = `Precio: ${precio}`;

        // Imagen dinámica (ejemplo: iphone15.png o s23.png)
        const nombreArchivo = "img/" + modelo.dataset.value.toLowerCase().replace(/\s+/g, '') + ".png";
        document.getElementById("popupImagen").src = nombreArchivo;

        overlay.style.display = 'flex';
    }

    /* ---------- IPHONE ---------- */

    toggleFiltros("iphoneTitulo", "iphoneFiltros");
    setupSeleccionador("modeloOpcionesIphone");
    setupSeleccionador("almacenamientoOpcionesIphone");

    const btnBuscarIphone = document.getElementById("buscarIphone");
    btnBuscarIphone.addEventListener("click", () => {
        const modelo = document.querySelector("#modeloOpcionesIphone .selected");
        const almacenamiento = document.querySelector("#almacenamientoOpcionesIphone .selected");

        if (!modelo || !almacenamiento) {
            alert("Selecciona un modelo y almacenamiento de iPhone");
            return;
        }
        mostrarPopup(modelo, almacenamiento, precios);
    });


    toggleFiltros("samsungTitulo", "samsungFiltros");
    setupSeleccionador("modeloOpcionesSamsung");
    setupSeleccionador("almacenamientoOpcionesSamsung");

    const btnBuscarSamsung = document.getElementById("buscarSamsung");
    btnBuscarSamsung.addEventListener("click", () => {
        const modelo = document.querySelector("#modeloOpcionesSamsung .selected");
        const almacenamiento = document.querySelector("#almacenamientoOpcionesSamsung .selected");

        if (!modelo || !almacenamiento) {
            alert("Selecciona un modelo y almacenamiento de Samsung");
            return;
        }
        mostrarPopup(modelo, almacenamiento, precios);
    });


    const cerrarPopup = document.getElementById("cerrarPopup");
    cerrarPopup.addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";
    });

    const precios = {
        //Samsung
        "S22-128 GB": "220 €",
        "S22-256 GB": "240 €",

        "S22 Ultra-128 GB": "300 €",
        "S22 Ultra-256 GB": "325 €",

        "S23-128 GB": "310 €",
        "S23-256 GB": "335 €",

        "S23 Ultra-128 GB": "430 €",
        "S23 Ultra-256 GB": "455 €",

        "S24-128 GB": "350 €",
        "S24-256 GB": "380 €",
        "S24-512 GB": "410 €",

        "S24 Ultra-256 GB": "610 €",
        "S24 Ultra-512 GB": "640 €",
 
        // iPhone 15
        "iPhone 15-128 GB": "535 €",
        "iPhone 15-256 GB": "585 €",
        "iPhone 15-512 GB": "625 €",

        "iPhone 15 Plus-128 GB": "550 €",
        "iPhone 15 Plus-256 GB": "600 €",
        "iPhone 15 Plus-512 GB": "635 €",

        "iPhone 15 Pro-128 GB": "620 €",
        "iPhone 15 Pro-256 GB": "650 €",
        "iPhone 15 Pro-512 GB": "680 €",

        "iPhone 15 Pro Max-128 GB": "670 €",
        "iPhone 15 Pro Max-256 GB": "700 €",
        "iPhone 15 Pro Max-512 GB": "750 €",

        // iPhone 14
        "iPhone 14-128 GB": "330 €",
        "iPhone 14-256 GB": "360 €",
        "iPhone 14-512 GB": "380 €",

        "iPhone 14 Plus-128 GB": "350 €",
        "iPhone 14 Plus-256 GB": "390 €",
        "iPhone 14 Plus-512 GB": "430 €",

        "iPhone 14 Pro-128 GB": "500 €",
        "iPhone 14 Pro-256 GB": "530 €",
        "iPhone 14 Pro-512 GB": "560 €",

        "iPhone 14 Pro Max-128 GB": "530 €",
        "iPhone 14 Pro Max-256 GB": "560 €",
        "iPhone 14 Pro Max-512 GB": "590 €",

        // iPhone 13
        "iPhone 13-128 GB": "280 €",
        "iPhone 13-256 GB": "320 €",
        "iPhone 13-512 GB": "360 €",

        "iPhone 13 Pro-128 GB": "370 €",
        "iPhone 13 Pro-256 GB": "400 €",
        "iPhone 13 Pro-512 GB": "430 €",

        "iPhone 13 Pro Max-128 GB": "420 €",
        "iPhone 13 Pro Max-256 GB": "450 €",
        "iPhone 13 Pro Max-512 GB": "480 €",

        // iPhone 12
        "iPhone 12-64 GB": "200 €",
        "iPhone 12-128 GB": "220 €",
        "iPhone 12-256 GB": "245 €",

        "iPhone 12 Pro-128 GB": "265 €",
        "iPhone 12 Pro-256 GB": "280 €",
        "iPhone 12 Pro-512 GB": "310 €",

        "iPhone 12 Pro Max-128 GB": "280 €",
        "iPhone 12 Pro Max-256 GB": "320 €",
        "iPhone 12 Pro Max-512 GB": "350 €",

        // iPhone 11
        "iPhone 11-64 GB": "150 €",
        "iPhone 11-128 GB": "160 €",
        "iPhone 11-256 GB": "175 €",

        "iPhone 11 Pro-64 GB": "160 €",
        "iPhone 11 Pro-128 GB": "170 €",
        "iPhone 11 Pro-256 GB": "190 €",
        "iPhone 11 Pro-512 GB": "220 €",

        "iPhone 11 Pro Max-64 GB": "170 €",
        "iPhone 11 Pro Max-128 GB": "190 €",
        "iPhone 11 Pro Max-256 GB": "220 €",
        "iPhone 11 Pro Max-512 GB": "240 €"
    };
