const assert = require('node:assert/strict');
const { test } = require('node:test');

const base = process.env.API_URL || 'http://localhost:3001/tasks';

async function request(path = '', method = 'GET', body, headers = {}) {
  const response = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = response.status === 204 ? null : await response.json();
  return { response, data };
}

test('legacy list and validated cursor pages coexist', async () => {
  const ids = [];
  const title = 'contract-' + crypto.randomUUID();
  try {
    for (const day of [1, 2, 3]) {
      const { data } = await request('', 'POST', { title, dueDate: `2030-01-0${day}` });
      ids.push(data.id);
    }
    assert.ok(Array.isArray((await request()).data));
    const query = '?search=' + title + '&status=TODO&sort=dueDate&direction=asc&limit=2';
    const first = await request(query);
    assert.equal(first.response.status, 200);
    assert.equal(first.data.total, 3);
    assert.deepEqual(first.data.items.map(task => task.id), ids.slice(0, 2));
    const next = await request(query + '&cursor=' + first.data.nextCursor);
    assert.deepEqual(next.data.items.map(task => task.id), ids.slice(2));
    assert.equal(next.data.nextCursor, null);
    for (const invalid of ['limit=0', 'status=NOPE', 'sort=title', 'unknown=1', 'cursor=broken']) {
      const result = await request('?' + invalid);
      assert.equal(result.response.status, 400);
      assert.match(result.response.headers.get('content-type'), /application\/problem\+json/);
      assert.ok(result.data.requestId);
    }
  } finally {
    for (const id of ids) await request('/' + id, 'DELETE');
  }
});

test('conditional writes detect stale edits and deleted tasks can be restored', async () => {
  const created = await request('', 'POST', { title: 'Temporary concurrency test' });
  assert.equal(created.response.status, 201);
  const path = '/' + created.data.id;
  try {
    const read = await request(path);
    const etag = read.response.headers.get('etag');
    assert.match(etag, /^"\d+"$/);
    const updated = await request(path, 'PATCH', { title: 'Updated title' }, { 'If-Match': etag });
    assert.equal(updated.response.status, 200);
    assert.equal((await request(path, 'PATCH', { title: 'Stale' }, { 'If-Match': etag })).response.status, 412);
    assert.equal((await request(path, 'DELETE')).response.status, 204);
    assert.equal((await request(path)).response.status, 404);
    const restored = await request(path + '/restore', 'POST');
    assert.equal(restored.response.status, 200);
    assert.equal(restored.data.title, 'Updated title');
  } finally {
    await request(path, 'DELETE');
  }
});
