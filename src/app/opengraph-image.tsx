import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `Pre-order ${site.tagline} by ${site.author}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
/** Bust crawler caches when the share card design changes */
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

/** Sketch marks — absolute placements on the light field */
const doodles: Doodle[] = [
  { text: "IT IS SO", x: 48, y: 28, rotate: -8, size: 28 },
  { text: "HOME", x: 980, y: 42, rotate: 12, size: 26 },
  { text: "YES", x: 36, y: 120, rotate: -18, size: 34 },
  { text: "+", x: 1080, y: 150, rotate: 0, size: 42 },
  { text: "NOW", x: 70, y: 200, rotate: 14, size: 24 },
  { text: "+", x: 1040, y: 430, rotate: -6, size: 36 },
  { text: "$", x: 54, y: 470, rotate: 10, size: 40 },
  { text: "E", x: 110, y: 520, rotate: -12, size: 36 },
  { text: "ARM", x: 200, y: 70, rotate: -4, size: 22 },
  { text: "KEY", x: 1040, y: 250, rotate: 8, size: 22 },
  { text: "PEACE", x: 900, y: 540, rotate: -10, size: 20 },
  { text: "O", x: 40, y: 300, rotate: 0, size: 30, opacity: 0.5 },
  { text: "X", x: 1100, y: 480, rotate: 25, size: 28 },
  { text: "YES", x: 980, y: 360, rotate: -14, size: 24 },
  { text: "NOW", x: 160, y: 400, rotate: 8, size: 22 },
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
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45) 0%, transparent 42%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.06) 0%, transparent 40%)",
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
            top: 90,
            left: 90,
            width: 54,
            height: 54,
            border: "3px solid #0a0a0a",
            borderRadius: 999,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 1020,
            width: 36,
            height: 36,
            border: "3px solid #0a0a0a",
            borderRadius: 999,
            opacity: 0.65,
          }}
        />
        {/* Cross doodle */}
        <div
          style={{
            position: "absolute",
            top: 430,
            left: 1080,
            width: 4,
            height: 40,
            backgroundColor: "#0a0a0a",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 446,
            left: 1064,
            width: 36,
            height: 4,
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
            paddingTop: 28,
            paddingBottom: 36,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Bebas Neue",
              fontSize: 132,
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
              marginTop: 8,
              marginBottom: 8,
              width: 248,
              height: 332,
              backgroundColor: "#0d0d0d",
              boxShadow:
                "0 36px 70px rgba(0,0,0,0.38), 0 14px 28px rgba(0,0,0,0.22)",
              border: "3px solid #0a0a0a",
              transform: "rotate(-1.5deg)",
            }}
          >
            <img
              src={bookCoverSrc}
              alt=""
              width={248}
              height={332}
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
              fontSize: 132,
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
              marginTop: 6,
              fontFamily: "IBM Plex Mono",
              fontSize: 22,
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
