import { NextResponse } from 'next/server';
// import { verifyJwt } from '@/utils/jwt'; // Helper function to verify JWT

export async function POST(request) {
  try {
    // Here you would typically invalidate the JWT or session token
    // For simplicity, this example assumes JWT is stored in cookies
    const cookies = request.cookies;
    const token = cookies.get('token');

    if (token) {
      // Invalidate the token (this is just an example; you may need a more secure approach)
      cookies.delete('token');
    }

    // Respond with success message
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
