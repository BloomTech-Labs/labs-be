import run from "./baseJob";
import logger from "@shared/Logger";

// import CanvasCourses from "./etl/canvasCourses";

void run()
  .then(() => {
    // import app from "@server";
    void import("./etl/canvasCourses").then(({ default: app }) => {
      logger.info("Running hourly jobs");

      void app.run();
    });
  })
  .catch((error) => {
    logger.err(error);
  });
