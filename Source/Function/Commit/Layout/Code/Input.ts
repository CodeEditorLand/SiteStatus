import { Layer, Lerp } from "@Function/Commit/Layout/Code/Animation.js";
import HEX from "@Function/Commit/Layout/Code/HEX.js";
import Interpolate from "@Function/Commit/Layout/Code/Interpolate.js";
import RGB from "@Function/Commit/Layout/Code/RGB.js";
import Color from "@Function/TailWind/Color.js";

const TimeNoise = 0;

const NoiseInfluence = 0.5;

export default (Element: HTMLElement) => {
	const Input = Element.querySelectorAll<
		HTMLInputElement | HTMLSelectElement
	>(".dt-input, .dt-search input");

	const Total = Input.length;

	if (!Total) {
		return;
	}

	const Group = Math.ceil(Total / 3);

	Input.forEach((Element, Index) => {
		let Low, High, Local, Count, Seed;

		if (Index < Group) {
			Low = RGB(Color.cyan[50]);

			High = RGB(Color.cyan[950]);

			Local = Index;

			Count = Group;

			Seed = 0;
		} else if (Index < Group * 2) {
			Low = RGB(Color.sky[50]);

			High = RGB(Color.sky[950]);

			Local = Index - Group;

			Count = Group;

			Seed = 1;
		} else {
			Low = RGB(Color.blue[50]);

			High = RGB(Color.blue[950]);

			Local = Index - Group * 2;

			Count = Total - Group * 2;

			Seed = 2;
		}

		const Base = Count > 1 ? Local / (Count - 1) : 0;

		Element.style.borderTopColor = HEX(
			Interpolate(
				Low,
				High,
				Lerp(
					Base,
					(Layer(TimeNoise + Seed + 0, Local) + 1) / 2,
					NoiseInfluence,
				),
			),
		);

		Element.style.borderRightColor = HEX(
			Interpolate(
				Low,
				High,
				Lerp(
					Base,
					(Layer(TimeNoise + Seed + 10, Local) + 1) / 2,
					NoiseInfluence,
				),
			),
		);

		Element.style.borderBottomColor = HEX(
			Interpolate(
				Low,
				High,
				Lerp(
					Base,
					(Layer(TimeNoise + Seed + 20, Local) + 1) / 2,
					NoiseInfluence,
				),
			),
		);

		Element.style.borderLeftColor = HEX(
			Interpolate(
				Low,
				High,
				Lerp(
					Base,
					(Layer(TimeNoise + Seed + 30, Local) + 1) / 2,
					NoiseInfluence,
				),
			),
		);

		if (Element instanceof HTMLSelectElement) {
			Element.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='rgb(${Interpolate(
				Low,
				High,
				Lerp(
					Base,
					(Layer(TimeNoise + Seed + 40, Local) + 1) / 2,
					NoiseInfluence,
				),
			)})' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;
		}
	});

	return true;
};
