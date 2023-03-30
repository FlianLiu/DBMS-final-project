const mysql = require("mysql");
const express = require("express");
const app = express();

const port = 3000;
var con = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "Flian",
  password: "password",
  database: "dbmsfinal"
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// http://localhost:3000/api-docs

const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))


function sendResponse(statusCode, data, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.json(data);
}
function sendDataResponse(statusCode, data, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type");
  res.statusCode = statusCode;
  res.json(data);
}

con.connect(err => {
  app.get('/menu', (req, res) => {
    con.query("SELECT * FROM menu", (err, result) => {
      if (err) throw err;
      sendResponse(200, result, res);
    });
  });
  app.get('/menu/:id', (req, res) => {
    const id = req.params.id;
    con.query("SELECT * FROM menu WHERE id = ?", id, (err, result) => {
      if (err) throw err;
      sendResponse(200, result, res);
    });
  });
  app.post('/menu', (req, res) => {
    req.on('data', (chunk) => {
      const {id, meal, price} = JSON.parse(chunk);
      con.query("INSERT INTO menu (id, meal, price) VALUES ?",[[[id, meal, price]]], (err,result) => {
        if (err) throw err;
        console.log(`data inserted: id:${id} meal:${meal} price:${price}`);
      });
      con.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        sendDataResponse(200, result, res);
      });
    });
  })
  app.put('/menu/:id', (req, res) => {
    req.on('data', (chunk) => {
      const changeID = req.params.id;
      const {id, meal, price} = JSON.parse(chunk);
      const data = [id, meal, price, changeID];
      con.query("UPDATE menu SET id = ? , meal = ? , price = ? WHERE id = ?", data, (err, result) => {
        if(err) throw err;
        console.log(`data changed: id ${changeID} change to ${id}`);
      })
      con.query("SELECT * FROM menu", (err, result) => {
        if (err) throw err;
        sendDataResponse(200, result, res);
      });
    });
  })
  app.delete('/menu/:id', (req, res) => {
    const id = req.params.id;
    con.query("DELETE FROM menu WHERE id = ?", id, (err, result) => {
      if (err) throw err;
      console.log(`data deleted: id:${id}`);
    });
    con.query("SELECT * FROM menu", (err, result) => {
      if (err) throw err;
      sendDataResponse(200, result, res);
    });
  })

  app.listen(port, () => {
    console.log("server is running...");
  });
})