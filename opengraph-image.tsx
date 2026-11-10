import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const alt = "Second Tour — le rappel qui fait revenir tes clients";
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
          justifyContent: "space-between",
          background: "#f5efe3",
          color: "#18211d",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 38, fontWeight: 700 }}>{SITE.name}</div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              width: 160,
              height: 12,
              background: "#c4381f",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {SITE.headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#fbf8f1",
            background: "#1f3b30",
            padding: "16px 28px",
            alignSelf: "flex-start",
          }}
        >
          3 questions, c&apos;est gratuit
        </div>
      </div>
    ),
    size
  );
}
