const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/Animation.KS6CSEH2.js","_astro/preload-helper.BC7ZYKCr.js","_astro/Color.C4Mb3onX.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './preload-helper.BC7ZYKCr.js';

class Dimensional {
  TimeCurrent;
  Seed;
  StateMouse;
  InfluenceMouse;
  constructor(TimeCurrent, Seed, StateMouse, InfluenceMouse) {
    this.TimeCurrent = TimeCurrent;
    this.Seed = Seed;
    this.StateMouse = StateMouse;
    this.InfluenceMouse = InfluenceMouse;
  }
  Calculate(dx, dy) {
    const {
      DIMENSION,
      AMPLITUDE_BASE,
      AMPLITUDE_VARIATION,
      MULTIPLIER_TIME_BASE,
      MULTIPLIER_TIME_VARIATION,
      COLOR_STEPS
    } = Constant;
    const FactorMouse = this.InfluenceMouse * Math.min(1, this.StateMouse.Velocity / 100);
    return Array.from({ length: DIMENSION }).reduce(
      (Accumulate, _, Index) => {
        this.Apply(
          Accumulate,
          Index,
          Layer(
            this.TimeCurrent * (MULTIPLIER_TIME_BASE + Index * MULTIPLIER_TIME_VARIATION) + this.Seed,
            Index * 1e3
          ),
          AMPLITUDE_BASE + Index * AMPLITUDE_VARIATION,
          dx,
          dy,
          FactorMouse,
          COLOR_STEPS
        );
        return Accumulate;
      },
      { X: 0, Y: 0, Rotation: 0, Scale: 1 }
    );
  }
  Apply(Accumulate, Dimension, Value, amplitude, DX, DY, FactorMouse, colorSteps) {
    switch (Dimension) {
      case 0:
        Accumulate.X = Value * amplitude + DX * FactorMouse;
        break;
      case 1:
        Accumulate.Y = Value * amplitude + DY * FactorMouse;
        break;
      case 2:
        Accumulate.Rotation = Value * colorSteps * FactorMouse;
        break;
      case 3:
        Accumulate.Scale = 1 + Value * 0.5 * FactorMouse;
        break;
    }
  }
}
const { default: Constant } = await __vitePreload(async () => { const { default: Constant } = await import('./Constant.Dw51-MKk.js');return { default: Constant }},true              ?[]:void 0);
const { Layer } = await __vitePreload(async () => { const { Layer } = await import('./Animation.KS6CSEH2.js');return { Layer }},true              ?__vite__mapDeps([0,1,2]):void 0);

export { Constant, Layer, Dimensional as default };
//# sourceMappingURL=Dimensional.Bnd6HXkw.js.map
