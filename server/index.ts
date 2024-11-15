import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Dynamically load API routes based on filesystem structure
const loadRoutes = async (dir: string, parentPath: string = '') => {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const routePath = `${parentPath}/${file.name.replace(/\.[tj]s$/, '')}`;

    if (file.isDirectory()) {
      // Recursively load files within directories
      await loadRoutes(fullPath, routePath);
    } else if (file.name === 'route.ts' || file.name === 'route.js') {
      // Process only files named `route.ts` or `route.js`
      const expressPath = `/api${parentPath.replace(/\[(\w+)\]/g, ':$1')}`; // Convert `[param]` to `:param`

      // Import the route handler
      const routeHandler = await import(fullPath);

      // Apply route handler, assuming it exports a default function
      app.use(expressPath, async (req: Request, res: Response, next: NextFunction) => {
        try {
          await routeHandler.default(req, res);
        } catch (err) {
          next(err);
        }
      });

      console.log(`Loaded route: [${expressPath}] -> ${fullPath}`);
    }
  }
};

// Enable CORS for all routes
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Load API routes from 'server/api' folder
loadRoutes(path.join(__dirname, 'api'))
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
