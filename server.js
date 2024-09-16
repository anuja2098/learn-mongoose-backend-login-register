const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { UserRouter } = require("./routes/user.routes");
const { ProductRouter } = require("./routes/product.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

mongoose
  .connect("mongodb://localhost:27017/learn-mongoose")
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log("Mongo error", err));

app.use(morgan("tiny")); // logger
app.use(cors());
app.use(bodyParser.json()); // for req.body

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the app",
  });
});

app.use("/user", UserRouter);
app.use("/product", ProductRouter);

app.use(errorMiddleware);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
