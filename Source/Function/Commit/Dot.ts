export interface Interface {
	Max?: number;

	Column?: number;
}

export default class _Class {
	private readonly Configuration: Required<Interface>;

	private static readonly Default: Required<Interface> = {
		Max: 20,
		Column: 5,
	};

	private static readonly Symbol = {
		4: "⁞",
		3: "⋮",
		2: ":",
		1: "·",
		0: " ",
	};

	constructor(Configuration: Interface = {}) {
		this.Configuration = {
			..._Class.Default,
			...Configuration,
		};
	}

	public Column(File: number): string {
		const Count = Math.max(0, Math.min(this.Configuration.Max, File));

		const Group = Math.floor(Count / 4);

		const Remainder = Count % 4;

		const Column: string[] = Array(this.Configuration.Column).fill(
			_Class.Symbol[0],
		);

		for (
			let Index = 0;
			Index < Group && Index < this.Configuration.Column;
			Index++
		) {
			Column[Index] = _Class.Symbol[4];
		}

		if (Remainder > 0 && Group < this.Configuration.Column) {
			Column[Group] = this.Symbol(Remainder);
		}

		return Column.join();
	}

	private Symbol(Count: number): string {
		switch (Count) {
			case 1:
				return _Class.Symbol[1];

			case 2:
				return _Class.Symbol[2];

			case 3:
				return _Class.Symbol[3];

			case 4:
				return _Class.Symbol[4];

			default:
				return _Class.Symbol[0];
		}
	}
}

console.log("File Count Display Test:\n");

console.log(new _Class().Column(5));
