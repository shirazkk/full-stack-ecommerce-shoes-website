"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Product, Review } from "@/types";

export default function ReviewsSection({
  peoductSlug,
}: {
  peoductSlug: Product;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/products/${peoductSlug}/reviews?limit=10&page=1`
    );
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!rating || !comment) return alert("Please provide rating and comment");
    const res = await fetch(`/api/products/${peoductSlug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    if (!res.ok) return alert("Failed to post review");
    setRating(0);
    setComment("");
    fetchReviews();
  };

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="space-y-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to write one!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-b pb-4">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mt-1">{r.comment}</p>
                  <p className="text-sm text-gray-500">
                    — {r.profiles?.full_name || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Write a Review</h3>
            <div className="flex space-x-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 cursor-pointer ${
                    i < rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3"
            />
            <Button onClick={handleSubmit}>Submit Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
