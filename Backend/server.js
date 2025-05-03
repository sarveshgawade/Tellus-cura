import { configDotenv } from "dotenv";
configDotenv()
import app from "./app.js";

const PORT = process.env.PORT || 8080

app.listen(PORT, ()=> {
    console.log(`Server started at port: ${PORT}`);
    
})