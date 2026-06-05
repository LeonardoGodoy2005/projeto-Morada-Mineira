"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/config/roles.config";
import { COMPANY } from "@/config/company.config";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = NAV_ITEMS[user.role] || [];

  return (
    <aside className="sidebar desktop-only">
      <div className="sidebar-header" style={{ background: "linear-gradient(135deg, rgba(139,69,19,0.04) 0%, rgba(212,165,116,0.08) 100%)" }}>
        <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/images/logo-simbolo.png" alt="Morada Mineira" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="sidebar-brand">
          <h2>{COMPANY.name}</h2>
          <p>{COMPANY.slogan}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
            style={pathname === item.href ? { background: "rgba(139, 69, 19, 0.1)", borderLeft: "3px solid var(--color-primary)", paddingLeft: "13px" } : {}}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ background: "rgba(139,69,19,0.05)", borderRadius: "var(--border-radius-sm)", padding: "12px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 36, height: 36, background: "rgba(139,69,19,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{user.avatar_emoji}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{user.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {user.role === "gerente" ? "Gerente" : "Funcionário"}
            </div>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm w-full"
          onClick={logout}
          onMouseEnter={e => e.currentTarget.style.color = "var(--color-danger)"}
          onMouseLeave={e => e.currentTarget.style.color = ""}
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
