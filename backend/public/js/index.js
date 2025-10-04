const mostrarFiltros = document.getElementById('mostrarFiltros');
    const filtroCategorias = document.getElementById('filtroCategorias');

    mostrarFiltros.addEventListener('click', () => {
        filtroCategorias.style.display = filtroCategorias.style.display === 'none' ? 'grid' : 'none';
    });