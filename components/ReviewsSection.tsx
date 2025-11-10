"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Pencil, Trash2, User } from "lucide-react";
import { Review } from "@/types";
import { getUser, AuthUser } from "@/lib/auth/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReviewsSection({
  productSlug,
}: {
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  const fetchCurrentUser = async () => {
    const user = await getUser();
    setCurrentUser(user);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/products/${productSlug}/reviews?limit=10&page=1`
      );
      const data = await res.json();
      const fetchedReviews = data.reviews || [];
      setReviews(fetchedReviews);

      // Check if current user has already reviewed this product
      if (currentUser) {
        const existingReview = fetchedReviews.find(
          (review: Review) => review.user_id === currentUser.id
        );
        setUserReview(existingReview || null);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Check if user already has a review
    if (userReview && !editingReviewId) {
      toast({
        title: "Already reviewed",
        description:
          "You already reviewed this product. You can edit your existing review instead.",
        variant: "destructive",
      });
      return;
    }

    if (!rating || !comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a rating and a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        throw new Error("Failed to post review");
      }

      const newReview = await res.json();
      setRating(0);
      setComment("");
      setEditingReviewId(null);

      // Update userReview state immediately
      if (currentUser && newReview) {
        setUserReview(newReview);
      }

      fetchReviews();

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your feedback.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDelete = async (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await fetch(`/api/reviews/${reviewToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");

      // Clear userReview state if user deleted their own review
      if (reviewToDelete === userReview?.id) {
        setUserReview(null);
      }

      fetchReviews();
      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingReviewId) return;
    if (!rating || !comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a rating and a comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/reviews/${editingReviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Failed to update review");

      setEditingReviewId(null);
      setRating(0);
      setComment("");
      fetchReviews();

      toast({
        title: "Review updated!",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setRating(0);
    setComment("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Customer Reviews
            </CardTitle>
            {reviews.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* User avatar */}
                      <div className="flex-shrink-0">
                        {r.profiles?.avatar_url ? (
                          <img
                            src={r.profiles.avatar_url}
                            alt={r.profiles?.full_name || "User"}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center ring-2 ring-border">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {r.profiles?.full_name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < r.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Edit/Delete buttons only for review owner */}
                          {currentUser?.id === r.user_id && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(r)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(r.id)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {r.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!currentUser ? (
              <div className="text-center py-6 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground mb-3">
                  Please log in to post a review.
                </p>
                <Button
                  variant="default"
                  onClick={() => (window.location.href = "/login")} // or your login route
                >
                  Login
                </Button>
              </div>
            ) : (
              <div className="border-t border-border pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {editingReviewId ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  {userReview && !editingReviewId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(userReview)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Your Review
                    </Button>
                  )}
                </div>

                {userReview && !editingReviewId ? (
                  <div className="text-center py-6 bg-muted/50 rounded-lg border border-border">
                    <p className="text-muted-foreground mb-3">
                      You`&apos;`ve already reviewed this product
                    </p>
                    <Button
                      variant="default"
                      onClick={() => handleEdit(userReview)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Your Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-8 w-8 cursor-pointer transition-all hover:scale-110 ${
                              i < rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground/30 hover:text-yellow-500/50"
                            }`}
                            onClick={() => setRating(i + 1)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Review
                      </label>
                      <Textarea
                        placeholder="Share your experience with this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      {editingReviewId ? (
                        <>
                          <Button onClick={handleUpdate} disabled={submitting}>
                            {submitting ? "Updating..." : "Update Review"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleSubmit} disabled={submitting}>
                          {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
