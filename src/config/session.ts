if (!process.env.CLIENT_SECRET) {
    throw new Error('CLIENT_SECRET not set');
}

const secureCookie = JSON.parse(
    process.env.USE_SECURE_COOKIE ??
        String(process.env.NODE_ENV === 'production'),
);

export const sessionOptions = {
    password: process.env.CLIENT_SECRET,
    cookieName: 'session',
    ttl: 5_184_000, // 60 days
    cookieOptions: {
        secure: secureCookie,
    },
};
