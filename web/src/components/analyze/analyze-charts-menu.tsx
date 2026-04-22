"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

/** Recharts docs-style chart list (Analyze page). `hash` targets on-page sections when available. */
/** Scroll targets on `/analyze`. */
const CHART_TYPES: readonly {
  label: string;
  hash: string;
}[] = [
  { label: "BarChart", hash: "recharts-barchart" },
  { label: "AreaChart · sample", hash: "recharts-areachart-sample" },
  { label: "LineChart", hash: "recharts-linechart" },
  { label: "ComposedChart", hash: "recharts-composedchart" },
  { label: "PieChart · nested", hash: "recharts-nested-pie" },
  { label: "RadarChart", hash: "recharts-radarchart" },
  { label: "RadialBarChart", hash: "recharts-radialbarchart" },
  { label: "ScatterChart", hash: "recharts-scatterchart" },
] as const;

const MENU_PANEL_TOP = "top-[5.5rem]";
const DOC_BG = "#1a1b1e";

export function AnalyzeChartsMenu() {
  const [open, setOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelDomId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const scrollToHash = (hash: string, label: string) => {
    setActiveLabel(label);
    setOpen(false);
    /* Let body overflow restore before scrolling; focus without scrolling or it jumps back to header. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        triggerRef.current?.focus({ preventScroll: true });
      });
    });
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-rule bg-panel px-3 py-2 text-sm font-medium text-paper",
          "transition-colors hover:border-steel hover:bg-ink/60",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
          open && "border-signal/50 bg-signal/10 text-signal-hover",
        )}
        aria-expanded={open ? "true" : "false"}
        aria-controls={open ? panelDomId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="size-4 text-steel" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
        Charts
      </button>

      {open ? (
        <>
          <button
            type="button"
            className={cn("fixed inset-0 z-[60] bg-ink/75 lg:bg-ink/60", MENU_PANEL_TOP)}
            aria-label="Close charts menu"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id={panelDomId}
            role="dialog"
            aria-modal="true"
            aria-labelledby="analyze-charts-menu-title"
            className={cn(
              "fixed z-[70] flex h-[calc(100dvh-5.5rem)] w-[min(18rem,92vw)] flex-col border-r border-[#2a2b31] shadow-2xl",
              MENU_PANEL_TOP,
              "left-0",
            )}
            style={{ backgroundColor: DOC_BG }}
          >
            <div className="border-b border-[#2a2b31] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9ca3af]">API</p>
              <h2
                id="analyze-charts-menu-title"
                className="mt-2 border-b border-[#3f3f46] pb-2 text-sm font-semibold text-[#e4e4e7]"
              >
                Charts
              </h2>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Recharts chart types">
              <ul className="space-y-0.5 pl-1">
                {CHART_TYPES.map((item) => {
                  const isActive = activeLabel === item.label;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-md py-2 pl-3 pr-2 text-left text-sm transition-colors",
                          isActive
                            ? "font-medium text-[#3182ce] underline decoration-2 underline-offset-4"
                            : "text-[#d4d4d8] hover:bg-[#27272a]/80 hover:text-[#3182ce]",
                        )}
                        onClick={() => scrollToHash(item.hash, item.label)}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
