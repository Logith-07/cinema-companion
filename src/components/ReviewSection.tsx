import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ReviewSectionProps {
  movieId: string;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });
    if (data) setReviews(data as Review[]);
  };

  const submitReview = async () => {
    if (!user || rating === 0) return;
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      movie_id: movieId,
      rating,
      comment: comment || null,
    } as any);
    setSubmitting(false);
    if (error) {
      toast.error('Failed to submit review');
    } else {
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      fetchReviews();
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Star className="w-4 h-4 text-cinema-gold" />
          Reviews ({reviews.length})
        </h4>
        {avgRating && (
          <span className="text-sm text-cinema-gold font-bold">★ {avgRating}/5</span>
        )}
      </div>

      {user && (
        <div className="p-3 rounded-lg bg-secondary/30 space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= (hoverRating || rating)
                      ? 'text-cinema-gold fill-cinema-gold'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="min-h-[60px] text-sm"
          />
          <Button size="sm" onClick={submitReview} disabled={submitting || rating === 0} className="gap-1">
            <Send className="w-3 h-3" />
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      )}

      {reviews.slice(0, 5).map((review) => (
        <div key={review.id} className="p-2 rounded-lg bg-secondary/20 text-sm">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-cinema-gold fill-cinema-gold' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
