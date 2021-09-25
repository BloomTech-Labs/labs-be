import "./pre-start"; // Must be the first import
import logger from "@shared/Logger";
import { intializeDB } from "@shared/Database";

void intializeDB().then(() => {
  // Start the server
  const port = Number(process.env.PORT || 3000);
  // import app from "@server";
  void import("@server").then(({ default: app }) => {
    app.listen(port, () => {
      logger.info("Express server started on port: " + port.toString());
    });
  });
});
