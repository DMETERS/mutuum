// ── Íconos de Mutuum — set Iconoir, envuelto con API uniforme ──
// Reexporta bajo nombres estables (estilo lucide) para que las páginas
// solo cambien el import. Normaliza props: { size, className, strokeWidth }.
import type { ComponentType, SVGProps } from "react";
import {
  ArrowRight as IoArrowRight,
  ArrowLeft as IoArrowLeft,
  DataTransferBoth,
  Check as IoCheck,
  Clock as IoClock,
  Star as IoStar,
  StarSolid as IoStarSolid,
  Search as IoSearch,
  Wallet as IoWallet,
  Lock as IoLock,
  Send as IoSend,
  Medal,
  DashboardSpeed,
  MapPin as IoMapPin,
  Sparks,
  PlusCircle as IoPlusCircle,
  User as IoUser,
  LogOut as IoLogOut,
  ViewGrid,
  HandCash,
  InfoCircle,
  Page,
  PageEdit,
  Healthcare,
  Community,
  FingerprintScan,
  FaceId,
  GraphUp,
  GraphDown,
  FilterList,
  Flash,
  Upload as IoUpload,
  ShieldCheck as IoShieldCheck,
  BadgeCheck as IoBadgeCheck,
  MessageText,
  ClipboardCheck as IoClipboardCheck,
  Calculator as IoCalculator,
} from "iconoir-react";

export type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};
export type IconType = ComponentType<IconProps>;

type IoIcon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

function wrap(Ico: IoIcon, solid = false): IconType {
  function Icon({ size = 16, className, strokeWidth }: IconProps) {
    return (
      <Ico
        width={size}
        height={size}
        strokeWidth={solid ? undefined : strokeWidth ?? 1.7}
        className={className}
      />
    );
  }
  return Icon;
}

// Navegación / flechas
export const ArrowRight = wrap(IoArrowRight);
export const ArrowLeft = wrap(IoArrowLeft);
export const ArrowLeftRight = wrap(DataTransferBoth);

// Acciones / estados
export const Check = wrap(IoCheck);
export const Clock = wrap(IoClock);
export const Upload = wrap(IoUpload);
export const Send = wrap(IoSend);
export const Lock = wrap(IoLock);
export const Zap = wrap(Flash);

// Valoración
export const Star = wrap(IoStar);
export const StarSolid = wrap(IoStarSolid, true);

// Dominio
export const Search = wrap(IoSearch);
export const Wallet = wrap(IoWallet);
export const HandCoins = wrap(HandCash);
export const Gauge = wrap(DashboardSpeed);
export const MapPin = wrap(IoMapPin);
export const Sparkles = wrap(Sparks);
export const Award = wrap(Medal);
export const TrendingUp = wrap(GraphUp);
export const TrendingDown = wrap(GraphDown);
export const SlidersHorizontal = wrap(FilterList);
export const ScrollText = wrap(Page);
export const FileSignature = wrap(PageEdit);
export const MessageSquareText = wrap(MessageText);
export const ClipboardCheck = wrap(IoClipboardCheck);
export const Info = wrap(InfoCircle);
export const Calculator = wrap(IoCalculator);

// Identidad / confianza
export const IdCard = wrap(Healthcare);
export const ScanFace = wrap(FaceId);
export const Fingerprint = wrap(FingerprintScan);
export const HeartHandshake = wrap(Community);
export const ShieldCheck = wrap(IoShieldCheck);
export const BadgeCheck = wrap(IoBadgeCheck);

// Navegación de la app
export const LayoutGrid = wrap(ViewGrid);
export const PlusCircle = wrap(IoPlusCircle);
export const UserRound = wrap(IoUser);
export const LogOut = wrap(IoLogOut);
