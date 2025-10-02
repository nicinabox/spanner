import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getIronSession } from 'iron-session/edge';
import { sessionOptions } from 'config/session';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const session = await getIronSession(req, res, sessionOptions);

    await session.save();
    return res;
}
