import { register, type WidgetProps } from "../../core/registry.js";

export interface BadgeProps extends WidgetProps {
  label: string;
  tone?: "info" | "warn" | "error";
}

// The pattern every widget follows — this is exactly what a "creating-widget"
// skill should encode: a pure function returning an HTML string, registered
// under the widget's own name, with a colocated *.test.ts.
export function createBadge(props: BadgeProps): string {
  const tone = props.tone ?? "info";
  return `<span class="badge badge--${tone}">${props.label}</span>`;
}

register("badge", createBadge);
