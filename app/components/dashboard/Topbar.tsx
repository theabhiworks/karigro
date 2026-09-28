"use client";

import { Bell, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TopbarProps = {
  userName: string;
  role: "CUSTOMER" | "WORKER";
  onMenuClick: () => void;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export default function Topbar({
  userName,
  role,
  onMenuClick,
}: TopbarProps) {
  const initial = userName.charAt(0).toUpperCase();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications");

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setNotifications(data.notifications ?? []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  async function markNotificationsAsRead() {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden items-center gap-3 rounded-xl bg-gray-50 px-4 py-2.5 md:flex">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder={
                role === "CUSTOMER"
                  ? "Search workers..."
                  : "Search jobs..."
              }
              className="w-56 bg-transparent text-sm text-[#111827] outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="md:hidden">
            <p className="text-sm text-gray-500">
              {role === "CUSTOMER" ? "Customer" : "Professional"}
            </p>

            <p className="font-semibold text-[#111827]">
              Welcome back, {userName.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setNotificationOpen((open) => !open)}
              className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#111827]"
              aria-label="Notifications"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#10B981] px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                {/* Notification Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-[#111827]">
                      Notifications
                    </h3>

                    {unreadCount > 0 && (
                      <p className="mt-0.5 text-xs text-[#059669]">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markNotificationsAsRead}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#059669] transition hover:bg-emerald-50"
                      >
                        Mark all as read
                      </button>
                    )}

                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Close notifications"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <Bell
                        size={28}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm font-medium text-[#111827]">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        You&apos;re all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-gray-100 px-5 py-4 last:border-b-0 ${
                          !notification.read
                            ? "bg-emerald-50/40"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">

                          {/* Icon */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                            <Bell
                              size={16}
                              className="text-[#059669]"
                            />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-[#111827]">
                                {notification.title}
                              </p>

                              {!notification.read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-[11px] text-gray-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#111827]">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                {role === "CUSTOMER"
                  ? "Customer"
                  : "Professional"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-sm font-bold text-white">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}