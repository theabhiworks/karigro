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

    // CUSTOMER REQUESTS
    if (session.role === "CUSTOMER") {
      const requests = await db.serviceRequest.findMany({
        where: {
          customerId: session.userId,
        },
        include: {
          worker: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ requests }, { status: 200 });
    }

    // WORKER REQUESTS
    if (session.role === "WORKER") {
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

      const requests = await db.serviceRequest.findMany({
        where: {
          workerId: workerProfile.id,
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ requests }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Invalid user role." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Get requests error:", error);

    return NextResponse.json(
      { message: "Something went wrong while loading requests." },
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

    if (session.role !== "CUSTOMER") {
      return NextResponse.json(
        { message: "Only customers can create service requests." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      workerId,
      description,
      address,
      city,
      budget,
      priority,
      customerNote,
    } = body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!workerId) {
      return NextResponse.json(
        { message: "Worker is required." },
        { status: 400 }
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        { message: "Please describe the work you need." },
        { status: 400 }
      );
    }

    if (
      !address ||
      typeof address !== "string" ||
      !address.trim()
    ) {
      return NextResponse.json(
        { message: "Address is required." },
        { status: 400 }
      );
    }

    if (
      !city ||
      typeof city !== "string" ||
      !city.trim()
    ) {
      return NextResponse.json(
        { message: "City is required." },
        { status: 400 }
      );
    }

    // -----------------------------
    // Find worker
    // -----------------------------

    const workerProfile = await db.workerProfile.findUnique({
      where: {
        id: Number(workerId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        services: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        { message: "Worker not found." },
        { status: 404 }
      );
    }

    if (workerProfile.userId === session.userId) {
      return NextResponse.json(
        { message: "You cannot request your own service." },
        { status: 400 }
      );
    }

    // -----------------------------
    // Automatically determine service
    // -----------------------------

    const resolvedServiceName =
      workerProfile.services[0]?.name || workerProfile.profession;

    // -----------------------------
    // Budget
    // -----------------------------

    let budgetNumber: number | null = null;

    if (
      budget !== undefined &&
      budget !== null &&
      budget !== ""
    ) {
      budgetNumber = Number(budget);

      if (
        Number.isNaN(budgetNumber) ||
        budgetNumber < 0
      ) {
        return NextResponse.json(
          { message: "Please enter a valid budget." },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // Priority
    // -----------------------------

    const requestPriority =
      priority === "URGENT" ? "URGENT" : "NORMAL";

    // -----------------------------
    // 30-minute arrival target
    // -----------------------------

    const arrivalTarget = new Date(
      Date.now() + 30 * 60 * 1000
    );

    // -----------------------------
    // Create request
    // -----------------------------

    const serviceRequest = await db.serviceRequest.create({
      data: {
        customerId: session.userId,
        workerId: workerProfile.id,

        serviceName: resolvedServiceName,
        description: description.trim(),

        address: address.trim(),
        city: city.trim(),

        preferredDate: null,
        preferredTime: null,
        arrivalTarget,

        budget: budgetNumber,

        priority: requestPriority,
        status: "PENDING",

        customerNote:
          customerNote?.trim() || null,
      },

      include: {
        worker: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // -----------------------------
    // Notify worker
    // -----------------------------

    await db.notification.create({
      data: {
        userId: workerProfile.userId,
        title: "New service request",
        message: `${session.name} requested ${resolvedServiceName}.`,
        type: "SERVICE_REQUEST",
      },
    });

    return NextResponse.json(
      {
        message: "Service request sent successfully.",
        request: serviceRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create service request error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while creating the service request.",
      },
      { status: 500 }
    );
  }
}