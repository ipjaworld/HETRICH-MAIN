import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString('base64');
const deliveryURL = moduleURL(readFileSync(new URL('../lib/contact-delivery.ts', import.meta.url), 'utf8'));
const routeURL = moduleURL(readFileSync(new URL('../app/api/contact/route.ts', import.meta.url), 'utf8').replace('"zod"', JSON.stringify(pathToFileURL(require.resolve('zod')).href)).replace('"@/lib/contact-delivery"', JSON.stringify(deliveryURL)));
const { POST } = await import(routeURL);
const { isContactConfigured } = await import(deliveryURL);
const keys = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_WEBHOOK_URL', 'CONTACT_WEBHOOK_BEARER_TOKEN'];
const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
let calls = [];
beforeEach(() => {
  for (const key of keys) delete process.env[key];
  calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json({ id: 'test-id' }); };
});
after(() => { globalThis.fetch = originalFetch; for (const key of keys) { if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key]; } });
const message = { type: 'Collaboration', name: '테스트', email: 'visitor@example.com', organization: '테스트 조직', message: '웹 서비스 문의 폼의 전송 동작을 확인하는 테스트입니다.', website: '' };
const request = (body = message, headers = {}) => new Request('https://hetrich.com/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://hetrich.com', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const configure = () => { process.env.RESEND_API_KEY = 'test-only-key'; process.env.CONTACT_FROM_EMAIL = 'HETRICH <contact@example.com>'; };

test('unconfigured/blank configuration does not falsely accept an inquiry', async () => {
  process.env.CONTACT_WEBHOOK_URL = '  ';
  assert.equal(isContactConfigured(), false);
  assert.equal((await POST(request())).status, 503);
  assert.equal(calls.length, 0);
});
test('invalid fields, malformed JSON and wrong content type are rejected before sending', async () => {
  configure();
  for (const body of [{ ...message, email: 'bad' }, { ...message, name: ' ' }, { ...message, message: '짧음' }, { ...message, type: 'unknown' }, '{']) assert.equal((await POST(request(body))).status, 400);
  assert.equal((await POST(request(message, { 'content-type': 'text/plain' }))).status, 415);
  assert.equal(calls.length, 0);
});
test('cross-site submissions and oversized bodies are rejected', async () => {
  configure();
  assert.equal((await POST(request(message, { origin: 'https://other.example' }))).status, 403);
  assert.equal((await POST(request('x'.repeat(24001)))).status, 413);
  assert.equal((await POST(request(message, { 'content-length': '24001' }))).status, 413);
  assert.equal(calls.length, 0);
});
test('honeypot silently discards bot submissions without sending mail', async () => {
  configure();
  assert.equal((await POST(request({ ...message, website: 'https://spam.example' }))).status, 200);
  assert.equal(calls.length, 0);
});
test('Resend delivers to the fixed owner address and sets visitor as Reply-To', async () => {
  configure();
  assert.equal((await POST(request({ ...message, to: 'attacker@example.com' }))).status, 201);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  const payload = JSON.parse(calls[0].options.body);
  assert.deepEqual(payload.to, ['this_is_laugh@naver.com']);
  assert.equal(payload.reply_to, message.email);
  assert.equal(payload.subject, '[HETRICH] 개발 의뢰·협업');
  assert.ok(payload.text.includes(message.message));
  assert.ok(calls[0].options.signal instanceof AbortSignal);
});
test('legacy webhook remains compatible and does not receive honeypot data', async () => {
  process.env.CONTACT_WEBHOOK_URL = 'https://webhook.example/contact';
  process.env.CONTACT_WEBHOOK_BEARER_TOKEN = 'test-only-token';
  assert.equal((await POST(request())).status, 201);
  const payload = JSON.parse(calls[0].options.body);
  assert.equal(payload.source, 'hetrich-contact');
  assert.equal(payload.website, undefined);
  assert.equal(calls[0].options.headers.authorization, 'Bearer test-only-token');
});
test('provider errors, missing delivery id and timeouts never report success', async () => {
  configure();
  for (const implementation of [async () => Response.json({ error: 'secret provider details' }, { status: 403 }), async () => Response.json({}), async () => { throw new Error('test timeout'); }]) {
    globalThis.fetch = implementation;
    const result = await POST(request());
    assert.equal(result.status, 502);
    assert.equal((await result.text()).includes('secret provider details'), false);
  }
});
test('the full 4000-character Korean message fits the byte limit', async () => {
  configure();
  assert.equal((await POST(request({ ...message, message: '한'.repeat(4000) }))).status, 201);
});

test('same-host requests work behind Next.js URL normalization and malformed origins fail', async () => {
  configure();
  const req = new Request('http://localhost:3103/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', host: '127.0.0.1:3103', origin: 'http://127.0.0.1:3103' }, body: JSON.stringify(message) });
  assert.equal((await POST(req)).status, 201);
  assert.equal((await POST(request(message, { origin: 'null' }))).status, 403);
});
