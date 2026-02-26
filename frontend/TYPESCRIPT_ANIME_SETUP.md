# TypeScript + anime.js Frontend Setup

## Frontend Technology Stack
- **Language:** TypeScript
- **Build Tool:** Vite (lightning-fast build)
- **Animation:** anime.js (flexible animation library)
- **HTTP Client:** axios
- **CSS:** Custom (no frameworks)

## Installation & Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies with Bun (or npm/yarn)
bun install

# Start development server
bun run dev
# Opens http://localhost:5173

# Build for production
bun run build

# Preview production build
bun run preview

# Type check
bun run type-check
```

## Why anime.js?

✅ **Flexible animation library** - Works with any CSS/DOM/SVG
✅ **Powerful API** - Chainable, promise-based
✅ **Lightweight** - 17KB minified
✅ **Perfect for data visualization** - Smooth transitions for metrics
✅ **Great for rope animation** - Smooth state transitions

## File Structure

```
frontend/
├── public/
│   ├── index.html         # Main HTML with canvas
│   └── styles.css         # Modern responsive CSS
├── src/
│   ├── app.ts             # Main TypeScript application
│   ├── components/
│   │   ├── rope-animation.ts      # Canvas rope rendering
│   │   ├── metrics-display.ts     # Metrics visualization
│   │   ├── diagnostic-box.ts      # Diagnostic panel
│   │   └── api-client.ts          # Backend API integration
│   └── types.ts           # TypeScript interfaces
├── tsconfig.json
├── package.json
└── vite.config.ts (optional)
```

## Key Features

### Rope Animation (anime.js)
```typescript
anime({
  targets: ropeState,
  rotation: 360,
  frayAmount: 50,
  duration: 6000,
  easing: 'easeInOutQuad',
  update: () => {
    canvas.draw(ropeState);
  }
});
```

### Metrics Display
- Real-time bars with smooth anime.js transitions
- Silos (%), Sentiment (%), Response Time (h), Burnout Risk (%)

### Diagnostic Box
- Week number
- Mutation type
- Root cause
- Suggested action

## Development Workflow

1. Make changes in `src/` (TypeScript)
2. Vite hot-reloads automatically
3. TypeScript type checking on save
4. Use `bun run type-check` before commit

## anime.js Animation Examples

```typescript
// Animate silos metric
anime({
  targets: '.silos-bar',
  width: '60%',
  duration: 800,
  easing: 'easeInOutQuad'
});

// Animate rope color transition
anime({
  targets: rope,
  color: '#ff6b6b',
  duration: 1000,
  easing: 'easeOutQuad'
});

// Chain animations
anime.timeline()
  .add({
    targets: '.rope-canvas',
    scale: 1.1,
    duration: 500
  })
  .add({
    targets: '.rope-canvas',
    scale: 1,
    duration: 500
  });
```

## API Integration

```typescript
// Fetch week data from backend
const response = await axios.get(`/api/simulation/${simId}/week/${week}`);
const weekData = response.data;

// Update animations based on data
this.animateRope(weekData);
this.updateMetrics(weekData);
```

## Production Build

```bash
bun run build
# Creates optimized build in dist/

# Serve production build
bun run preview
```

## Performance Tips

✅ Use anime.js for DOM/Canvas animations (not CSS)
✅ Cache week data to reduce API calls
✅ Use Canvas for complex rope visualization
✅ Lazy load components as needed
✅ Minify CSS/JS in production

---

**Next:** Implement rope animation, metrics updates, and backend integration!
