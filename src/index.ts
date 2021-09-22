import "./pre-start"; // Must be the first import
import app from "@server";
import logger from "@shared/Logger";
import { intializeDB } from "@shared/Database";

void intializeDB();

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info("Express server started on port: " + port.toString());
});
