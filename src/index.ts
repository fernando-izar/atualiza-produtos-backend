import express from "express";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import mysql from "mysql2";

type ProductType = {
  code: number;
  name: string;
  cost_price: number;
  sale_price: number;
};

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "shopper_teste",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }

  console.log("Conexão bem-sucedida ao banco de dados");

  // Resto do código do servidor aqui...
});

const app = express();
app.use(express.json());

console.log("connection", connection);
app.get("/", (req, res) => {
  connection.query("SELECT name FROM products", (err, result: []) => {
    if (err) {
      return res.status(500).json({
        error: "Error retrieving products",
      });
    }

    const productNames = result.map((product: ProductType) => product.name);
    return res.status(200).json(productNames);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
