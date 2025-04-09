const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// Create Express app
const app = express();
const port = 4242;

// Configure live reload server
const liveReloadServer = livereload.createServer({
  // Watch these file extensions
  exts: ["html", "css", "js", "png", "jpg", "jpeg", "gif", "svg"],
  debug: true,
});

// Watch the root directory
liveReloadServer.watch(path.join(__dirname, ".."));

// Add livereload middleware to express
app.use(connectLivereload());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, "..")));

// Serve index.html for all routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Live reload enabled - watching for file changes...");
});
