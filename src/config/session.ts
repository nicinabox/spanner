if (!process.env.CLIENT_SECRET) {
    throw new Error('CLIENT_SECRET not set');
}

export const sessionOptions = {
    password: process.env.CLIENT_SECRET,
    cookieName: 'session',
    ttl: 5184000, // 60 days
    cookieOptions: {
        secure: process.env.USE_SECURE_COOKIE === 'true',
    },
};
