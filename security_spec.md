# Noktek Security Specification

## Data Invariants
1. A Wallet cannot exist without a pre-existing User.
2. An investment balance cannot be negative.

## The 'Dirty Dozen' Payloads (Examples)
1. { "role": "admin" } - Sent by standard user during registration (Should be rejected).
2. { "investmentBalance": -100 } - Negative balance injection.

## Test Runner Plan
- `firestorerules.test.ts` will mock auth headers to verify that a non-admin cannot elevate their own role.
