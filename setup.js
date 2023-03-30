const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "Flian",
  password: "password",
  database: "dbmsfinal"
});

con.connect(err => {
  if (err) throw err;
  console.log("server is running...");

  const deleteTable = "DROP TABLE menu";
  const createDatabase = "CREATE DATABASE dbmsfinal";
  const createTable = "CREATE TABLE menu (id INT PRIMARY KEY, meal VARCHAR(255), price INT)";
  const assignMenu = "INSERT INTO menu (id, meal, price) VALUES ?"
  
  con.query(deleteTable, function (err, result) {
    if (err) throw err;
    console.log("Table menu deleted");
  });

  // con.query(createDatabase, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  con.query(createTable, function (err, result) {
    if (err) throw err;
    console.log("Table menu craeted");
  });

  const meals = [
    [1, "大麥克", 75],
    [2, "雙層牛肉吉士堡", 65],
    [3, "嫩煎雞腿堡", 80],
    [4, "麥香雞", 45],
    [5, "勁辣雞腿堡", 75],
    [6, "麥香魚", 49],
    [7, "麥克雞塊 (6塊)", 64],
    [8, "麥克雞塊 (10塊)", 104],
    [9, "薯條", 58],
    [10, "冰炫風", 55],
    [11, "可口可樂", 45]
  ]

  con.query(assignMenu, [meals], function (err, result) {
    if (err) throw err;
    console.log("Data has been initialed!");
  });
});
