// IMPORTING
const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
// ALLOWING EXPRESS TO USE JSON INFO
app.use(express.json());
// INCLUDING ROUTES
app.use(routes);

// OPENING CONNECTION TO DB
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});