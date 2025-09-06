import { serialize, parse } from 'cookie';

export function setSessionCookie(response, userId) {
  const cookie = serialize('session', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  response.headers.set('Set-Cookie', cookie);
}

export function getSessionCookie(request) {
  const cookies = parse(request.headers.get('cookie') || '');
  return cookies.session;
}

export function clearSessionCookie(response) {
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.headers.set('Set-Cookie', cookie);
}
