// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cargamos productos desde db.json
const dbPath = path.join(__dirname, 'db.json');
let rawData = fs.readFileSync(dbPath, 'utf8');
let productos = JSON.parse(rawData).productos;

// Ruta: todos los productos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// Ruta: buscar productos filtrando
// Ejemplo: /api/buscar?marca=Apple&modelo=iPhone%2015&categoria=moviles
app.get('/api/buscar', (req, res) => {
  let { marca, modelo, categoria, almacenamiento } = req.query;

  let resultados = productos.filter(p => {
    let match = true;
    if (marca) match = match && p.marca.toLowerCase() === marca.toLowerCase();
    if (modelo) match = match && p.modelo.toLowerCase().includes(modelo.toLowerCase());
    if (categoria) match = match && p.categoria.toLowerCase() === categoria.toLowerCase();
    if (almacenamiento) match = match && p.almacenamiento === almacenamiento;
    return match;
  });

  res.json(resultados);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
