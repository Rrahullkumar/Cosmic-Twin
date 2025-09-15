import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function verifyToken(req) {
  // Try different cookie name variations
  const cookieNames = ['auth-token', 'auth_token', 'token'];
  
  for (const name of cookieNames) {
    const token = req.cookies.get(name)?.value;
    if (token) {
      try {
        return { token, decoded: jwt.verify(token, process.env.JWT_SECRET), cookieName: name };
      } catch (err) {
        // console.log(`Invalid token for ${name}:`, err.message);
      }
    }
  }
  
  throw new Error('No valid token found');
}

export async function POST(req) {
  let actualCookieName = 'auth-token'; // default
  
  try {
    // Try to verify token to get the actual cookie name
    const { decoded, cookieName } = await verifyToken(req);
    actualCookieName = cookieName;
    
    // Optional: Database cleanup here
    // await db.query('UPDATE users SET jwt_token = NULL WHERE id = $1', [decoded.id]);
    
  } catch (error) {
    // console.log(' Token verification failed:', error.message);
    // Continue anyway to clear cookies
  }

  // Create response
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
  
  // Aggressively clear all possible cookie variations
  const allCookieNames = ['auth-token', 'auth_token', 'token', 'authToken', 'sessionToken'];
  
  allCookieNames.forEach(cookieName => {
    // Try multiple clearing strategies
    const clearingStrategies = [
      { httpOnly: true, path: '/', maxAge: 0 },
      { httpOnly: true, path: '/', expires: new Date(0) },
      { path: '/', maxAge: 0 },
      { path: '/', expires: new Date(0) }
    ];
    
    clearingStrategies.forEach(strategy => {
      response.cookies.set(cookieName, '', strategy);
    });
  });

  return response;
}
