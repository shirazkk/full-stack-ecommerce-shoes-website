import { NextRequest, NextResponse } from "next/server";
import { deleteFile, uploadProductImage } from "@/lib/storage/upload";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const imageIndex = Number(formData.get("imageIndex") || 0);

    if (!file || !productId) {
      return NextResponse.json(
        { error: "Missing file or productId" },
        { status: 400 }
      );
    }

    const uploaded = await uploadProductImage(file, productId, imageIndex);

    return NextResponse.json(uploaded);
  } catch (err: any) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// For Next.js App Router API route
export const PUT = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const productId = formData.get("productId") as string;
    const imageIndexStr = formData.get("imageIndex") as string;
    const imageIndex = parseInt(imageIndexStr || "0");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Upload the image using server-side helper
    const result = await uploadProductImage(file, productId, imageIndex);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
};


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bucket = searchParams.get("bucket");
    const path = searchParams.get("path");

    if (!bucket) {
      return NextResponse.json({ error: "Bucket name is required" }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
    }

    await deleteFile(bucket, path);

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Image Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




