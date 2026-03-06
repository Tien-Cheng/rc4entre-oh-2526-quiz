import type { FirebaseOptions } from 'firebase/app';

export const firebaseWebConfig: FirebaseOptions = {
	apiKey: 'AIzaSyAAy1ZbhP6rOiX7vXGbiAtRKXw0sKgbrQE',
	authDomain: 'rc4entre-2026-openhouse.firebaseapp.com',
	projectId: 'rc4entre-2026-openhouse',
	storageBucket: 'rc4entre-2026-openhouse.firebasestorage.app',
	messagingSenderId: '550724302243',
	appId: '1:550724302243:web:426ae1219a5510ae919616'
};

export const leaderboardClientConfig = {
	sourceVersion: 'open-house-2026',
	mode: 'cloud' as const,
	appCheckSiteKey: '6LfoOoEsAAAAAHKtjWcWWrvLBejtKXIjZ5nHtQZD'
};
