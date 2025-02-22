export interface Interface {
	Total?: number;

	Column?: number;
}

export default class _Class {
	private readonly Configuration: Required<Interface>;

	private static readonly Default: Required<Interface> = {
		Total: 20,
		Column: 5,
	};

	constructor(Configuration: Interface = {}) {
		this.Configuration = {
			..._Class.Default,
			...Configuration,
		};
	}

	public Display(File: number = 1): string {
		const Percentage = 100 / this.Configuration.Column;

		const Column: string[] = new Array(this.Configuration.Column).fill("");

		for (let Index = 0; Index < this.Configuration.Column; Index++) {
			Column[Index] = this.Braille(
				Math.round(
					(Math.min(
						100,
						Math.max(
							0,
							Math.min(
								100,
								Math.max(
									0,
									(((Math.max(
										0,
										Math.min(
											this.Configuration.Total,
											File,
										),
									) /
										this.Configuration.Total) *
										100 -
										Index * Percentage) /
										Percentage) *
										100,
								),
							),
						),
					) /
						100) *
						8,
				),
			);
		}

		return Column.join("");
	}

	// TODO: USE ▏▎▍▌▋▊▉ maybe?
	private Braille(Dot: number): string {
		let Pattern = 0;

		for (let Index = 0; Index < Dot; Index++) {
			// @ts-expect-error
			Pattern |= 1 << ([1, 2, 3, 7, 4, 5, 6, 8][Index] - 1);
		}

		return String.fromCharCode(0x2800 + Pattern);
	}
}
