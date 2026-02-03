const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/Animation.KS6CSEH2.js","_astro/preload-helper.BC7ZYKCr.js","_astro/Color.C4Mb3onX.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './preload-helper.BC7ZYKCr.js';
import { createEffect } from './dev.nsFDVpVE.js';

class Style {
  Element;
  TimeNoise;
  Seed;
  Column;
  Position;
  Influence;
  Offset;
  Mouse;
  Spectrum;
  constructor(Element, Parameter) {
    this.Element = Element;
    this.TimeNoise = Parameter.TimeNoise;
    this.Seed = Parameter.Seed;
    this.Column = Parameter.Column;
    this.Position = Parameter.Position;
    this.Influence = Parameter.Influence;
    this.Offset = Parameter.Offset;
    this.Mouse = Parameter.Mouse;
    this.Spectrum = Parameter.Spectrum;
  }
  Roll() {
    this.Transform();
    this.ZIndex();
    this.Color();
    this.Shadow();
    this.Opacity();
    this.Transition();
  }
  Transform() {
    const Transform = `rotate(${(Layer(this.TimeNoise + this.Seed, this.Column + this.Position) * Math.PI + this.Offset.Rotation * this.Influence) * (180 / Math.PI)}deg) translateX(${this.Radius()}px)`;
    createEffect(() => {
      this.Element.style.transform = this.Mouse().Active ? `${Transform} translate(${this.Offset.X}px, ${this.Offset.Y}px) scale(${this.Offset.Scale})` : Transform;
    });
  }
  Radius() {
    return (Layer(this.TimeNoise + this.Seed, this.Column + this.Position) + 1) / 2 * (Constant.AMPLITUDE_BASE + Layer(this.TimeNoise, 10) * Constant.AMPLITUDE_VARIATION) * (1 - this.Influence) + Math.sqrt(
      this.Offset.X * this.Offset.X + this.Offset.Y * this.Offset.Y
    ) * this.Influence;
  }
  ZIndex() {
    this.Element.style.zIndex = Math.floor(
      Lerp(
        Math.floor(
          (Layer(
            this.TimeNoise + this.Seed,
            this.Column + this.Position
          ) + 1) / 2 * 10
        ),
        100,
        this.Influence
      )
    ).toString();
  }
  Color() {
    createEffect(() => {
      this.Element.style.backgroundColor = this.Mouse().Active ? `hsl(${Lerp(
        (Layer(
          this.TimeNoise + this.Seed,
          this.Column + this.Position
        ) + 1) / 2 * 360,
        this.Mouse().Velocity * 2 % 360,
        this.Influence
      )}, 100%, 50%)` : this.Spectrum[Math.floor(
        (Layer(
          this.TimeNoise + this.Seed,
          this.Column + this.Position
        ) + 1) * 180
      )];
    });
  }
  Shadow() {
    createEffect(() => {
      const Color = this.Mouse().Active ? this.Element.style.backgroundColor : this.Spectrum[Math.floor(
        (Layer(
          this.TimeNoise + this.Seed,
          this.Column + this.Position
        ) + 1) * 180
      )];
      this.Element.style.boxShadow = `0 0 ${Lerp(
        (Layer(this.TimeNoise + this.Seed, this.Column + 50) + 1) / 2 * 10,
        this.Influence * 20,
        this.Influence
      )}px ${Color}`;
    });
  }
  Opacity() {
    this.Element.style.opacity = Lerp(
      (Layer(this.TimeNoise + this.Seed, this.Column + 150) + 1) / 2 * 0.3 + 0.7,
      1,
      this.Influence
    ).toString();
  }
  Transition() {
    this.Element.style.transitionDuration = `${((Layer(this.TimeNoise + this.Seed, this.Column + 100) + 1) / 2 * 10 + 5).toFixed(2)}s`;
  }
}
const { default: Constant } = await __vitePreload(async () => { const { default: Constant } = await import('./Constant.Dw51-MKk.js');return { default: Constant }},true              ?[]:void 0);
const { Layer, Lerp } = await __vitePreload(async () => { const { Layer, Lerp } = await import('./Animation.KS6CSEH2.js');return { Layer, Lerp }},true              ?__vite__mapDeps([0,1,2]):void 0);

export { Constant, Layer, Lerp, Style as default };
//# sourceMappingURL=Style.DQ5bihtM.js.map
