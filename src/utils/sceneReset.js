/** Las escenas con letra (p. ej. `chapter8b`) conservan el estado previo. */
export function shouldResetSceneBoard(sceneId) {
  return !/\d[a-z]/i.test(String(sceneId || ''));
}
