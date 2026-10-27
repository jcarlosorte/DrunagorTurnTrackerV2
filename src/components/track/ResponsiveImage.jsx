import { IMAGE_SRCSET } from '@/assets/imageVariants';

/**
 * Imagen con `srcset` de variantes AVIF para miniaturas.
 *
 * Si la URL no tiene variantes (imágenes externas o guardados de un deploy
 * anterior) se renderiza como un `<img>` normal, sin `sizes`.
 */
export default function ResponsiveImage({ src, alt = '', sizes = '160px', ...rest }) {
  const srcSet = src ? IMAGE_SRCSET[src] : undefined;

  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      {...rest}
    />
  );
}
