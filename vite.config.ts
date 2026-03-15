import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'save-config-api',
        configureServer(server) {

          server.middlewares.use('/api/admin-login', (req, res) => {
            if (req.method !== 'POST') {
              // fall through to other handlers
              return;
            }
            let body = '';
            req.on('data', (chunk) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const { username, password } = JSON.parse(body);

                let validCredentials = [];
                // Load from env directly. Since loadEnv is called, we can read env.ADMIN_CREDENTIALS or process.env.ADMIN_CREDENTIALS
                const credsEnv = env.ADMIN_CREDENTIALS;
                if (credsEnv) {
                  try {
                    validCredentials = JSON.parse(credsEnv);
                  } catch (e) {
                    console.error("Failed to parse ADMIN_CREDENTIALS in vite dev server");
                  }
                }

                const validCred = validCredentials.find(
                  (c) => c.username === username && c.password === password
                );

                res.setHeader('Content-Type', 'application/json');
                if (validCred) {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 401;
                  res.end(JSON.stringify({ error: 'Invalid credentials. Please try again.' }));
                }
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(e) }));
              }
            });
          });

          server.middlewares.use('/api/save-config', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method not allowed');
              return;
            }
            let body = '';
            req.on('data', (chunk) => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const config = JSON.parse(body);
                const filePath = path.resolve(__dirname, 'public/site-config.json');
                fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(e) }));
              }
            });
          });
        },
      },
    ],
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
