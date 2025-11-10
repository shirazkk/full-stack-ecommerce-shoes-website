import { Review } from "@/types";
import { supabaseAdmin } from "../supabase/supabaseAdmin";
import { getUser } from "../auth/server";



export class ReviewService {
  // ✅ Get all reviews for a product (with pagination)
  static async getReviews(productId: string, limit = 10, page = 1): Promise<Review[]> {
    const supabase = await supabaseAdmin();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("reviews")
      .select(`*, profiles(full_name, avatar_url)`)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return data as Review[];
  }

  // ✅ Post a new review
  static async addReview(productId: string, rating: number, comment: string) {
    const supabase = await supabaseAdmin();

    const user = await getUser();

    if (!user) throw new Error("You must be logged in to post a review");

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

    if (error) throw new Error(error.message);
    return true;
  }

  // ✅ Update an existing review (by same user)
  static async updateReview(reviewId: string, rating: number, comment: string) {
    const supabase = await supabaseAdmin();

    const user = await getUser();

    if (!user) throw new Error("You must be logged in");

    const { error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return true;
  }

  static async deleteReview(reviewId: string) {
    const supabase = await supabaseAdmin();
    const user = await getUser();

    if (!user) throw new Error("You must be logged in");

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return true;
  }
}



