const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
let students = [];

// Leer el archivo CSV al iniciar el servidor
fs.createReadStream("students5.csv")
  .pipe(csv())
  .on("data", (row) => {
    students.push(row);
  })
  .on("end", () => {
    console.log("Archivo CSV cargado correctamente ✅");
  });

// Ruta principal
app.get("/", (req, res) => {
  res.send("API de Estudiantes funcionando correctamente 📚");
});

// Obtener todos los estudiantes
app.get("/students", (req, res) => {
  res.json(students);
});

// Buscar estudiante por ID (asumiendo que el CSV tiene una columna 'id')
app.get("/students/:id", (req, res) => {
  const id = req.params.id;
  const student = students.find((s) => s.id == id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Estudiante no encontrado" });
  }
});

// Buscar estudiante por nombre (si el CSV tiene una columna 'name' o similar)
app.get("/search", (req, res) => {
  const name = req.query.name?.toLowerCase();
  if (!name)
    return res.status(400).json({ message: "Falta el parámetro 'name'" });

  const results = students.filter((s) =>
    Object.values(s).some((val) => val.toLowerCase().includes(name))
  );

  res.json(results);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
