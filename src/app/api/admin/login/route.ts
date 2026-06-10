import { NextResponse } from "next/server";

// POST /api/admin/login - Verify credentials on the server
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Retrieve from server environment variables (never exposed to client browser)
    // Fallback defaults for local development if not set in env file
    const expectedUsername = process.env.ADMIN_USERNAME || "sauravvaghela22@gmail.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "Sauravkuchu@1903";

    if (username === expectedUsername && password === expectedPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid login payload." },
      { status: 400 }
    );
  }
}
