"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to load notifications");
        }

        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">
            Notifications
          </h1>

          <p className="mt-2 text-[#6B7280]">
            Stay updated about your service requests.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-[#6B7280]">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center">
            <div className="mb-3 text-4xl">🔔</div>

            <h2 className="text-lg font-semibold text-[#111827]">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border bg-white p-5 transition ${
                  notification.read
                    ? "border-[#E5E7EB]"
                    : "border-[#10B981] bg-emerald-50/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg">
                    🔔
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-[#111827]">
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="rounded-full bg-[#10B981] px-2.5 py-1 text-xs font-medium text-white">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-[#6B7280]">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-[#9CA3AF]">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}