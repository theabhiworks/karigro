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
        { message: "Only workers can access a professional profile." },
        { status: 403 }
      );
    }

    const profile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Worker profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Worker profile fetch error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while loading your profile.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get logged-in user
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // Only workers can create worker profiles
    if (session.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can create a professional profile." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      profession,
      bio,
      experience,
      hourlyRate,
      city,
      serviceRadius,
    } = body;

    // Required fields
    if (!profession || !experience || !city) {
      return NextResponse.json(
        {
          message:
            "Profession, experience and city are required.",
        },
        { status: 400 }
      );
    }

    // Validate experience
    const experienceNumber = Number(experience);

    if (
      Number.isNaN(experienceNumber) ||
      experienceNumber < 0 ||
      experienceNumber > 60
    ) {
      return NextResponse.json(
        { message: "Please enter a valid experience." },
        { status: 400 }
      );
    }

    // Validate hourly rate if provided
    const hourlyRateNumber =
      hourlyRate !== undefined &&
      hourlyRate !== null &&
      hourlyRate !== ""
        ? Number(hourlyRate)
        : null;

    if (
      hourlyRateNumber !== null &&
      (Number.isNaN(hourlyRateNumber) || hourlyRateNumber < 0)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid hourly rate." },
        { status: 400 }
      );
    }

    // Validate service radius
    const serviceRadiusNumber =
      serviceRadius !== undefined &&
      serviceRadius !== null &&
      serviceRadius !== ""
        ? Number(serviceRadius)
        : 10;

    if (
      Number.isNaN(serviceRadiusNumber) ||
      serviceRadiusNumber < 1 ||
      serviceRadiusNumber > 100
    ) {
      return NextResponse.json(
        { message: "Service radius must be between 1 and 100 km." },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { message: "Your worker profile already exists." },
        { status: 409 }
      );
    }

    // Create profile
    const workerProfile = await db.workerProfile.create({
      data: {
        userId: session.userId,
        profession: profession.trim(),
        bio: bio?.trim() || null,
        experience: experienceNumber,
        hourlyRate: hourlyRateNumber,
        city: city.trim(),
        serviceRadius: serviceRadiusNumber,
      },
    });

    return NextResponse.json(
      {
        message: "Worker profile created successfully.",
        profile: workerProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Worker profile creation error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while creating your profile.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Get logged-in user
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // Only workers can update worker profiles
    if (session.role !== "WORKER") {
      return NextResponse.json(
        { message: "Only workers can update a professional profile." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      profession,
      bio,
      experience,
      hourlyRate,
      city,
      serviceRadius,
    } = body;

    // Required fields
    if (!profession || !experience || !city) {
      return NextResponse.json(
        {
          message:
            "Profession, experience and city are required.",
        },
        { status: 400 }
      );
    }

    // Validate experience
    const experienceNumber = Number(experience);

    if (
      Number.isNaN(experienceNumber) ||
      experienceNumber < 0 ||
      experienceNumber > 60
    ) {
      return NextResponse.json(
        { message: "Please enter a valid experience." },
        { status: 400 }
      );
    }

    // Validate hourly rate
    const hourlyRateNumber =
      hourlyRate !== undefined &&
      hourlyRate !== null &&
      hourlyRate !== ""
        ? Number(hourlyRate)
        : null;

    if (
      hourlyRateNumber !== null &&
      (Number.isNaN(hourlyRateNumber) || hourlyRateNumber < 0)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid hourly rate." },
        { status: 400 }
      );
    }

    // Validate service radius
    const serviceRadiusNumber =
      serviceRadius !== undefined &&
      serviceRadius !== null &&
      serviceRadius !== ""
        ? Number(serviceRadius)
        : 10;

    if (
      Number.isNaN(serviceRadiusNumber) ||
      serviceRadiusNumber < 1 ||
      serviceRadiusNumber > 100
    ) {
      return NextResponse.json(
        { message: "Service radius must be between 1 and 100 km." },
        { status: 400 }
      );
    }

    // Check existing profile
    const existingProfile = await db.workerProfile.findUnique({
      where: {
        userId: session.userId,
      },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Worker profile not found." },
        { status: 404 }
      );
    }

    // Update profile
    const updatedProfile = await db.workerProfile.update({
      where: {
        userId: session.userId,
      },
      data: {
        profession: profession.trim(),
        bio: bio?.trim() || null,
        experience: experienceNumber,
        hourlyRate: hourlyRateNumber,
        city: city.trim(),
        serviceRadius: serviceRadiusNumber,
      },
    });

    return NextResponse.json(
      {
        message: "Worker profile updated successfully.",
        profile: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Worker profile update error:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while updating your profile.",
      },
      { status: 500 }
    );
  }
}