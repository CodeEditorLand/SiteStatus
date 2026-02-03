import { _ as __vitePreload } from './preload-helper.BC7ZYKCr.js';
import { C as Color } from './Color.C4Mb3onX.js';

const Noise = (await __vitePreload(async () => { const {createNoise2D} = await import('./simplex-noise.n4dlx2W3.js');return { createNoise2D }},true              ?[]:void 0)).createNoise2D();
const Flatten = (Color) => {
  const Return = [];
  for (const [_Key, Value] of Object.entries(Color)) {
    if (typeof Value === "string") {
      Return.push(Value);
    } else if (typeof Value === "object") {
      Return.push(...Object.values(Value));
    }
  }
  return Return;
};
const Lerp = (APoint, BPoint, TargetPoint) => APoint + (BPoint - APoint) * TargetPoint;
const Layer = (Time, Offset, Strength = 1e-4) => Noise(Time + Offset, 20) + Strength * Noise(Time * 2 + Offset, 30);
const Spectrum = (Step) => {
  const Color$1 = Flatten(Color);
  const Palette = Color$1.length;
  if (Step >= Palette) {
    return Color$1;
  }
  return Array.from(
    { length: Step },
    (_, Index) => Color$1[Math.floor(Index * Palette / Step)]
  );
};
const Influence = (DX, DY, TimeCurrent, MouseState) => {
  return Math.max(0, 1 - Math.sqrt(DX * DX + DY * DY) / Constant.RADIUS_EFFECT) * Math.max(
    0,
    1 - (TimeCurrent - MouseState.Last) / Constant.FADE_DURATION
  );
};
const { default: Constant } = await __vitePreload(async () => { const { default: Constant } = await import('./Constant.Dw51-MKk.js');return { default: Constant }},true              ?[]:void 0);

export { Constant, Flatten, Influence, Layer, Lerp, Noise, Spectrum };
//# sourceMappingURL=Animation.KS6CSEH2.js.map
