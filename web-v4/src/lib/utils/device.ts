const MOBILE_PATTERN =
	/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini|palm|symbian|webos/i;

export const isMobileUserAgent = (ua: string): boolean => MOBILE_PATTERN.test(ua);
