"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    Star,
    CheckCircle2,
    BriefcaseBusiness,
    SlidersHorizontal,
    Loader2,
    ArrowRight,
    X,
} from "lucide-react";

type WorkerService = {
    id: number;
    name: string;
    description: string | null;
    price: number | null;
};

type Worker = {
    id: number;
    name: string;
    profession: string;
    bio: string | null;
    experience: number;
    hourlyRate: number | null;
    city: string;
    serviceRadius: number;
    availability: boolean;
    rating: number;
    totalJobs: number;
    verified: boolean;
    profileImage: string | null;
    services: WorkerService[];
};

export default function WorkersPage() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [profession, setProfession] = useState("");
    const [minRating, setMinRating] = useState("");
    const [available, setAvailable] = useState(false);

    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    async function fetchWorkers(
        searchValue = search,
        cityValue = city,
        professionValue = profession,
        minRatingValue = minRating,
        availableValue = available
    ) {
        setLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();

            if (searchValue.trim()) {
                params.set("search", searchValue.trim());
            }

            if (cityValue.trim()) {
                params.set("city", cityValue.trim());
            }

            if (professionValue.trim()) {
                params.set("profession", professionValue.trim());
            }

            if (minRatingValue) {
                params.set("minRating", minRatingValue);
            }

            if (availableValue) {
                params.set("available", "true");
            }

            const query = params.toString();

            const response = await fetch(
                `/api/workers${query ? `?${query}` : ""}`
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to find workers.");
                setWorkers([]);
                return;
            }

            setWorkers(data.workers ?? []);
            setSearched(
                Boolean(
                    searchValue.trim() ||
                    cityValue.trim() ||
                    professionValue.trim() ||
                    minRatingValue ||
                    availableValue
                )
            );
        } catch {
            setError("Unable to connect to the server.");
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setHydrated(true);
        fetchWorkers("", "", "");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSearch(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        fetchWorkers(
            search,
            city,
            profession,
            minRating,
            available
        );
    }

    function clearFilters() {
        setSearch("");
        setCity("");
        setProfession("");
        setMinRating("");
        setAvailable(false);

        fetchWorkers("", "", "", "", false);
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Link
                        href="/dashboard/customer"
                        className="text-2xl font-bold tracking-tight"
                    >
                        <span className="text-[#111827]">Kari</span>
                        <span className="text-[#10B981]">gro</span>
                    </Link>

                    <Link
                        href="/dashboard/customer"
                        className="text-sm font-medium text-gray-500 transition hover:text-[#059669]"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-[#111827]">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-wider text-[#10B981]">
                            Find professionals
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            Find the right person for the job.
                        </h1>

                        <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base">
                            Discover skilled professionals near you and find someone
                            you can trust.
                        </p>
                    </div>

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="mt-8 rounded-2xl bg-white p-3 shadow-xl"
                    >
                        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
                            {/* Search */}
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                <Search
                                    size={19}
                                    className="shrink-0 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="What service do you need?"
                                    className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-gray-400"
                                />
                            </div>

                            {/* City */}
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                <MapPin
                                    size={19}
                                    className="shrink-0 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City"
                                    className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-gray-400"
                                />
                            </div>

                            {/* Profession */}
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                <BriefcaseBusiness
                                    size={19}
                                    className="shrink-0 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={profession}
                                    onChange={(e) =>
                                        setProfession(e.target.value)
                                    }
                                    placeholder="Profession"
                                    className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-gray-400"
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-7 py-3 font-semibold text-white transition hover:bg-[#059669]"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Search size={18} />
                                )}

                                <span>{loading ? "Searching..." : "Search"}</span>
                            </button>
                        </div>
                        {/* Advanced Filters */}
                        <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                                <SlidersHorizontal size={17} className="text-[#059669]" />
                                Filters
                            </div>

                            <div className="h-px bg-gray-100 sm:h-6 sm:w-px" />

                            {/* Rating */}
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#10B981]"
                            >
                                <option value="">Any rating</option>
                                <option value="4">4.0+ ⭐</option>
                                <option value="3">3.0+ ⭐</option>
                                <option value="2">2.0+ ⭐</option>
                                <option value="1">1.0+ ⭐</option>
                            </select>

                            {/* Availability */}
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={available}
                                    onChange={(e) => setAvailable(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 accent-[#10B981]"
                                />

                                Available now
                            </label>

                            {/* Apply */}

                        </div>
                    </form>
                </div>
            </section>

            {/* Results */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-[#111827]">
                                {searched
                                    ? "Search results"
                                    : "Professionals near you"}
                            </h2>

                            {!loading && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                                    {workers.length}
                                </span>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            Browse skilled professionals available on Karigro.
                        </p>
                    </div>

                    {(search || city || profession || minRating || available) && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gray-500 transition hover:text-red-600 sm:self-auto"
                        >
                            <X size={16} />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                            <Loader2
                                size={20}
                                className="animate-spin text-[#10B981]"
                            />
                            Finding professionals...
                        </div>
                    </div>
                ) : workers.length === 0 ? (
                    /* Empty */
                    <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                            <SlidersHorizontal size={24} />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[#111827]">
                            No professionals found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Try a different service, profession or city. We're
                            constantly adding skilled professionals to Karigro.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            View all professionals
                        </button>
                    </div>
                ) : (
                    /* Worker grid */
                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {workers.map((worker) => (
                            <article
                                key={worker.id}
                                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                            >
                                {/* Card top */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            {worker.profileImage ? (
                                                <img
                                                    src={worker.profileImage}
                                                    alt={worker.name}
                                                    className="h-14 w-14 rounded-2xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-lg font-bold text-white">
                                                    {worker.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-bold text-[#111827]">
                                                        {worker.name}
                                                    </h3>

                                                    {worker.verified && (
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-[#10B981]"
                                                        />
                                                    )}
                                                </div>

                                                <p className="mt-0.5 text-sm font-medium text-[#059669]">
                                                    {worker.profession}
                                                </p>
                                            </div>
                                        </div>

                                        {worker.availability && (
                                            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#059669]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                                                Available
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="mt-5 flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1.5 font-semibold text-[#111827]">
                                            <Star
                                                size={16}
                                                className="fill-current text-amber-400"
                                            />

                                            {worker.rating > 0
                                                ? worker.rating.toFixed(1)
                                                : "New"}
                                        </span>

                                        <span className="text-gray-400">
                                            {worker.totalJobs}{" "}
                                            {worker.totalJobs === 1
                                                ? "job"
                                                : "jobs"}
                                        </span>

                                        <span className="flex items-center gap-1 text-gray-400">
                                            <MapPin size={14} />
                                            {worker.city}
                                        </span>
                                    </div>

                                    {/* Bio */}
                                    {worker.bio && (
                                        <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-500">
                                            {worker.bio}
                                        </p>
                                    )}

                                    {/* Services */}
                                    {worker.services.length > 0 && (
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {worker.services
                                                .slice(0, 3)
                                                .map((service) => (
                                                    <span
                                                        key={service.id}
                                                        className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600"
                                                    >
                                                        {service.name}
                                                    </span>
                                                ))}

                                            {worker.services.length > 3 && (
                                                <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-500">
                                                    +{worker.services.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Card bottom */}
                                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                    <div>
                                        {worker.hourlyRate !== null ? (
                                            <>
                                                <span className="text-lg font-bold text-[#111827]">
                                                    ₹{worker.hourlyRate}
                                                </span>

                                                <span className="text-xs text-gray-400">
                                                    /hour
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-500">
                                                Contact for pricing
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        href={`/workers/${worker.id}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] transition group-hover:text-[#047857]"
                                    >
                                        View profile
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}