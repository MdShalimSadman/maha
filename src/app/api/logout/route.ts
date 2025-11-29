import { NextResponse } from 'next/server';

const COOKIE_NAME = 'session-token'; 
const MAX_AGE = 0; 

export async function POST() {
  const response = new NextResponse(JSON.stringify({ status: 'success', message: 'Logged out' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE_NAME}=deleted; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    },
  });

  return response;
}