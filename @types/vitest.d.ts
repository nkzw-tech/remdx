/* eslint-disable @typescript-eslint/no-empty-object-type */

interface CustomMatchers<R = unknown> {
  toMatchImageSnapshot(): R;
}

declare namespace Vi {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
