import { describe, expect, it } from 'vitest';
import { shouldResetSceneBoard } from './sceneReset';

describe('shouldResetSceneBoard', () => {
  it('reinicia las escenas de capítulo normales', () => {
    expect(shouldResetSceneBoard('chapter1')).toBe(true);
    expect(shouldResetSceneBoard('chapter8')).toBe(true);
    expect(shouldResetSceneBoard('chapter9')).toBe(true);
  });

  it('conserva el estado en escenas con número y letra', () => {
    expect(shouldResetSceneBoard('chapter8b')).toBe(false);
  });
});
