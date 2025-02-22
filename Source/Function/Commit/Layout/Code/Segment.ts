import { Layer, Lerp } from "@Function/Commit/Layout/Code/Animation.js";
import HEX from "@Function/Commit/Layout/Code/HEX.js";
import Interpolate from "@Function/Commit/Layout/Code/Interpolate.js";
import RGB from "@Function/Commit/Layout/Code/RGB.js";

// stone.50
const StoneLow = RGB("#faf9f8");

// stone.950
const StoneHigh = RGB("#9a9a79");

// neutral.50
const NeutralLow = RGB("#faf9f7");

// neutral.950
const NeutralHigh = RGB("#9a933f");

// zinc.50
const ZincLow = RGB("#f8f7f5");

// zinc.950
const ZincHigh = RGB("#7a7b37");

const TimeNoise = 0;

const NoiseInfluence = 0.5;

export default (Total: number, Element: HTMLDivElement) => {
	Element.innerHTML = "";

	Element.querySelectorAll(".Segment").forEach((Element) => Element.remove());

	for (let Index = 0; Index < Total; Index++) {
		let Low, High, SegmentGroup, IndexGroup, Seed;

		if (Index < 360) {
			Low = StoneLow;

			High = StoneHigh;

			SegmentGroup = Total < 360 ? Total : 360;

			IndexGroup = Index;

			Seed = 0;
		} else if (Index < 720) {
			Low = NeutralLow;

			High = NeutralHigh;

			SegmentGroup = Math.min(360, Total - 360);

			IndexGroup = Index - 360;

			Seed = 1;
		} else {
			Low = ZincLow;

			High = ZincHigh;

			SegmentGroup = Total - 720;

			IndexGroup = Index - 720;

			Seed = 2;
		}

		const Segment = document.createElement("div");

		Segment.classList.add("Segment");

		Segment.style.backgroundColor = HEX(
			Interpolate(
				Low,

				High,

				Lerp(
					SegmentGroup > 1 ? IndexGroup / (SegmentGroup - 1) : 0,

					(Layer(TimeNoise + Seed, IndexGroup) + 1) / 2,

					NoiseInfluence,
				),
			),
		);

		Element.appendChild(Segment);
	}
};
