import React from "react";
import Link from "next/link";
import UserAvatar from "@/components/home/UserAvatar";
import Image from "next/image";
import { COLORS, FONT_FAMILY } from "@/utils/color";

const Navbar: React.FC = () => {
  return (
    <nav
      style={{
        width: "100%",
        height: 64,
        background: "#fff",
        boxShadow: "0 2px 8px #4320d120",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo on the left */}
       <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logos/logo-real.png" alt="IKnow Logo" width={50} height={50} style={{ marginRight: 8 }} />
          <span style={{ color: COLORS.primary, fontWeight: 700, fontFamily: FONT_FAMILY.poppins, fontSize: '1.25rem', letterSpacing: 0.5 }}>IKnow</span>
        </Link>
      </div>
      {/* User Avatar on the right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <UserAvatar />
      </div>
    </nav>
  );
};

export default Navbar;
