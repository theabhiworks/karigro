import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const profession =
      searchParams.get("profession")?.trim() || "";

    const minRatingParam =
      searchParams.get("minRating")?.trim() || "";

    const available =
      searchParams.get("available") === "true";

    const minRating = Number(minRatingParam);

    const workers = await db.workerProfile.findMany({
      where: {
        city: city
          ? {
            contains: city,
            mode: "insensitive",
          }
          : undefined,

        profession: profession
          ? {
            contains: profession,
            mode: "insensitive",
          }
          : undefined,

        rating:
          minRatingParam &&
            !Number.isNaN(minRating)
            ? {
              gte: minRating,
            }
            : undefined,

        availability: available
          ? true
          : undefined,

        OR: search
          ? [
            {
              profession: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              bio: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              services: {
                some: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ]
          : undefined,
      },

      include: {
        user: {
          select: {
            name: true,
          },
        },

        services: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },

      orderBy: [
        {
          verified: "desc",
        },
        {
          rating: "desc",
        },
        {
          totalJobs: "desc",
        },
      ],

      take: 50,
    });

    const publicWorkers = workers.map((worker) => ({
      id: worker.id,
      name: worker.user.name,
      profession: worker.profession,
      bio: worker.bio,
      experience: worker.experience,
      hourlyRate: worker.hourlyRate,
      city: worker.city,
      serviceRadius: worker.serviceRadius,
      availability: worker.availability,
      rating: worker.rating,
      totalJobs: worker.totalJobs,
      verified: worker.verified,
      profileImage: worker.profileImage,
      services: worker.services,
    }));

    return NextResponse.json(
      {
        workers: publicWorkers,
        count: publicWorkers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Worker discovery error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while finding workers.",
      },
      { status: 500 }
    );
  }
}