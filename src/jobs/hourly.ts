import run from "./baseJob";
import logger from "@shared/Logger";

// import CanvasCourses from "./etl/canvasCourses";

void run()
  .then(() => {
    logger.info("Running hourly jobs");
    void import("./etl/canvasCourses").then(({ default: app }) => {
      logger.info("loading canvas courses");

      void app.run();
    });
  })
  .catch((error) => {
    logger.err(error);
  });
