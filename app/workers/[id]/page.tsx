import RequestServiceButton from "./RequestServiceButton";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    MapPin,
    Star,
    UserRound,
    Wallet,
} from "lucide-react";

import { db } from "@/lib/db";

type WorkerPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function WorkerPublicProfile({
    params,
}: WorkerPageProps) {
    const { id } = await params;

    const workerId = Number(id);

    if (!Number.isInteger(workerId) || workerId <= 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#111827]">
                        Worker not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        The professional profile you're looking for doesn't exist.
                    </p>

                    <Link
                        href="/workers"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white hover:bg-[#059669]"
                    >
                        <ArrowLeft size={17} />
                        Browse professionals
                    </Link>
                </div>
            </main>
        );
    }

    const worker = await db.workerProfile.findUnique({
        where: {
            id: workerId,
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
                orderBy: {
                    createdAt: "asc",
                },
            },

            reviews: {
                include: {
                    customer: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!worker) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <UserRound size={25} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#111827]">
                        Worker not found
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        This professional profile may have been removed or doesn't
                        exist.
                    </p>

                    <Link
                        href="/workers"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
                    >
                        <ArrowLeft size={17} />
                        Browse professionals
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Link
                        href="/workers"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#059669]"
                    >
                        <ArrowLeft size={17} />
                        Back to professionals
                    </Link>

                    <Link
                        href="/dashboard/customer"
                        className="text-2xl font-bold tracking-tight"
                    >
                        <span className="text-[#111827]">Kari</span>
                        <span className="text-[#10B981]">gro</span>
                    </Link>
                </div>
            </header>

            {/* Main */}
            <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
                {/* Profile Header */}
                <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                    <div className="h-28 bg-[#111827] sm:h-36" />

                    <div className="px-6 pb-7 sm:px-8 sm:pb-8">
                        <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                {/* Avatar */}
                                {worker.profileImage ? (
                                    <img
                                        src={worker.profileImage}
                                        alt={`${worker.user.name}'s profile`}
                                        className="h-24 w-24 rounded-3xl border-4 border-white bg-white object-cover shadow-md sm:h-28 sm:w-28"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#10B981] text-3xl font-bold text-white shadow-md sm:h-28 sm:w-28">
                                        {worker.user.name?.charAt(0)?.toUpperCase() || "W"}
                                    </div>
                                )}


                                <div className="pb-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
                                            {worker.user.name}
                                        </h1>

                                        {worker.verified && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#059669]">
                                                <CheckCircle2 size={14} />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 font-semibold text-[#059669]">
                                        {worker.profession}
                                    </p>
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                {worker.availability ? (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-[#059669]">
                                        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                                        Available for work
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500">
                                        <span className="h-2 w-2 rounded-full bg-gray-400" />
                                        Currently unavailable
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-7 grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-500">
                                    <Star size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#111827]">
                                        {worker.rating > 0
                                            ? worker.rating.toFixed(1)
                                            : "New"}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Rating
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-50 p-2.5 text-[#059669]">
                                    <BriefcaseBusiness size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#111827]">
                                        {worker.totalJobs}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Jobs completed
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                                    <Clock3 size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#111827]">
                                        {worker.experience} years
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Experience
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#111827]">
                                        {worker.city}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Service area
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Left */}
                    <div className="space-y-6">
                        {/* About */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-xl font-bold text-[#111827]">
                                About
                            </h2>

                            {worker.bio ? (
                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                                    {worker.bio}
                                </p>
                            ) : (
                                <p className="mt-4 text-sm text-gray-400">
                                    This professional hasn't added a description yet.
                                </p>
                            )}
                        </section>

                        {/* Services */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-[#111827]">
                                        Services
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Services offered by this professional.
                                    </p>
                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                    {worker.services.length}
                                </span>
                            </div>

                            {worker.services.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        No services have been listed yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    {worker.services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="rounded-2xl border border-gray-200 p-5 transition hover:border-emerald-200"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#059669]">
                                                    <BriefcaseBusiness size={18} />
                                                </div>

                                                {service.price !== null && (
                                                    <span className="text-sm font-bold text-[#111827]">
                                                        ₹{service.price}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-4 font-bold text-[#111827]">
                                                {service.name}
                                            </h3>

                                            {service.description && (
                                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                                    {service.description}
                                                </p>
                                            )}

                                            {service.price !== null && (
                                                <p className="mt-3 text-xs text-gray-400">
                                                    Starting price
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Reviews */}
                        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-[#111827]">
                                        Reviews
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        What customers say about this professional.
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
                                    <Star
                                        size={16}
                                        className="fill-amber-400 text-amber-400"
                                    />

                                    <span className="text-sm font-bold text-amber-700">
                                        {worker.rating > 0
                                            ? worker.rating.toFixed(1)
                                            : "New"}
                                    </span>
                                </div>
                            </div>

                            {worker.reviews.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                    <Star
                                        size={25}
                                        className="mx-auto text-gray-300"
                                    />

                                    <p className="mt-3 text-sm font-medium text-gray-500">
                                        No reviews yet.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Be the first customer to review this professional.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-5">
                                    {worker.reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#111827]">
                                                        {review.customer.name}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={14}
                                                                className={
                                                                    star <= review.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-gray-200"
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <span className="text-xs text-gray-400">
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>

                                            {review.comment && (
                                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                                    "{review.comment}"
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right */}
                    <aside>
                        <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Starting price
                            </p>

                            <div className="mt-1">
                                {worker.hourlyRate !== null ? (
                                    <>
                                        <span className="text-3xl font-bold text-[#111827]">
                                            ₹{worker.hourlyRate}
                                        </span>

                                        <span className="text-sm text-gray-400">
                                            /hour
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-[#111827]">
                                        Contact for pricing
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        size={18}
                                        className="mt-0.5 text-[#059669]"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-[#111827]">
                                            Service area
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {worker.city} and within{" "}
                                            {worker.serviceRadius} km
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <RequestServiceButton
                                workerId={worker.id}
                                services={worker.services}
                                disabled={!worker.availability}
                            />

                            <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                                You'll be able to discuss the job details before
                                confirming.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}