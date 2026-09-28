import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while loading notifications.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    await db.notification.updateMany({
      where: {
        userId: session.userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
      message: "Notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark notifications read error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}