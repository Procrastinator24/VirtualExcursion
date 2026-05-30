import React, { useState } from 'react';
import { getImageUrl } from '@shared/lib/getImgUrl';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
                                                                      src,
                                                                      fallbackSrc = '/placeholder-image.jpg',
                                                                      alt = '',
                                                                      className = '',
                                                                      ...props
                                                                    }) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Обновляем src, если изменился исходный
  React.useEffect(() => {
    setImgSrc(getImageUrl(src));
    setError(false);
  }, [src]);

  return (
      <img
          src={imgSrc}
          alt={alt}
          className={className}
          onError={handleError}
          {...props}
      />
  );
};