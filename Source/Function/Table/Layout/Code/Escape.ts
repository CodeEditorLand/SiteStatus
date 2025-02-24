export default (Text: string): string =>
	Text?.replace(/&/g, "&amp;")
		?.replace(/</g, "&lt;")
		?.replace(/>/g, "&gt;")
		?.replace(/"/g, "&quot;")
		?.replace(/'/g, "&#039;");
