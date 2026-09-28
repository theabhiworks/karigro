"use client";

import { FormEvent, useState } from "react";
import { Check, Loader2, Pencil, X } from "lucide-react";

type CustomerProfileFormProps = {
    initialName: string;
    initialEmail: string;
};

export default function CustomerProfileForm({
    initialName,
    initialEmail,
}: CustomerProfileFormProps) {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim() || !email.trim()) {
            setMessage("Name and email are required.");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.error || data.message || "Failed to update profile."
                );
                return;
            }
            setMessage("Profile updated successfully.");
            setEditing(false);
        } catch (error) {
            console.error("Profile update error:", error);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setName(initialName);
        setEmail(initialEmail);
        setMessage("");
        setEditing(false);
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
                {/* Header */}
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-[#059669]">
                        Customer profile
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Manage your personal information and account details.
                    </p>
                </div>

                {/* Profile Card */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    {/* Profile Header */}
                    <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-xl font-bold text-white">
                                {name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">
                                    {name || "Customer"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Customer
                                </p>
                            </div>
                        </div>

                        {!editing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMessage("");
                                    setEditing(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669]"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="mt-7 space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="text-xs font-semibold uppercase tracking-wide text-gray-400"
                            >
                                Full name
                            </label>

                            {editing ? (
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                                    required
                                />
                            ) : (
                                <p className="mt-2 text-sm font-medium text-[#111827]">
                                    {name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="text-xs font-semibold uppercase tracking-wide text-gray-400"
                            >
                                Email
                            </label>

                            {editing ? (
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#10B981] focus:ring-2 focus:ring-emerald-100"
                                    required
                                />
                            ) : (
                                <p className="mt-2 text-sm font-medium text-[#111827]">
                                    {email}
                                </p>
                            )}
                        </div>

                        {/* Account Type */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Account type
                            </p>

                            <p className="mt-2 text-sm font-medium text-[#111827]">
                                Customer
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-[#059669]">
                            {message}
                        </div>
                    )}

                    {/* Actions */}
                    {editing && (
                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                <X size={16} />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10B981] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}