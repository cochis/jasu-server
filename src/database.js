const mongoose = require("mongoose");
const uri = "mongodb+srv://Cluster84432:d1hVeVt9XVZn@cluster84432.kr6llcm.mongodb.net/?appName=jasu";
mongoose
  .connect(uri, {})
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));
