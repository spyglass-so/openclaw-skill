import { test } from "node:test";
import assert from "node:assert/strict";
const key = "test-key";
test('OpenClaw script bounds requests and keeps credentials on the fixed origin', async () => {
  const { search } = await import('../scripts/search.mjs');
  let calls = 0;
  const options = { apiKey:key, fetch:async (url, init) => {
    calls++;
    assert.equal(url,'https://api.spyglass.so/v2/media');
    assert.equal(init.redirect,'error');
    assert.equal(JSON.parse(String(init.body)).limit,10);
    return Response.json({media:[]});
  }};
  await assert.rejects(() => search('../team',{},options));
  await assert.rejects(() => search('media',{limit:101},options));
  assert.equal(calls,0);
  assert.deepEqual(await search('media',{query:'shoes'},options),{media:[]});
  assert.equal(calls,1);
});
