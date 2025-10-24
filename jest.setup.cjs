require('@testing-library/jest-dom');

// Polyfill Web Response/Request for Next.js server web APIs used in NextResponse
const { Request, Response, Headers } = require('node-fetch');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Provide a static Response.json helper used by NextResponse.json
if (typeof Response.json !== 'function') {
  Response.json = function (body, init = {}) {
    const headers = Object.assign({'content-type': 'application/json'}, init.headers || {});
    return new Response(JSON.stringify(body), Object.assign({}, init, { headers }));
  };
}

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Rely on manual mock in __mocks__/lib/supabase/server.js
// Ensure the mocked module is used when importing via '@/lib/supabase/server'
jest.doMock('@/lib/supabase/server', () => require('./__mocks__/lib/supabase/server.js'));
