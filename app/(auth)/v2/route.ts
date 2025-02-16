import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Replace with your Keycloak details
const KEYCLOAK_REALM = 'k3sphere';
const KEYCLOAK_CLIENT_ID = 'docker-registry'; // Use your client ID
const KEYCLOAK_BASE_URL = 'https://auth.k3sphere.com';
const KEYCLOAK_AUTH_URL = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;
const JWKS_URL = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`;

// Setup JWKS client for Keycloak
const client = jwksClient({ jwksUri: JWKS_URL });

async function verifyToken(token: string): Promise<NextResponse> {
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    return NextResponse.json({
      message: 'Welcome to the private Docker Registry!',
      user: decoded,
    });
  } catch {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export async function GET(req: NextRequest) {
  let authHeader = req.headers.get('Authorization') || req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Redirect to Keycloak for authentication
    const redirectUrl = `${KEYCLOAK_AUTH_URL}?client_id=${KEYCLOAK_CLIENT_ID}&response_type=token`;
    return NextResponse.redirect(redirectUrl);
  }

  const token = authHeader.split(' ')[1];

  return await verifyToken(token);
}
