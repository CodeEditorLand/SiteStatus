const apiKey = import.meta.env["PUBLIC_FIREBASE_API_KEY"] ?? "";
const appId = import.meta.env["PUBLIC_FIREBASE_APP_ID"] ?? "";
const authDomain = import.meta.env["PUBLIC_FIREBASE_AUTH_DOMAIN"] ?? "";
const databaseURL = import.meta.env["PUBLIC_FIREBASE_DATABASE_URL"] ?? "";
const measurementId =
	import.meta.env["PUBLIC_FIREBASE_MEASUREMENT_ID"] ?? "";
const messagingSenderId =
	import.meta.env["PUBLIC_FIREBASE_MESSAGING_SENDER_ID"] ?? "";
const projectId = import.meta.env["PUBLIC_FIREBASE_PROJECT_ID"] ?? "";
const storageBucket =
	import.meta.env["PUBLIC_FIREBASE_STORAGE_BUCKET"] ?? "";

// Only initialize Firebase when at least apiKey and projectId are configured.
export default await (async () => {
	if (!apiKey || !projectId) {
		console.warn(
			"Firebase: skipping initialization — PUBLIC_FIREBASE_API_KEY and/or PUBLIC_FIREBASE_PROJECT_ID are not set.",
		);
		return null;
	}

	const { initializeApp } = await import("firebase/app");

	return initializeApp({
		apiKey,
		appId,
		authDomain,
		databaseURL,
		measurementId,
		messagingSenderId,
		projectId,
		storageBucket,
	});
})();
