import { app } from "./app.js";
import { connectDb } from "./data/database.js";
import { config } from "dotenv";

config({ path: "./data/config.env" });

connectDb();

app.listen(process.env.PORT, () => console.log(`Server is working on port ${process.env.PORT}`));
