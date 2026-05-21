require("dotenv").config();

const compression = require("compression");
const dayjs = require("dayjs");
const express = require("express");
const helmet = require("helmet");
const escape = require("lodash/escape");
const morgan = require("morgan");
const { z } = require("zod");

const APP_VERSION = 12;

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  APP_NAME: z.string().min(1).default("node-hello"),
  ENV_NAME: z.string().min(1).default("unknown"),
});

const env = envSchema.parse(process.env);
const app = express();

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan("combined"));

function noStore(res) {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store",
  });
}

function page() {
  const appName = escape(env.APP_NAME);
  const envName = escape(env.ENV_NAME);
  const renderedAt = escape(dayjs().format("YYYY-MM-DD HH:mm:ss"));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${appName}</title>
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
      <h1>Hello from ${appName}</h1>
      <p>This page is served by a minimal Node.js application deployed through the automated deployment system.</p>
      <dl>
        <dt>Environment</dt>
        <dd>${envName}</dd>
        <dt>Framework</dt>
        <dd>Node.js + Express</dd>
        <dt>Version</dt>
        <dd>${APP_VERSION}</dd>
        <dt>Rendered at</dt>
        <dd>${renderedAt}</dd>
      </dl>
    </main>
  </body>
</html>`;
}

app.get("/health", (req, res) => {
  noStore(res);
  res.json({ status: "ok" });
});

app.get("/version", (req, res) => {
  noStore(res);
  res.json({ version: APP_VERSION });
});

app.get("/", (req, res) => {
  noStore(res);
  res.type("html").send(page());
});

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`${env.APP_NAME} listening on port ${env.PORT}`);
});
