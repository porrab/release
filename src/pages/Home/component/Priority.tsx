import React from "react";
import { Chip, Tooltip } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";

export type PriorityKey =
  | "highest"
  | "high"
  | "medium"
  | "low"
  | "lowest"
  | string;

export interface PriorityStyle {
  bgcolor: string;
  color: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface PriorityProps {
  priority?: string | null;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
  showTooltip?: boolean;
  showIcon?: boolean;
  customMap?: Partial<Record<string, PriorityStyle>>;
  sx?: any;
  className?: string;
  description?: string;
}

const DEFAULT_MAP: Record<string, PriorityStyle> = {
  highest: {
    bgcolor: "#ffebee",
    color: "#b71c1c",
    label: "Highest",
    icon: <PriorityHighIcon fontSize="small" />,
  },
  high: {
    bgcolor: "#fff3e0",
    color: "#e65100",
    label: "High",
    icon: <PriorityHighIcon fontSize="small" />,
  },
  medium: {
    bgcolor: "#fff8e1",
    color: "#f57f17",
    label: "Medium",
  },
  low: {
    bgcolor: "#e8f5e9",
    color: "#2e7d32",
    label: "Low",
    icon: <LowPriorityIcon fontSize="small" />,
  },
  lowest: { bgcolor: "#f3e5f5", color: "#6a1b9a", label: "Lowest" },
};

function normalizeKey(s?: string | null) {
  if (!s) return "unknown";
  return s.toString().trim().toLowerCase();
}

export default function Priority({
  priority,
  size = "small",
  variant = "filled",
  showTooltip = true,
  showIcon = false,
  customMap,
  sx,
  className,
  description,
}: PriorityProps) {
  const key = normalizeKey(priority);

  const mergedMap: Partial<Record<string, PriorityStyle>> = {
    ...DEFAULT_MAP,
    ...(customMap || {}),
  };

  let style: PriorityStyle | undefined = mergedMap[key];

  if (!style) {
    for (const [k, v] of Object.entries(mergedMap)) {
      if (k && v && key.includes(k)) {
        style = v;
        break;
      }
    }
  }

  if (!style) {
    // fallback default style
    style = {
      bgcolor: "#f5f5f5",
      color: "#424242",
      label: priority || "Unknown",
    };
  }

  const label = style.label ?? (priority || "Unknown");
  const icon = showIcon ? (style.icon ?? null) : null;

  const chip = (
    <Chip
      label={label}
      size={size}
      variant={variant === "outlined" ? "outlined" : "filled"}
      icon={icon as any}
      sx={{
        backgroundColor: variant === "filled" ? style.bgcolor : undefined,
        color: style.color,
        fontWeight: 600,
        fontSize: size === "small" ? "0.75rem" : "0.875rem",
        borderRadius: 1,
        height: size === "small" ? 28 : 34,
        ...sx,
      }}
      className={className}
      aria-label={`priority-${label}`}
    />
  );

  if (showTooltip) {
    return <Tooltip title={description}>{chip}</Tooltip>;
  }

  return chip;
}
