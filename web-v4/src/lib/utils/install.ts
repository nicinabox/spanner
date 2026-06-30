export const isIOS = () => {
	if (typeof navigator === 'undefined') return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
};
