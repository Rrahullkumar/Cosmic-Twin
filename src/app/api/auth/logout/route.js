import { clearSessionCookie } from '@/lib/session';

export async function POST(request) {
  try {
    const response = Response.json({ success: true, message: 'Logged out successfully' });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
