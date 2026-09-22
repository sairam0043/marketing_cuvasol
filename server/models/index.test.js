import test from 'node:test';
import assert from 'node:assert/strict';

import { User } from './index.js';

test('marketing users are isolated from the shared users collection', () => {
  assert.equal(User.collection.collectionName, 'marketing_agents');
});

test('a complete marketing account satisfies the user schema', () => {
  const user = new User({
    id: 'CU-TEST',
    email: 'agent@example.invalid',
    passwordHash: 'test-hash',
    name: 'Test Agent',
    referralCode: 'TESTAGENT-01'
  });

  assert.equal(user.validateSync(), undefined);
});
