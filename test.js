// Run your extension locally against the reference runtime — no host app needed.
//   node test.js
//
// This imports your code the same way a host does and dispatches each
// contribution against a tiny in-memory world, so you can iterate fast.
import fs from "node:fs";
import * as mod from "./code/main.js";
import { createWorld, runFilter, runTransition } from "@azphalt/runtime-reference";

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf-8"));

// Filter: brighten one pixel by amount = 0.2 (+51).
const w1 = createWorld({ width: 1, height: 1, params: { amount: 0.2 } });
w1.layers[0].bitmap.data.set([100, 100, 100, 255]);
await runFilter(manifest, mod, w1);
console.log("brightness →", Array.from(w1.layers[0].bitmap.data)); // [151, 151, 151, 255]

// Transition: crossfade black → white at the midpoint.
const w2 = createWorld({ width: 1, height: 1 });
await runTransition(manifest, mod, w2, {
  from: { data: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1 },
  to: { data: new Uint8ClampedArray([255, 255, 255, 255]), width: 1, height: 1 },
  progress: 0.5,
});
console.log("crossfade  →", Array.from(w2.layers[0].bitmap.data)); // [128, 128, 128, 255]

console.log("\nOK — your extension runs against the reference runtime.");
