import app from "./api/index.js";
import cors from "cors";

app.use(
  cors({
    origin: "https://to-do-application-frontend-phi.vercel.app",
    credentials: true,
  })
);

app.options("*", cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});