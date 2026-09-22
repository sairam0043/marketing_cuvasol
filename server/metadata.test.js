import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('social sharing metadata describes the tutor referral program', () => {
  assert.match(html, /property="og:title" content="Cuvasol Tutor Referral Program/);
  assert.match(html, /property="og:description" content="Refer students/);
  assert.match(html, /property="og:image" content="https:\/\/marketing\.cuvasol\.com\/CuvaLogo-1024\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\/marketing\.cuvasol\.com\/"/);
});

test('obsolete solar and cleantech preview copy is absent', () => {
  assert.doesNotMatch(html, /solar|cleantech/i);
});
