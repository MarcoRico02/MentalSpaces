import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Nota: implementaci33n minimalista inspirada en el spec.
// No dependemos de Radix; usamos un overlay simple para el modo m3vil.

const SIDEBAR_COOKIE_NAME = "sidebar:state";

const SIDEBAR_WIDTH = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

type SidebarState = "expanded" | "collapsed";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarSide = "left" | "right";

type SidebarContextValue = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.substring(name.length + 1));
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();

    // En navegadores modernos, matchMedia soporta addEventListener.
    // Si no existe, hacemos un fallback seguro (sin depender de addListener typings).
    const anyMql = mql as MediaQueryList & {
      addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
      removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    };

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    if (typeof anyMql.addListener === "function") {
      anyMql.addListener(onChange as any);
      return () => anyMql.removeListener?.(onChange as any);
    }

    return;
  }, []);

  return isMobile;
}

export type SidebarProviderProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
}) => {
  const isMobile = useIsMobile();

  const cookieValue = typeof document !== "undefined" ? readCookie(SIDEBAR_COOKIE_NAME) : null;

  const resolvedDefaultOpen =
    typeof defaultOpen === "boolean"
      ? defaultOpen
      : cookieValue === "true"
        ? true
        : cookieValue === "false"
          ? false
          : true;

  const [_open, _setOpen] = useState<boolean>(resolvedDefaultOpen);
  const open = typeof openProp === "boolean" ? openProp : _open;

  const setOpen = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (typeof openProp !== "boolean") {
        _setOpen(next);
      }
      // Persistencia por 7 d3as (604800s)
      writeCookie(SIDEBAR_COOKIE_NAME, String(next), 60 * 60 * 24 * 7);
    },
    [onOpenChange, openProp],
  );

  const [openMobile, setOpenMobile] = useState(false);

  const state: SidebarState = open ? "expanded" : "collapsed";

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((v) => !v);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (modifier && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        className="group/sidebar-wrapper flex min-h-svh w-full text-sidebar-foreground"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar debe usarse dentro de <SidebarProvider>.");
  }
  return ctx;
}

export type SidebarProps = {
  children: React.ReactNode;
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
};

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      children,
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
    },
    ref,
  ) => {
    const { state, openMobile, setOpenMobile, isMobile } = useSidebar();

    if (isMobile) {
      return (
        <div>
          {/* Overlay tipo Sheet */}
          {openMobile && (
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpenMobile(false)}
                aria-label="Cerrar men33 del sidebar"
              />
              <div
                className={
                  "absolute inset-y-0 " +
                  (side === "left" ? "left-0" : "right-0") +
                  " w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground shadow-xl"
                }
                style={
                  {
                    "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                  } as React.CSSProperties
                }
              >
                <div className="h-full overflow-auto">{children}</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    const collapsibleAttr = state === "collapsed" ? collapsible : "";

    return (
      <div
        ref={ref as any}
        className="group peer hidden md:block"
        data-state={state}
        data-variant={variant}
        data-side={side}
        data-collapsible={collapsibleAttr}
      >
        {/* GAP element: empuja el layout y anima el ancho */}
        <div
          className={
            "relative h-svh transition-[width] duration-200 ease-linear " +
            (collapsible === "none"
              ? "w-[--sidebar-width]"
              : collapsible === "offcanvas"
                ? "group-data-[collapsible=offcanvas]:w-0 w-[--sidebar-width]"
                : "group-data-[state=collapsed]:w-[--sidebar-width-icon] w-[--sidebar-width]")
          }
        />

        {/* PANEL fijo */}
        <div
          className={
            "fixed inset-y-0 z-40 flex h-svh transition-all duration-200 ease-linear " +
            (side === "left" ? "left-0" : "right-0") +
            " " +
            (variant === "floating" || variant === "inset" ? "p-2" : "") +
            " " +
            (collapsible === "offcanvas" && state === "collapsed"
              ? side === "left"
                ? "left-[calc(var(--sidebar-width)*-1)]"
                : "right-[calc(var(--sidebar-width)*-1)]"
              : "")
          }
        >
          <div
            className={
              "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground " +
              (variant === "sidebar"
                ? side === "left"
                  ? "border-r border-sidebar-border"
                  : "border-l border-sidebar-border"
                : "rounded-lg border border-sidebar-border shadow") +
              " " +
              (collapsible === "icon" && state === "collapsed"
                ? "w-[--sidebar-width-icon]"
                : "")
            }
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export const SidebarInset = forwardRef<HTMLElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <main
        ref={ref}
        className={
          "flex min-h-svh w-full flex-1 flex-col bg-gray-50 " +
          // Estilos para variant=inset (reacciona al Sidebar via peer)
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm"
        }
      >
        {children}
      </main>
    );
  },
);

SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-4 ${className}`} {...props} />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const { state } = useSidebar();
    return (
      <div
        ref={ref}
        className={
          "flex-1 overflow-auto px-2 pb-4 " +
          (state === "collapsed" ? "md:overflow-hidden" : "") +
          ` ${className}`
        }
        {...props}
      />
    );
  },
);
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`p-4 ${className}`} {...props} />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarSeparator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({
  className = "",
  ...props
}) => (
  <hr className={`my-3 border-0 h-px bg-sidebar-border ${className}`} {...props} />
);

export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      className={
        "inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring " +
        className
      }
      onClick={(e) => {
        toggleSidebar();
        onClick?.(e);
      }}
      {...props}
    >
      {/* PanelLeft (lucide) sin depender de 33 UI: triangulo simple */}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 3v18" />
        <path d="M16 3H8" />
        <path d="M16 21H8" />
        <path d="M18 7h-2" />
        <path d="M18 12h-2" />
        <path d="M18 17h-2" />
      </svg>
      <span className="sr-only">Alternar sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarRail = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => {
    const { toggleSidebar, state } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => toggleSidebar()}
        className={
          "hidden sm:flex absolute top-0 h-full w-4 items-center justify-center " +
          (state === "collapsed" ? "cursor-e-resize" : "cursor-w-resize") +
          " " +
          className
        }
        {...props}
      >
        <span className="relative h-full w-px bg-transparent after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:-translate-x-1/2 after:bg-sidebar-border after:opacity-0 hover:after:opacity-100" />
        <span className="sr-only">Rail sidebar</span>
      </button>
    );
  },
);
SidebarRail.displayName = "SidebarRail";

export const SidebarMenu = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className = "", ...props }, ref) => (
    <ul ref={ref} className={`space-y-1 ${className}`} {...props} />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className = "", ...props }, ref) => (
    <li ref={ref} className={`relative ${className}`} {...props} />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  tooltip?: React.ReactNode;
};

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className = "", active, tooltip, children, ...props }, ref) => {
    const { state, isMobile } = useSidebar();
    const showTooltip = state === "collapsed" && !isMobile && !!tooltip;

    return (
      <div className="relative">
        <button
          ref={ref}
          data-active={active ? "true" : "false"}
          className={
            "peer/menu-button flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors " +
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring " +
            (active
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground") +
            " " +
            "group-data-[state=collapsed]:!size-8 group-data-[state=collapsed]:!p-2" +
            " " +
            className
          }
          {...props}
        >
          {children}
        </button>

        {showTooltip && (
          <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow">
            {tooltip}
          </div>
        )}
      </div>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuBadge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={
        "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-sidebar-accent px-2 py-0.5 text-xs text-sidebar-accent-foreground " +
        className
      }
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export type SidebarMenuActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  showOnHover?: boolean;
};

export const SidebarMenuAction = forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
  ({ className = "", showOnHover, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={
        "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring " +
        (showOnHover ? "opacity-0 peer-hover/menu-button:opacity-100" : "") +
        " " +
        className
      }
      {...props}
    />
  ),
);
SidebarMenuAction.displayName = "SidebarMenuAction";

export const SidebarMenuSub = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className = "", ...props }, ref) => (
    <ul
      ref={ref}
      className={
        "mt-1 space-y-1 border-l border-sidebar-border pl-3 group-data-[state=collapsed]:hidden " +
        className
      }
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={
      "flex w-full items-center rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " +
      className
    }
    {...props}
  />
));
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export const SidebarMenuSkeleton: React.FC<{ withIcon?: boolean }> = ({ withIcon }) => {
  const width = useMemo(() => {
    const min = 50;
    const max = 90;
    return Math.floor(min + Math.random() * (max - min));
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2">
      {withIcon && <div className="h-5 w-5 rounded bg-sidebar-border/40" />}
      <div className="h-4 rounded bg-sidebar-border/40" style={{ width: `${width}%` }} />
    </div>
  );
};
