const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/Dimensional.B3jzS8p0.js","_astro/preload-helper.BelkbqnE.js","_astro/Style.DhOb7T4B.js","_astro/dev.DQ0JVKdb.js","_astro/Animation.Bwo_u5rw.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './preload-helper.BelkbqnE.js';
import { d as createSignal, o as onMount, g as getNextElement, u as use, f as className, t as template } from './dev.DQ0JVKdb.js';

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
} = await import('./Dimensional.B3jzS8p0.js');return {
  default: Dimensional
}},true?__vite__mapDeps([0,1]):void 0);
const {
  default: Style
} = await __vitePreload(async () => { const {
  default: Style
} = await import('./Style.DhOb7T4B.js');return {
  default: Style
}},true?__vite__mapDeps([2,1,3]):void 0);
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
} = await import('./Animation.Bwo_u5rw.js');return {
  Influence,
  Layer,
  Noise,
  Spectrum
}},true?__vite__mapDeps([4,1]):void 0);
const {
  default: Constant
} = await __vitePreload(async () => { const {
  default: Constant
} = await import('./Constant.Dw51-MKk.js');return {
  default: Constant
}},true?[]:void 0);
const ALL_COLORS = Spectrum(Constant.COLOR_STEPS);

export { ALL_COLORS, Constant, Dimensional, Influence, Layer, Noise, Spectrum, Style, Pixel as default };
//# sourceMappingURL=Pixel.BdW3ddoa.js.map
