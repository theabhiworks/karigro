"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock3,
  Loader2,
} from "lucide-react";

type WorkerProfile = {
  profession: string;
  bio: string | null;
  experience: number;
  hourlyRate: number | null;
  city: string;
  serviceRadius: number;
};

export default function WorkerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [city, setCity] = useState("");
  const [serviceRadius, setServiceRadius] = useState("10");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/worker/profile");

        if (response.status === 404) {
          setProfile(null);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load profile.");
          return;
        }

        const workerProfile = data.profile as WorkerProfile;

        setProfile(workerProfile);

        setProfession(workerProfile.profession);
        setBio(workerProfile.bio ?? "");
        setExperience(String(workerProfile.experience));
        setHourlyRate(
          workerProfile.hourlyRate !== null
            ? String(workerProfile.hourlyRate)
            : ""
        );
        setCity(workerProfile.city);
        setServiceRadius(String(workerProfile.serviceRadius));
      } catch {
        setError("Unable to load your profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/worker/profile", {
        method: profile ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profession,
          bio,
          experience,
          hourlyRate,
          city,
          serviceRadius,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save profile.");
        return;
      }

      setSuccess(
        profile
          ? "Your professional profile has been updated!"
          : "Your professional profile has been created!"
      );

      setProfile(data.profile);

      setTimeout(() => {
        router.push("/dashboard/worker");
        router.refresh();
      }, 1000);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <Loader2 size={20} className="animate-spin text-[#10B981]" />
          Loading your profile...
        </div>
      </main>
    );
  }

  const isEditing = profile !== null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard/worker")}
            className="mr-5 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#111827]"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard/worker")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-[#111827]">Kari</span>
            <span className="text-[#10B981]">gro</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {/* Heading */}
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
            <BriefcaseBusiness size={23} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[#059669]">
            Professional profile
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            {isEditing
              ? "Update your professional profile"
              : "Tell customers about your skills"}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-gray-500">
            {isEditing
              ? "Keep your professional information accurate so customers know what you offer."
              : "Complete your profile so customers can understand your experience and find you when they need your services."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Profession */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Profession
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                required
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Plumber, Electrician, Carpenter"
                className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Enter the main service you provide.
            </p>
          </div>

          {/* Experience */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Years of experience
            </label>

            <div className="relative">
              <Clock3
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                required
                min="0"
                max="60"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Rate + City */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                Starting hourly rate
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#111827]">
                City
              </label>

              <div className="relative">
                <MapPin
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Service Radius */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Service radius
            </label>

            <select
              value={serviceRadius}
              onChange={(e) => setServiceRadius(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-[#111827] outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="15">Within 15 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>

            <p className="mt-2 text-xs text-gray-400">
              Customers within this area can discover your profile.
            </p>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              About your work
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Tell customers about your experience, the services you provide, and what makes your work reliable..."
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm leading-6 text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-2 text-right text-xs text-gray-400">
              {bio.length}/500
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-[#10B981] py-3.5 font-semibold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isEditing
                ? "Saving changes..."
                : "Creating your profile..."
              : isEditing
                ? "Save Changes"
                : "Create Professional Profile"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            You can update your professional information anytime.
          </p>
        </form>
      </div>
    </main>
  );
}