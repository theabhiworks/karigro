import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          message: "Only customers can leave reviews.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      requestId,
      rating,
      comment,
    } = body;

    const serviceRequestId = Number(requestId);
    const reviewRating = Number(rating);

    if (
      !Number.isInteger(serviceRequestId) ||
      serviceRequestId <= 0
    ) {
      return NextResponse.json(
        { message: "Invalid request ID." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(reviewRating) ||
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      return NextResponse.json(
        {
          message: "Rating must be between 1 and 5.",
        },
        { status: 400 }
      );
    }

    const serviceRequest =
      await db.serviceRequest.findUnique({
        where: {
          id: serviceRequestId,
        },
        include: {
          review: true,
        },
      });

    if (!serviceRequest) {
      return NextResponse.json(
        { message: "Service request not found." },
        { status: 404 }
      );
    }

    // Make sure this customer owns the request.
    if (serviceRequest.customerId !== session.userId) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to review this request.",
        },
        { status: 403 }
      );
    }

    // Only completed jobs can be reviewed.
    if (serviceRequest.status !== "COMPLETED") {
      return NextResponse.json(
        {
          message:
            "You can review a service only after it has been completed.",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate reviews.
    if (serviceRequest.review) {
      return NextResponse.json(
        {
          message:
            "You have already reviewed this service.",
        },
        { status: 400 }
      );
    }

    const cleanComment =
      typeof comment === "string"
        ? comment.trim()
        : "";

    if (cleanComment.length > 1000) {
      return NextResponse.json(
        {
          message:
            "Review must be 1000 characters or less.",
        },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        requestId: serviceRequest.id,
        customerId: session.userId,
        workerId: serviceRequest.workerId,
        rating: reviewRating,
        comment: cleanComment || null,
      },
    });

    // Recalculate the worker's rating from all reviews.
    const ratingResult = await db.review.aggregate({
      where: {
        workerId: serviceRequest.workerId,
      },
      _avg: {
        rating: true,
      },
    });

    const newRating = ratingResult._avg.rating ?? 0;

    await db.workerProfile.update({
      where: {
        id: serviceRequest.workerId,
      },
      data: {
        rating: Number(newRating.toFixed(1)),
      },
    });

    return NextResponse.json(
      {
        message: "Review submitted successfully.",
        review,
        rating: Number(newRating.toFixed(1)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create review error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while submitting the review.",
      },
      { status: 500 }
    );
  }
}