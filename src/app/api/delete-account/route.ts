import { adminDb } from "@/lib/adminDb";

export async function POST(request: Request) {
  try {
    const { refreshToken } = (await request.json()) as { refreshToken?: string };
    if (!refreshToken) {
      return Response.json({ error: "Missing refresh token" }, { status: 400 });
    }

    const user = await adminDb.auth.verifyToken(refreshToken);
    if (!user) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    await adminDb.auth.deleteUser({ id: user.id });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Delete account error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to delete account" },
      { status: 500 }
    );
  }
}
