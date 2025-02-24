import { Layer, Lerp } from "@Function/Table/Layout/Code/Animation.js";
import HEX from "@Function/Table/Layout/Code/HEX.js";
import Interpolate from "@Function/Table/Layout/Code/Interpolate.js";
import RGB from "@Function/Table/Layout/Code/RGB.js";
import Color from "@Function/TailWind/Color.js";
import type { InternalSettings } from "datatables.net-dt";

const TimeNoise = 0;

const NoiseInfluence = 0.5;

export default (Element: HTMLElement, Setting: InternalSettings): void => {
	const Cell = Element.querySelectorAll<HTMLTableCellElement>("td, th");

	const Total = Cell.length;

	if (!Total) {
		return;
	}

	const Group = Math.ceil(Total / 3);

	const URL: string = Setting?.["ajax"]?.url;

	Cell.forEach((Element, Index): void => {
		let Low, High, Local, Count, Seed;

		if (Index < Group) {
			Low = RGB(
				URL.includes("Cache/Tag") ? Color.cyan[50] : Color.amber[50],
			);

			High = RGB(
				URL.includes("Cache/Tag") ? Color.cyan[950] : Color.amber[950],
			);

			Local = Index;

			Count = Group;

			Seed = 0;
		} else if (Index < Group * 2) {
			Low = RGB(
				URL.includes("Cache/Tag") ? Color.sky[50] : Color.orange[50],
			);

			High = RGB(
				URL.includes("Cache/Tag") ? Color.sky[950] : Color.orange[950],
			);

			Local = Index - Group;

			Count = Group;

			Seed = 1;
		} else {
			Low = RGB(
				URL.includes("Cache/Tag") ? Color.blue[50] : Color.red[50],
			);

			High = RGB(
				URL.includes("Cache/Tag") ? Color.blue[950] : Color.red[950],
			);

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
	});

	return true;
};
