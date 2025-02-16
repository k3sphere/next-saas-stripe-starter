import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Replace with your Keycloak Realm details
const KEYCLOAK_REALM = 'k3sphere';
const KEYCLOAK_URL = `https://auth.k3sphere.com/auth/realms/${KEYCLOAK_REALM}`;
const JWKS_URL = `${KEYCLOAK_URL}/protocol/openid-connect/certs`;

// Setup JWKS client for Keycloak
const client = jwksClient({ jwksUri: JWKS_URL });

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
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Return a 401 Unauthorized with a Docker-compatible challenge
        return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': `Bearer realm="${KEYCLOAK_URL}", service="k3sphere-docker-registry"`,
            },
        });
    }

    const token = authHeader.split(' ')[1];

    return new Promise((resolve) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                resolve(new NextResponse('Forbidden', { status: 403 }));
                return;
            }

            resolve(
                NextResponse.json({
                    message: 'Welcome to the private Docker Registry!',
                    user: decoded,
                })
            );
        });
    });
}
