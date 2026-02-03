const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/Dimensional.Bnd6HXkw.js","_astro/preload-helper.BC7ZYKCr.js","_astro/Style.DQ5bihtM.js","_astro/dev.nsFDVpVE.js","_astro/Animation.KS6CSEH2.js","_astro/Color.C4Mb3onX.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './preload-helper.BC7ZYKCr.js';
import { g as getNextElement, u as use, c as className, t as template } from './dev.KOe7-PYV.js';
import { createSignal, onMount } from './dev.nsFDVpVE.js';

var _tmpl$ = /* @__PURE__ */ template(`<div>`);
const Pixel = ({
  Font,
  Character,
  Index: _,
  Show,
  Text,
  Mouse,
  Container,
  CurrentTime,
  Row,
  Column
}) => {
  const [Element, _Element] = createSignal();
  const Position = Character % Text;
  const Seed = Position * 0.1 + Row * 0.05 + Column * 0.02;
  onMount(() => {
    if (!(Show && Element() && Container)) {
      return;
    }
    new Style(Element(), {
      TimeNoise: Position * 0.1 + CurrentTime() * (Constant.MULTIPLIER_TIME_BASE + Noise(CurrentTime() * 1e-3 + Seed, 30) * Constant.MULTIPLIER_TIME_VARIATION),
      Seed,
      Column,
      Position,
      Influence: 0,
      Offset: new Dimensional(CurrentTime(), Seed, Mouse(), 1).Calculate(1, 1),
      Mouse,
      Spectrum: ALL_COLORS
    }).Roll();
  });
  return (() => {
    var _el$ = getNextElement(_tmpl$);
    use(_Element, _el$);
    className(_el$, `h-${Font} w-${Font}`);
    return _el$;
  })();
};
const {
  default: Dimensional
} = await __vitePreload(async () => { const {
  default: Dimensional
} = await import('./Dimensional.Bnd6HXkw.js');return {
  default: Dimensional
}},true              ?__vite__mapDeps([0,1]):void 0);
const {
  default: Style
} = await __vitePreload(async () => { const {
  default: Style
} = await import('./Style.DQ5bihtM.js');return {
  default: Style
}},true              ?__vite__mapDeps([2,1,3]):void 0);
const {
  Influence,
  Layer,
  Noise,
  Spectrum
} = await __vitePreload(async () => { const {
  Influence,
  Layer,
  Noise,
  Spectrum
} = await import('./Animation.KS6CSEH2.js');return {
  Influence,
  Layer,
  Noise,
  Spectrum
}},true              ?__vite__mapDeps([4,1,5]):void 0);
const {
  default: Constant
} = await __vitePreload(async () => { const {
  default: Constant
} = await import('./Constant.Dw51-MKk.js');return {
  default: Constant
}},true              ?[]:void 0);
const ALL_COLORS = Spectrum(Constant.COLOR_STEPS);

export { ALL_COLORS, Constant, Dimensional, Influence, Layer, Noise, Spectrum, Style, Pixel as default };
//# sourceMappingURL=Pixel.Ddsd42Tl.js.map
