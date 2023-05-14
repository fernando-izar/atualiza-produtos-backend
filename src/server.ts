import app from "./app";
import AppDataSource from "./data-source";

const PORT = process.env.PORT || 3000;

(async () => {
  await AppDataSource.initialize().catch((err) => {
    console.error("Error during database initialization:", err);
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
