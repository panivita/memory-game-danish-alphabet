export const getStorageValue = (key: string) => {
	const saved = localStorage.getItem(key);
	const initial = saved !== null && JSON.parse(saved);
	return initial;
};
