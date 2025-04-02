import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();
    const validAccessKey = process.env.ACCESS_KEY;
    const isValid = accessKey === validAccessKey;

    const response = NextResponse.json(
      { valid: isValid },
      { status: isValid ? 200 : 401 }
    );

    if (isValid) {
      response.cookies.set({
        name: "access-key",
        value: accessKey,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "strict",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "An error occurred while validating the access key" },
      { status: 500 }
    );
  }
}
