export const GROUPABLE_NOTIFICATIONS = ["star", "follow", "repost"];

export const MAX_AUTHORS_SHOWN = 6;

export const NOTIFICATION_FILTER: {
  label: string;
  value: NotificationReason | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Star", value: "like" },
  { label: "Follow", value: "follow" },
  { label: "Repost", value: "repost" },
  { label: "Quote", value: "quote" },
  { label: "Reply", value: "reply" },
];
