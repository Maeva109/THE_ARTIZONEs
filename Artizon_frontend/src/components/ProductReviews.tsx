import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  rating: number;
  text: string;
  author: string;
  date: string;
  photo?: string | null;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  productId: number;
  onReviewAdded: () => void;
}

export const ProductReviews = ({ reviews, averageRating, totalReviews, productId, onReviewAdded }: ProductReviewsProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/api/reviews/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productId,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        setError('Erreur lors de l\'envoi de l\'avis.');
      } else {
        setSuccess('Merci pour votre avis !');
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-[#405B35]">Avis et évaluations</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600">({totalReviews} avis)</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white"
          >
            Écrire un avis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="font-semibold">Note:</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Votre avis..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#405B35] text-white px-4 py-2 rounded hover:bg-[#2e4025]"
            disabled={submitting}
          >
            {submitting ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
        {reviews.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-yellow-500 text-lg">
              {'★'.repeat(Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length))}
              {'☆'.repeat(5 - Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length))}
            </span>
            <span className="text-gray-700 font-semibold">
              {reviews.length} avis, moyenne {(
                reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
              ).toFixed(1)} / 5
            </span>
          </div>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start gap-4">
              {review.photo && (
                <img 
                  src={review.photo} 
                  alt="Product review"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className="font-semibold text-gray-800">{review.author}</span>
                  <span className="text-gray-500 text-sm">
                    {formatDate(review.date)}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {totalReviews > reviews.length && (
          <div className="text-center pt-4">
            <Button 
              variant="outline"
              className="border-[#405B35] text-[#405B35] hover:bg-[#405B35] hover:text-white"
            >
              Voir tous les avis ({totalReviews})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
