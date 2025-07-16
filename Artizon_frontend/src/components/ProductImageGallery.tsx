import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
}

export const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden">
        <img 
          src={images[selectedImage]} 
          alt="Product"
          className={`w-full max-h-[500px] object-contain bg-white cursor-zoom-in transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={{ objectFit: 'contain' }}
          onClick={handleImageClick}
        />
        <Button
          size="icon"
          variant="outline"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
          onClick={handleImageClick}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setIsZoomed(false);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index 
                  ? 'border-[#405B35]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={image} 
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-contain bg-white"
                style={{ objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
