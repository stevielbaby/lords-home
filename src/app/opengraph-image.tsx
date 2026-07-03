import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `Pre-order ${site.tagline} by ${site.author}`;
/** Vertical share card — poster orientation for iMessage / stories-style previews */
export const size = {
  width: 1080,
  height: 1920,
};
export const contentType = "image/png";
export const revalidate = 60;

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    },
  ).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match?.[1]) {
    throw new Error(`Failed to load font: ${family}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

function toDataUrl(bytes: Buffer, mime: string) {
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

type Doodle = {
  text: string;
  x: number;
  y: number;
  rotate: number;
  size: number;
  opacity?: number;
};

const doodles: Doodle[] = [
  { text: "IT IS SO", x: 48, y: 80, rotate: -8, size: 36 },
  { text: "HOME", x: 820, y: 100, rotate: 12, size: 34 },
  { text: "YES", x: 40, y: 280, rotate: -18, size: 42 },
  { text: "+", x: 960, y: 320, rotate: 0, size: 52 },
  { text: "NOW", x: 60, y: 480, rotate: 14, size: 30 },
  { text: "+", x: 920, y: 1400, rotate: -6, size: 44 },
  { text: "$", x: 50, y: 1500, rotate: 10, size: 48 },
  { text: "E", x: 120, y: 1620, rotate: -12, size: 44 },
  { text: "ARM", x: 180, y: 160, rotate: -4, size: 28 },
  { text: "KEY", x: 900, y: 560, rotate: 8, size: 28 },
  { text: "PEACE", x: 780, y: 1680, rotate: -10, size: 26 },
  { text: "O", x: 40, y: 700, rotate: 0, size: 36, opacity: 0.5 },
  { text: "X", x: 980, y: 1520, rotate: 25, size: 34 },
  { text: "YES", x: 860, y: 900, rotate: -14, size: 30 },
  { text: "NOW", x: 140, y: 1100, rotate: 8, size: 28 },
  { text: "HOME", x: 40, y: 1750, rotate: -6, size: 32 },
  { text: "IT IS SO", x: 800, y: 1780, rotate: 8, size: 28 },
];

export default async function Image() {
  const [displayFont, monoFont, bookCover] = await Promise.all([
    loadGoogleFont("Bebas Neue", 400),
    loadGoogleFont("IBM Plex Mono", 500),
    readFile(join(process.cwd(), "public/images/book-cover.png")),
  ]);

  const bookCoverSrc = toDataUrl(bookCover, "image/png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#d4d4d4",
          color: "#0a0a0a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.5) 0%, transparent 42%), radial-gradient(circle at 80% 75%, rgba(0,0,0,0.07) 0%, transparent 40%)",
          }}
        />

        {doodles.map((doodle) => (
          <div
            key={`${doodle.text}-${doodle.x}-${doodle.y}`}
            style={{
              position: "absolute",
              top: doodle.y,
              left: doodle.x,
              display: "flex",
              fontFamily: "Bebas Neue",
              fontSize: doodle.size,
              letterSpacing: "0.08em",
              color: "#0a0a0a",
              opacity: doodle.opacity ?? 0.88,
              transform: `rotate(${doodle.rotate}deg)`,
            }}
          >
            {doodle.text}
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            top: 200,
            left: 80,
            width: 64,
            height: 64,
            border: "4px solid #0a0a0a",
            borderRadius: 999,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 1480,
            left: 900,
            width: 48,
            height: 48,
            border: "4px solid #0a0a0a",
            borderRadius: 999,
            opacity: 0.65,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 1420,
            left: 960,
            width: 5,
            height: 52,
            backgroundColor: "#0a0a0a",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 1440,
            left: 938,
            width: 48,
            height: 5,
            backgroundColor: "#0a0a0a",
            opacity: 0.8,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 80,
            paddingBottom: 80,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Bebas Neue",
              fontSize: 168,
              lineHeight: 0.86,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#0a0a0a",
            }}
          >
            Pre-Order
          </div>

          {/* Highlighted book — elevated above the sketch field */}
          <div
            style={{
              display: "flex",
              position: "relative",
              marginTop: 36,
              marginBottom: 36,
              width: 420,
              height: 560,
              backgroundColor: "#0d0d0d",
              boxShadow:
                "0 48px 90px rgba(0,0,0,0.4), 0 18px 36px rgba(0,0,0,0.24)",
              border: "4px solid #0a0a0a",
              transform: "rotate(-1.5deg)",
            }}
          >
            <img
              src={bookCoverSrc}
              alt=""
              width={420}
              height={560}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Bebas Neue",
              fontSize: 168,
              lineHeight: 0.86,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#0a0a0a",
            }}
          >
            Today
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontFamily: "IBM Plex Mono",
              fontSize: 28,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#0a0a0a",
            }}
          >
            lordshome.co
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bebas Neue",
          data: displayFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "IBM Plex Mono",
          data: monoFont,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
