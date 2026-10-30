export interface LinkItem {
  id: string;
  title: string;
  url: string;
  platform: string;
  icon?: string;
  bgColor?: string;
  textColor?: string;
  active: boolean;
  clicks: number;
}

export interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  verified: boolean;
  theme?: string;
  adminPin: string;
}

export interface SiteData {
  profile: ProfileData;
  links: LinkItem[];
  updatedAt?: number;
}
