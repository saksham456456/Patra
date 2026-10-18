import { NextResponse } from "next/server";
export const runtime = "nodejs";
export function GET() { return NextResponse.json({ ok: true, version: "0.1.0" }, { headers: { "Cache-Control": "no-store" } }); }
