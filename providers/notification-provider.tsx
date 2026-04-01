"use client";

import React from "react";

type NotificationPayload = {
  title: string;
  body?: string;
  icon?: string;
};

export default function NotificationProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const requestPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  React.useEffect(() => {
    if (!userId) return;

    // TODO: connect socket
    // TODO: join user room
    // TODO: request browser permission
    // TODO: request browser permission
    requestPermission();

    // TODO: listen realtime notification
    if (Notification.permission === "granted") {
      new Notification("Test Notification", { body: "Text testing" });
    }
    // TODO:
  }, [userId]);

  return <>{children}</>;
}
