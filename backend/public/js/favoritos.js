/* ===============================
   UTILIDADES FAVORITOS
================================ */
function obtenerFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

/* ===============================
   RENDER FAVORITOS
================================ */
const grid = document.getElementById("favoritosGrid");

fetch("../db.json")
    .then(res => res.json())
    .then(data => {
        const favoritos = obtenerFavoritos();

        if (favoritos.length === 0) {
            grid.innerHTML = "<p>¡Vaya! No tienes favoritos aún</p>";
            return;
        }

        const productos = data.productos;

        // Filtrar SOLO los productos que están en favoritos
        const productosFavoritos = productos.filter(p => {
            const id = `${p.modelo.trim()}-${p.almacenamiento.trim()}`;
            return favoritos.includes(id);
        });

        if (productosFavoritos.length === 0) {
            grid.innerHTML = "<p>¡Vaya! No tienes favoritos aún</p>";
            return;
        }

        // Renderizar cards
        productosFavoritos.forEach(p => {
            const card = document.createElement("div");
            card.className = "favorito-card";

            const img = document.createElement("img");
            img.src = "img/" + p.modelo.toLowerCase().replace(/\s+/g, "") + ".png";
            img.alt = p.modelo;

            const titulo = document.createElement("h3");
            titulo.innerText = `${p.modelo} ${p.almacenamiento}`;

            const precio = document.createElement("p");
            precio.innerText = `Precio: ${p.precio} €`;

            // Botón quitar favorito
            const btnQuitar = document.createElement("button");
            btnQuitar.innerText = "Quitar de favoritos";
            btnQuitar.className = "quitar-fav";

            btnQuitar.addEventListener("click", () => {
                quitarFavorito(`${p.modelo.trim()}-${p.almacenamiento.trim()}`);
                card.remove();

                if (grid.children.length === 0) {
                    grid.innerHTML = "<p>¡Vaya! No tienes favoritos aún</p>";
                }
            });

            card.appendChild(img);
            card.appendChild(titulo);
            card.appendChild(precio);
            card.appendChild(btnQuitar);

            grid.appendChild(card);
        });
    });

/* ===============================
   QUITAR FAVORITO
================================ */
function quitarFavorito(idProducto) {
    let favoritos = obtenerFavoritos();
    favoritos = favoritos.filter(f => f !== idProducto);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
