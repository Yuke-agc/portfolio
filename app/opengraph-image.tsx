import { ImageResponse } from "next/og";
import { profile } from "@/lib/constants/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "#131315",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#d9a566",
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          PORTFOLIO
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, display: "flex" }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 32, color: "#9f9fa6", marginTop: 24, display: "flex" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
