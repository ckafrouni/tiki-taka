import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();
    
    // Get the access key from environment variables
    const validAccessKey = process.env.ACCESS_KEY;
    
    // Check if the provided access key matches the valid one
    const isValid = accessKey === validAccessKey;
    
    const response = NextResponse.json({ valid: isValid }, { status: isValid ? 200 : 401 });
    
    if (isValid) {
      // Set the cookie if the access key is valid
      response.cookies.set({
        name: 'access-key',
        value: accessKey,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict'
      });
    }
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while validating the access key' },
      { status: 500 }
    );
  }
}
