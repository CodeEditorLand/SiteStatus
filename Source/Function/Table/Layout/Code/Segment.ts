import { Layer, Lerp } from "@Function/Table/Layout/Code/Animation.js";
import HEX from "@Function/Table/Layout/Code/HEX.js";
import Interpolate from "@Function/Table/Layout/Code/Interpolate.js";
import RGB from "@Function/Table/Layout/Code/RGB.js";
import Color from "@Function/TailWind/Color.js";

const TimeNoise = 0;

const NoiseInfluence = 0.9;

const Multiplier = 0.1;

export default (Total: number, Element: HTMLDivElement): boolean => {
	Element.innerHTML = "";

	Element.querySelectorAll(".Segment").forEach((Element): void =>
		Element.remove(),
	);

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

		const Base = Lerp(
			SegmentGroup > 1 ? IndexGroup / (SegmentGroup - 1) : 0,
			(Layer(TimeNoise + Seed, IndexGroup) + 1) / 2,
			NoiseInfluence,
		);

		Segment.style.backgroundColor = HEX(Interpolate(Low, High, Base));

		const Corner = document.createElement("div");

		Corner.classList.add("Corner");

		Corner.style.backgroundColor = HEX(
			Interpolate(Low, High, Math.min(1, Base + Multiplier)),
		);

		Segment.appendChild(Corner);

		Element.appendChild(Segment);
	}

	return true;
};
