const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/Pixel.Ddsd42Tl.js","_astro/preload-helper.BC7ZYKCr.js","_astro/dev.KOe7-PYV.js","_astro/dev.nsFDVpVE.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './preload-helper.BC7ZYKCr.js';
import { g as getNextElement, t as template, u as use, i as insert } from './dev.KOe7-PYV.js';
import './dev.nsFDVpVE.js';

var _tmpl$ = /* @__PURE__ */ template(`<div class="Scroll w-full p-2"><p class=sr-only></p><div class="flex justify-center"aria-hidden=true>`), _tmpl$2 = /* @__PURE__ */ template(`<div class=mr-2>`), _tmpl$3 = /* @__PURE__ */ template(`<div class=Grid>`), _tmpl$4 = /* @__PURE__ */ template(`<div class="Row flex">`);
const Code = ({
  Text = "",
  Font = 1
}) => {
  const [Mouse, _Mouse] = createSignal({
    X: 0,
    Y: 0,
    XPrevious: 0,
    YPrevious: 0,
    Velocity: 0,
    Last: 0,
    Active: false
  });
  const [Element, _Element] = createSignal();
  const [Count, _Count] = createSignal(Text.length);
  const [CurrentTime, _CurrentTime] = createSignal(performance.now());
  const [_Text] = createSignal(Text);
  createEffect(() => {
    let ID;
    const Scroll = (Time) => {
      _CurrentTime(Time);
      ID = requestAnimationFrame(Scroll);
    };
    ID = requestAnimationFrame(Scroll);
    onCleanup(() => cancelAnimationFrame(ID));
  });
  const Display = () => {
    return _Text().slice(0, Count());
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    use(_Element, _el$);
    insert(_el$2, _Text);
    insert(_el$3, () => Display().split("").map((Visible, Character) => (() => {
      var _el$4 = getNextElement(_tmpl$2);
      insert(_el$4, () => ((Position) => (() => {
        var _el$5 = getNextElement(_tmpl$3);
        insert(_el$5, () => (Matrix[Position.toUpperCase()] || Matrix[" "])?.map((Row, RowIndex) => (() => {
          var _el$6 = getNextElement(_tmpl$4);
          insert(_el$6, () => Row.map((Show, Index) => Pixel({
            Font,
            Character,
            Index,
            Show,
            Text: Display().length,
            Mouse,
            Container: Element()?.getBoundingClientRect(),
            CurrentTime,
            Row: RowIndex,
            Column: Index % 3
          })));
          return _el$6;
        })()));
        return _el$5;
      })())(Visible));
      return _el$4;
    })()));
    return _el$;
  })();
};
const {
  default: Pixel
} = await __vitePreload(async () => { const {
  default: Pixel
} = await import('./Pixel.Ddsd42Tl.js');return {
  default: Pixel
}},true              ?__vite__mapDeps([0,1,2,3]):void 0);
const {
  default: Matrix
} = await __vitePreload(async () => { const {
  default: Matrix
} = await import('./Matrix.cJF7vYq6.js');return {
  default: Matrix
}},true              ?[]:void 0);
const {
  createEffect,
  createSignal,
  onCleanup,
  onMount
} = await __vitePreload(async () => { const {
  createEffect,
  createSignal,
  onCleanup,
  onMount
} = await import('./dev.nsFDVpVE.js');return {
  createEffect,
  createSignal,
  onCleanup,
  onMount
}},true              ?[]:void 0);

export { Code as default };
//# sourceMappingURL=Code.MwCJO2Ku.js.map
