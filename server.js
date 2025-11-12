const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;
let students = [];

fs.createReadStream("students5.csv")
  .pipe(csv())
  .on("data", (row) => {
    students.push(row);
  })
  .on("end", () => {
    console.log("Archivo CSV cargado correctamente ");
  });

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const id = req.params.id;
  const student = students.find((s) => s.id == id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Estudiante no encontrado" });
  }
});

app.get("/search", (req, res) => {
  const name = req.query.name?.toLowerCase();
  if (!name) return res.status(400).json({ message: "Falta el nombre" });

  const results = students.filter((s) =>
    Object.values(s).some((val) => val.toLowerCase().includes(name))
  );

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
