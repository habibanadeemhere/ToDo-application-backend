import app from "./api/index.js";
import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://to-do-application-frontend-phi.vercel.app"
  ],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});