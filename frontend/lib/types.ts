export type CreatorProfile = {
  categories: string[];
  city: string | null;
  commission_open: boolean;
  description: string | null;
  links: Record<string, string> | null;
};

export type AttendanceSummary = {
  event_id: number;
  event_title: string;
  event_slug: string;
  booth_number: string;
  label: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email?: string;
  bio: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_creator: boolean;
  creator_profile: CreatorProfile | null;
  stats: { photos: number; followers: number; following: number };
  attendance: AttendanceSummary | null;
  is_following: boolean;
  created_at?: string;
};

export type UserSummary = {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
};

export type Photo = {
  id: number;
  url: string;
  caption: string | null;
  hashtags: string[];
  like_count: number;
  comment_count: number;
  liked: boolean;
  created_at: string;
  user: UserSummary;
  album: { id: number; title: string | null } | null;
};

export type Comment = {
  id: number;
  body: string;
  created_at: string;
  user: UserSummary;
  can_delete: boolean;
};

export type EventItem = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  location: string;
  starts_at: string;
  ends_at: string;
  attendee_count: number;
  is_past: boolean;
  my_attendance: { id: number; booth_number: string; status: string } | null;
  attendees?: (UserSummary & { booth_number: string })[];
};

export type EventDetail = {
  event: EventItem;
  attendees: { id: number; booth_number: string; user: User }[];
};

export type Attendance = {
  id: number;
  booth_number: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
  created_at: string;
  user: UserSummary | null;
  event: {
    id: number;
    title: string;
    slug: string;
    starts_at: string;
    ends_at: string;
    location: string;
  } | null;
};

export type NotificationItem = {
  id: number;
  type: string;
  read: boolean;
  created_at: string;
  actor: UserSummary | null;
  photo: { id: number; url: string } | null;
  message: string | null;
};

export type DirectoryCreator = User & { latest_photos: Photo[] };

export type DirectoryFilters = {
  categories: string[];
  events: { id: number; title: string; starts_at: string; ends_at: string }[];
};

export type Meta = {
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
};

export type PhotoList = { data: Photo[]; meta: Meta };
export type DirectoryList = { data: DirectoryCreator[]; meta: Meta; filters: DirectoryFilters };
