import isValidProp from './index';

describe('isValidProp', () => {
  test('should return true for valid built-in react properties', () => {
    expect(isValidProp('children')).toBe(true);
    expect(isValidProp('dangerouslySetInnerHTML')).toBe(true);
    expect(isValidProp('ref')).toBe(true);
  });
  test('should return true for valid built-in DOM attributes', () => {
    expect(isValidProp('disabled')).toBe(true);
    expect(isValidProp('id')).toBe(true);
    expect(isValidProp('onClick')).toBe(true);
    expect(isValidProp('aria-label')).toBe(true);
  });
  test('should return true for valid data-* attributes', () => {
    expect(isValidProp('data-test')).toBe(true);
    expect(isValidProp('data-job')).toBe(true);
    // @ts-expect-error
    expect(isValidProp('dataJob')).toBe(false);
  });
  test('should return false for any other property', () => {
    // @ts-expect-error
    expect(isValidProp('variant')).toBe(false);
    // @ts-expect-error
    expect(isValidProp('isShown')).toBe(false);
  });
});
