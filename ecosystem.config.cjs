// Configurare PM2 pentru VPS: pm2 start ecosystem.config.cjs
/* eslint-disable @typescript-eslint/no-require-imports -- PM2 citește doar CommonJS */
// Variabilele de mediu se citesc din fișierul .env (vezi .env.example).
const fs = require("node:fs");
const env = {};
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

module.exports = {
  apps: [
    {
      name: "roby-media",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      // HOSTNAME „localhost”: site-ul e accesibil doar local (prin Nginx). NU folosiți „127.0.0.1”:
      // cu next-intl, rewrite-urile interne ar deveni cereri externe și ar intra în buclă de redirect.
      env: { NODE_ENV: "production", PORT: 3000, HOSTNAME: "localhost", ...env },
    },
  ],
};
