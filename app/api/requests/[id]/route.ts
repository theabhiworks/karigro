import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const requestId = Number(id);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return NextResponse.json(
        { message: "Invalid request ID." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const action = body.action;

    if (!["ACCEPT", "DECLINE", "COMPLETE", "CANCEL"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid request action." },
        { status: 400 }
      );
    }

    const serviceRequest = await db.serviceRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { message: "Service request not found." },
        { status: 404 }
      );
    }

    // =====================================================
    // CUSTOMER CANCEL
    // =====================================================

    if (action === "CANCEL") {
      if (session.role !== "CUSTOMER") {
        return NextResponse.json(
          {
            message: "Only customers can cancel requests.",
          },
          { status: 403 }
        );
      }

      if (serviceRequest.customerId !== session.userId) {
        return NextResponse.json(
          {
            message: "You are not authorized to cancel this request.",
          },
          { status: 403 }
        );
      }

      if (serviceRequest.status !== "PENDING") {
        return NextResponse.json(
          {
            message: "Only pending requests can be cancelled.",
          },
          { status: 400 }
        );
      }

      const updatedRequest = await db.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      return NextResponse.json(
        {
          message: "Service request cancelled.",
          request: updatedRequest,
        },
        { status: 200 }
      );
    }

    // =====================================================
    // WORKER ACTIONS
    // =====================================================

    if (session.role !== "WORKER") {
      return NextResponse.json(
        {
          message: "Only the assigned worker can perform this action.",
        },
        { status: 403 }
      );
    }

    const workerProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!workerProfile) {
      return NextResponse.json(
        {
          message: "Worker profile not found.",
        },
        { status: 404 }
      );
    }

    if (serviceRequest.workerId !== workerProfile.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to modify this request.",
        },
        { status: 403 }
      );
    }

    // ---------------------------
    // ACCEPT
    // ---------------------------

    if (action === "ACCEPT") {
      if (serviceRequest.status !== "PENDING") {
        return NextResponse.json(
          {
            message: "Only pending requests can be accepted.",
          },
          { status: 400 }
        );
      }

      const updatedRequest = await db.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "ACCEPTED",
        },
      });

      await db.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "Request accepted",
          message: `Your ${serviceRequest.serviceName} request was accepted.`,
          type: "REQUEST_ACCEPTED",
        },
      });

      return NextResponse.json(
        {
          message: "Service request accepted.",
          request: updatedRequest,
        },
        { status: 200 }
      );
    }

    // ---------------------------
    // DECLINE
    // ---------------------------

    if (action === "DECLINE") {
      if (serviceRequest.status !== "PENDING") {
        return NextResponse.json(
          {
            message: "Only pending requests can be declined.",
          },
          { status: 400 }
        );
      }

      const updatedRequest = await db.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "DECLINED",
        },
      });

      await db.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "Request declined",
          message: `Your ${serviceRequest.serviceName} request was declined.`,
          type: "REQUEST_DECLINED",
        },
      });

      return NextResponse.json(
        {
          message: "Service request declined.",
          request: updatedRequest,
        },
        { status: 200 }
      );
    }

    // ---------------------------
    // COMPLETE
    // ---------------------------

    if (action === "COMPLETE") {
      if (serviceRequest.status !== "ACCEPTED") {
        return NextResponse.json(
          {
            message: "Only accepted jobs can be completed.",
          },
          { status: 400 }
        );
      }

      const updatedRequest = await db.serviceRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "COMPLETED",
        },
      });

      await db.notification.create({
        data: {
          userId: serviceRequest.customerId,
          title: "Service completed",
          message: `Your ${serviceRequest.serviceName} service has been completed.`,
          type: "REQUEST_COMPLETED",
        },
      });

      await db.workerProfile.update({
        where: {
          id: workerProfile.id,
        },
        data: {
          totalJobs: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          message: "Job marked as completed.",
          request: updatedRequest,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update service request error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while updating the request.",
      },
      { status: 500 }
    );
  }
}