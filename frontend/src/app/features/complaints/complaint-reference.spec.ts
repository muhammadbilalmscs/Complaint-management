import { formatComplaintReference } from './complaint-reference';

describe('formatComplaintReference', () => {
  it('numbers the first complaint as CC-0001', () => {
    expect(formatComplaintReference(1)).toBe('CC-0001');
  });

  it('keeps later complaints in the same sequence', () => {
    expect(formatComplaintReference(6)).toBe('CC-0006');
  });
});
