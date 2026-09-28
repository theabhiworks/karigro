import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(request: Request) {
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
        { message: "Only customers can update their profile." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Name cannot be empty." },
        { status: 400 }
      );
    }

    // Update only the name.
    // Email is left unchanged.
    const user = await db.user.update({
      where: {
        id: session.userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("CUSTOMER PROFILE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to update profile.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}