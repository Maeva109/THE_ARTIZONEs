
import { Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SocialShareProps {
  productName: string;
  productUrl?: string;
}

export const SocialShare = ({ productName, productUrl }: SocialShareProps) => {
  const currentUrl = productUrl || window.location.href;
  const shareText = `Découvrez ce magnifique produit artisanal: ${productName}`;

  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: productName,
            text: shareText,
            url: currentUrl,
          });
          return;
        }
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Partager ce produit
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('native')}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
