import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { SimplexSolver } from "./simplex";
import { LuggageCalculator, TravelClass } from './luggage-calculator';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

app.post("/api/simplex", (req, res) => {
  try {
    const { objective, constraints, b, isMaximization = true } = req.body;

    // Validate input
    if (!objective || !constraints || !b) {
      return res.status(400).json({ 
        message: "Missing required parameters: objective, constraints, b" 
      });
    }

    if (!Array.isArray(objective) || !Array.isArray(constraints) || !Array.isArray(b)) {
      return res.status(400).json({ 
        message: "Invalid input: objective, constraints, and b must be arrays" 
      });
    }

    const solver = new SimplexSolver(objective, constraints, b, isMaximization);
    const result = solver.solve();

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to solve linear program" 
    });
  }
});

const luggageCalculator = new LuggageCalculator();

app.post('/api/calculate-luggage-charge', (req, res) => {
    try {
        const { luggageWeight, travelClass } = req.body;

        // Input validation
        if (typeof luggageWeight !== 'number' || luggageWeight <= 0) {
            return res.status(400).json({
                message: 'Invalid luggage weight'
            });
        }

        if (!Object.values(TravelClass).includes(travelClass)) {
            return res.status(400).json({
                message: 'Invalid travel class. Must be ECONOMY, BUSINESS, or FIRST'
            });
        }

        const result = luggageCalculator.calculateFare(
            luggageWeight,
            travelClass as TravelClass
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to calculate fare'
        });
    }
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
