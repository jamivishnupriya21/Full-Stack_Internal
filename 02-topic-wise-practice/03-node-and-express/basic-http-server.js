const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Node HTTP server");
  } else if (req.url === "/json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "JSON response" }));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
