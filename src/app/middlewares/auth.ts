import { NextResponse } from "next/server";

export function authMiddleware(req: Request) {
    // Middleware logic here
    const authenticated = true; 

    if (!authenticated) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}