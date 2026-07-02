// Proxy every /api/* request from the browser to the backend service.
//
// The backend URL comes from the BACKEND_API_URL environment variable and is
// read HERE, server-side, at request time. That means it can be set on the
// Deployment at runtime (no rebuild needed) — exactly how OpenShift wires
// the two services together.
const BACKEND = () => process.env.BACKEND_API_URL || 'http://localhost:4000';

async function proxy(request, { params }) {
  const { path } = await params;
  const url = `${BACKEND()}/api/${path.join('/')}`;

  const headers = { 'content-type': 'application/json' };
  const auth = request.headers.get('authorization');
  if (auth) headers.authorization = auth;

  const init = { method: request.method, headers, cache: 'no-store' };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  try {
    const res = await fetch(url, init);
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'content-type': 'application/json' },
    });
  } catch {
    return Response.json(
      { error: `Backend unreachable at ${BACKEND()}` },
      { status: 502 }
    );
  }
}

export { proxy as GET, proxy as POST };
export const dynamic = 'force-dynamic';
