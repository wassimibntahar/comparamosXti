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

    /* ---------- Playstation ---------- */

    toggleFiltros("playstationTitulo", "playstationFiltros");
    setupSeleccionador("modeloOpcionesPlaystation");
    setupSeleccionador("almacenamientoOpcionesPlaystation");

    const btnBuscarPlaystation = document.getElementById("buscarPlaystation");
    btnBuscarPlaystation.addEventListener("click", () => {
        const modelo = document.querySelector("#modeloOpcionesPlaystation .selected");
        const almacenamiento = document.querySelector("#almacenamientoOpcionesPlaystation .selected");

        if (!modelo || !almacenamiento) {
            alert("Selecciona un modelo y almacenamiento de PlayStation");
            return;
        }
        mostrarPopup(modelo, almacenamiento, precios);
    });


    toggleFiltros("nintendoTitulo", "nintendoFiltros");
    setupSeleccionador("modeloOpcionesNintendo");
    setupSeleccionador("almacenamientoOpcionesNintendo");

    const btnBuscarNintendo = document.getElementById("buscarNintendo");
    btnBuscarNintendo.addEventListener("click", () => {
        const modelo = document.querySelector("#modeloOpcionesNintendo .selected");
        const almacenamiento = document.querySelector("#almacenamientoOpcionesNintendo .selected");

        if (!modelo || !almacenamiento) {
            alert("Selecciona un modelo y almacenamiento de Nintendo");
            return;
        }
        mostrarPopup(modelo, almacenamiento, precios);
    });


    const cerrarPopup = document.getElementById("cerrarPopup");
    cerrarPopup.addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";
    });

    const precios = {
        //Playstation
        "PlayStation 5-500 GB": "250 €",
        "PlayStation 5-850 GB": "280 €",

        "PlayStation 5 Slim-500 GB": "310 €",
        "PlayStation 5 Slim-850 GB": "340 €",
 
    };