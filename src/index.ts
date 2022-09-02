// Start the server
const port = Number(process.env.PORT || 4300);
// import app from "@server";
void import("@server").then(({ default: app }) => {
  app.listen(port, () => {
    // logger.info("Express server started on port: " + port.toString());
  });
});
