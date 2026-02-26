# TypeScript + Bun Backend Setup

## Backend Technology Stack
- **Language:** TypeScript
- **Runtime:** Bun.js (ultra-fast JavaScript runtime)
- **Framework:** Express.js
- **Package Manager:** Bun

## Installation & Setup

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Verify Bun installation
bun --version

# Navigate to backend
cd backend

# Install dependencies with Bun
bun install

# Start development server
bun run dev

# Start production server
bun start

# Run tests
bun test
```

## Why Bun?

✅ **Ultra-fast runtime** - 3-4x faster than Node.js
✅ **Built-in TypeScript support** - No tsc needed
✅ **Integrated package manager** - No separate npm/yarn/pnpm
✅ **ESM-first** - Modern JavaScript modules
✅ **Hot reload** - `bun run --watch` for development

## File Structure

```
backend/
├── src/
│   ├── index.ts           # Express server entry point
│   ├── data/
│   │   └── messageGenerator.ts    # Synthetic message generation
│   ├── metrics/
│   │   └── metricsCalculator.ts   # Metrics calculation
│   ├── mutations/
│   │   └── mutationDetector.ts    # Mutation detection logic
│   └── api/
│       ├── routes.ts      # API endpoints
│       ├── controllers.ts # Business logic
│       └── middleware.ts  # Express middleware
├── tests/
│   ├── data.test.ts
│   ├── metrics.test.ts
│   └── mutations.test.ts
├── tsconfig.json
├── package.json
└── bunfig.toml (optional Bun config)
```

## Key Bun Commands

```bash
bun install <package>       # Install package
bun remove <package>        # Remove package
bun run <script>            # Run npm script
bun run --watch script      # Watch mode
bun test                    # Run tests
bun build ./src/index.ts    # Bundle for production
```

## API Endpoints (To Implement)

```typescript
POST /api/simulation/start
// Starts a new 8-week simulation
// Returns: { simulation_id, week_1_data }

GET /api/simulation/:id/week/:n
// Gets data for a specific week
// Returns: { week, metrics, mutations, diagnostics, messages }

GET /api/simulation/:id/narrative
// Gets the complete 8-week story
// Returns: { timeline, interventions, recovery_path }
```

## Development Workflow

1. Make changes in `src/` (TypeScript)
2. Bun automatically compiles TypeScript
3. Server hot-reloads with `bun run --watch`
4. Write tests in `tests/` folder
5. Run `bun test` before committing

## Production Build

```bash
bun build ./src/index.ts --outdir ./dist
bun ./dist/index.js  # Run compiled version
```

---

**Next:** Implement MessageGenerator, MetricsCalculator, and API routes!
