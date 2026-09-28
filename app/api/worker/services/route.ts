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

    if (session.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can access services." },
        { status: 403 }
      );
    }

    const workerProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
      include: {
        services: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: "Worker profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        services: workerProfile.services,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get worker services error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while loading services.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can add services." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      price,
    } = body;

    // Validate service name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { message: "Service name is required." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        {
          message:
            "Service name must be between 2 and 100 characters.",
        },
        { status: 400 }
      );
    }

    // Validate description
    let trimmedDescription: string | null = null;

    if (
      description !== undefined &&
      description !== null &&
      description !== ""
    ) {
      if (typeof description !== "string") {
        return NextResponse.json(
          { message: "Invalid service description." },
          { status: 400 }
        );
      }

      trimmedDescription = description.trim();

      if (trimmedDescription.length > 300) {
        return NextResponse.json(
          {
            message:
              "Service description cannot exceed 300 characters.",
          },
          { status: 400 }
        );
      }
    }

    // Validate price
    let priceNumber: number | null = null;

    if (
      price !== undefined &&
      price !== null &&
      price !== ""
    ) {
      priceNumber = Number(price);

      if (Number.isNaN(priceNumber) || priceNumber < 0) {
        return NextResponse.json(
          { message: "Please enter a valid price." },
          { status: 400 }
        );
      }
    }

    // Find worker profile
    const workerProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        {
          message:
            "Please complete your professional profile first.",
        },
        { status: 404 }
      );
    }

    // Prevent duplicate service names for this worker
    const existingService = await db.workerService.findFirst({
      where: {
        workerId: workerProfile.id,
        name: {
          equals: trimmedName,
          mode: "insensitive",
        },
      },
    });

    if (existingService) {
      return NextResponse.json(
        {
          message:
            "You have already added this service.",
        },
        { status: 409 }
      );
    }

    // Create service
    const service = await db.workerService.create({
      data: {
        workerId: workerProfile.id,
        name: trimmedName,
        description: trimmedDescription,
        price: priceNumber,
      },
    });

    return NextResponse.json(
      {
        message: "Service added successfully.",
        service,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create worker service error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while adding the service.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can delete services." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const serviceId = Number(searchParams.get("id"));

    if (!serviceId || Number.isNaN(serviceId)) {
      return NextResponse.json(
        { message: "A valid service ID is required." },
        { status: 400 }
      );
    }

    // Find the worker profile
    const workerProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: "Worker profile not found." },
        { status: 404 }
      );
    }

    // Make sure this service belongs to the logged-in worker
    const service = await db.workerService.findFirst({
      where: {
        id: serviceId,
        workerId: workerProfile.id,
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: "Service not found." },
        { status: 404 }
      );
    }

    await db.workerService.delete({
      where: {
        id: serviceId,
      },
    });

    return NextResponse.json(
      {
        message: "Service deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete worker service error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while deleting the service.",
      },
      { status: 500 }
    );
  }
}