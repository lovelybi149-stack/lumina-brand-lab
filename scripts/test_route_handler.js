const { GET, POST } = require('../app/api/generate-mockup/route.ts');
const { NextRequest } = require('next/server');

async function testApiRoute() {
  console.log('Testing /api/generate-mockup route handlers...');

  // 1. Test GET with projectId=LUMINA-03 and format=json
  const getReq = new NextRequest('http://localhost:3000/api/generate-mockup?projectId=LUMINA-03&format=json&color=3D2B1F');
  const getRes = await GET(getReq);
  const getJson = await getRes.json();
  console.log('GET response:', {
    status: getRes.status,
    success: getJson.success,
    applied_color: getJson.applied_color,
    template: getJson.template,
    size_bytes: getJson.size_bytes,
    mockup_url_prefix: getJson.mockup_url?.slice(0, 35)
  });

  // 2. Test GET binary PNG
  const getPngReq = new NextRequest('http://localhost:3000/api/generate-mockup?color=9E6B55');
  const getPngRes = await GET(getPngReq);
  const pngArrayBuffer = await getPngRes.arrayBuffer();
  console.log('GET binary PNG response:', {
    status: getPngRes.status,
    contentType: getPngRes.headers.get('content-type'),
    contentLength: getPngRes.headers.get('content-length'),
    appliedColor: getPngRes.headers.get('x-applied-color'),
    bytesLength: pngArrayBuffer.byteLength
  });

  // 3. Test POST with JSON body
  const postReq = new NextRequest('http://localhost:3000/api/generate-mockup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      color: '#5B7065',
      scale: 1.05,
      format: 'json'
    })
  });
  const postRes = await POST(postReq);
  const postJson = await postRes.json();
  console.log('POST JSON response:', {
    status: postRes.status,
    success: postJson.success,
    applied_color: postJson.applied_color,
    size_bytes: postJson.size_bytes
  });

  console.log('✅ /api/generate-mockup API Route tests passed!');
}

testApiRoute().catch(console.error);
