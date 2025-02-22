import { Layer, Lerp } from "@Function/Commit/Layout/Code/Animation.js";
import HEX from "@Function/Commit/Layout/Code/HEX.js";
import Interpolate from "@Function/Commit/Layout/Code/Interpolate.js";
import RGB from "@Function/Commit/Layout/Code/RGB.js";
import Color from "@Function/TailWind/Color.js";

const TimeNoise = 0;

const NoiseInfluence = 0.5;

export default (Total: number, Element: HTMLDivElement) => {
	Element.innerHTML = "";

	Element.querySelectorAll(".Segment").forEach((Element) => Element.remove());

	for (let Index = 0; Index < Total; Index++) {
		let Low, High, SegmentGroup, IndexGroup, Seed;

		if (Index < 360) {
			Low = RGB(Color.stone["50"]);

			High = RGB(Color.stone["950"]);

			SegmentGroup = Total < 360 ? Total : 360;

			IndexGroup = Index;

			Seed = 0;
		} else if (Index < 720) {
			Low = RGB(Color.neutral["50"]);

			High = RGB(Color.neutral["950"]);

			SegmentGroup = Math.min(360, Total - 360);

			IndexGroup = Index - 360;

			Seed = 1;
		} else {
			Low = RGB(Color.zinc["50"]);

			High = RGB(Color.zinc["950"]);

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

	return true;
};
