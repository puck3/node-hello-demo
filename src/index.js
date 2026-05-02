const http = require("http");

const PORT = parseInt(process.env.PORT || "8080");
const APP_NAME = process.env.APP_NAME || "node-hello";
const ENV_NAME = process.env.ENV_NAME || "unknown";

function page() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${APP_NAME}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f4f7fb;
        color: #162033;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
      }
      main {
        width: min(760px, calc(100vw - 40px));
        padding: 48px;
        border: 1px solid #d9e2ef;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 18px 45px rgba(22, 32, 51, 0.08);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 44px;
        line-height: 1.08;
        letter-spacing: 0;
      }
      p {
        margin: 0;
        color: #506174;
        font-size: 18px;
        line-height: 1.6;
      }
      dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 10px 18px;
        margin: 32px 0 0;
        padding-top: 24px;
        border-top: 1px solid #edf1f7;
      }
      dt {
        color: #6a7889;
      }
      dd {
        margin: 0;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Hello from ${APP_NAME}</h1>
      <p>This page is served by a minimal Node.js application deployed through the automated deployment system.</p>
      <dl>
        <dt>Environment</dt>
        <dd>${ENV_NAME}</dd>
        <dt>Framework</dt>
        <dd>Node.js (stdlib)</dd>
      </dl>
    </main>
  </body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const body = page();
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`${APP_NAME} listening on port ${PORT}`);
});
