import {
  Camera, Film, Clapperboard, Smartphone, Users, Box, Briefcase, House, UtensilsCrossed, Drone, Music, Mic,
  Scissors, Gem, Heart, Baby, Presentation, Guitar, RadioTower, TrendingUp, Target, Megaphone, Search,
  CalendarDays, Star, PenLine, Compass, Monitor, ShoppingCart, LayoutTemplate, ChartLine, Palette,
  type LucideIcon,
} from "lucide-react";
import { siWhatsapp, siTiktok, siInstagram, siFacebook, siYoutube, siBehance, siGoogledrive } from "simple-icons";
import type { ICONS } from "@/lib/content/schemas";

export const SERVICE_ICONS: Record<(typeof ICONS)[number], LucideIcon> = {
  camera: Camera, film: Film, clapper: Clapperboard, "phone-video": Smartphone, users: Users, box: Box,
  briefcase: Briefcase, home: House, utensils: UtensilsCrossed, drone: Drone, music: Music, mic: Mic,
  scissors: Scissors, rings: Gem, heart: Heart, baby: Baby, presentation: Presentation, guitar: Guitar,
  broadcast: RadioTower, trending: TrendingUp, target: Target, megaphone: Megaphone, search: Search,
  calendar: CalendarDays, star: Star, pen: PenLine, compass: Compass, monitor: Monitor, cart: ShoppingCart,
  layout: LayoutTemplate, seo: ChartLine, palette: Palette,
};

export function ServiceIcon({ name, className }: { name: (typeof ICONS)[number]; className?: string }) {
  const I = SERVICE_ICONS[name] ?? Camera;
  return <I className={className} strokeWidth={1.5} aria-hidden="true" />;
}

type BrandProps = { className?: string; title?: string };
const brand = (path: string) =>
  function BrandIcon({ className, title }: BrandProps) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
        {title ? <title>{title}</title> : null}
        <path d={path} />
      </svg>
    );
  };

export const WhatsAppIcon = brand(siWhatsapp.path);
export const TikTokIcon = brand(siTiktok.path);
export const InstagramIcon = brand(siInstagram.path);
export const FacebookIcon = brand(siFacebook.path);
export const YouTubeIcon = brand(siYoutube.path);
export const BehanceIcon = brand(siBehance.path);
export const DriveIcon = brand(siGoogledrive.path);

export function LinkedInIcon({ className, title }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M3 3h18v18H3z" fillOpacity="0" />
      <path d="M4.5 9h3.2v10.5H4.5zM6.1 3.8a1.85 1.85 0 1 1 0 3.7 1.85 1.85 0 0 1 0-3.7M9.7 9h3.07v1.44h.04c.43-.81 1.47-1.66 3.03-1.66 3.24 0 3.84 2.13 3.84 4.9v5.82h-3.2v-5.16c0-1.23-.02-2.82-1.72-2.82-1.72 0-1.98 1.34-1.98 2.73v5.25H9.7z" />
    </svg>
  );
}
