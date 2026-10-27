/**
 * Identificador único para fichas, cartas y avisos.
 *
 * Usa `crypto.randomUUID()` (navegadores modernos y Node 19+) con una
 * alternativa sencilla para contextos sin criptografía.
 */
export function createId() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  const random = () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  return `${random()}-${random()}-${random()}-${random()}`;
}

export default createId;
