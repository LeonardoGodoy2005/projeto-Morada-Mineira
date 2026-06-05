"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/config/roles.config";
import { COMPANY } from "@/config/company.config";

export default function MobileNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = NAV_ITEMS[user.role] || [];

  return (
    <>
      {/* Mobile Top Header — barra compacta, prioridade é o conteúdo */}
      <header className="mobile-header mobile-only">
        <div className="mobile-header-brand">
          <div style={{
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <img src="/images/logo-simbolo.png" alt="Morada Mineira" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-primary)" }}>
            {COMPANY.name}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 999,
            background: "rgba(139,69,19,0.08)",
            fontSize: "0.75rem", fontWeight: 600, color: "var(--color-primary)",
          }}>
            {user.avatar_emoji}
            <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name.split(" ")[0]}
            </span>
          </span>
          <button
            onClick={logout}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.7rem", color: "var(--text-muted)", padding: "4px 6px",
              borderRadius: 6, fontWeight: 500,
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="mobile-nav mobile-only" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="mobile-nav-items">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`mobile-nav-link ${pathname === item.href ? "active" : ""}`}
                style={{ position: "relative" }}
              >
                {pathname === item.href && (
                  <span style={{
                    position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                    width: 24, height: 3, borderRadius: "0 0 3px 3px",
                    background: "var(--color-primary)", display: "block"
                  }} />
                )}
                <span className="mobile-nav-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
