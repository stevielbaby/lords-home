import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.tagline} — a book by ${site.author}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    {
      headers: {
        // Request TTF/OTF so Satori can parse the font.
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

export default async function Image() {
  const [displayFont, monoFont, atmosphere, bookCover] = await Promise.all([
    loadGoogleFont("Bebas Neue", 400),
    loadGoogleFont("IBM Plex Mono", 400),
    readFile(join(process.cwd(), "public/images/og-atmosphere.jpg")),
    readFile(join(process.cwd(), "public/images/og-book-cover.jpg")),
  ]);

  const atmosphereSrc = toDataUrl(atmosphere, "image/jpeg");
  const bookCoverSrc = toDataUrl(bookCover, "image/jpeg");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0a0a",
          color: "#f5f0e8",
          overflow: "hidden",
        }}
      >
        {/* Atmosphere */}
        <img
          src={atmosphereSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.38,
          }}
        />

        {/* Gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 48%, rgba(10,10,10,0.88) 100%)",
          }}
        />

        {/* Warm accent glow */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -40,
            width: 520,
            height: 520,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(196,165,116,0.18) 0%, rgba(196,165,116,0) 68%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "56px 64px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Copy column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              width: 680,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "IBM Plex Mono",
                fontSize: 20,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.62)",
              }}
            >
              {site.name} · {site.launchDate}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Bebas Neue",
                  fontSize: 118,
                  lineHeight: 0.9,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#f5f0e8" }}>Property</span>
                <span style={{ color: "#c4a574" }}>of Yahweh</span>
              </div>

              <div
                style={{
                  marginTop: 28,
                  maxWidth: 520,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 24,
                  lineHeight: 1.45,
                  color: "rgba(245,240,232,0.72)",
                }}
              >
                {site.shareDescription}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "IBM Plex Mono",
                  fontSize: 20,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(245,240,232,0.78)",
                }}
              >
                {site.author}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "IBM Plex Mono",
                  fontSize: 18,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#c4a574",
                }}
              >
                lordshome.co
              </div>
            </div>
          </div>

          {/* Book cover */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 292,
              height: 390,
              marginRight: 12,
              boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
              border: "1px solid rgba(245,240,232,0.16)",
              backgroundColor: "#0d0d0d",
              transform: "rotate(-2deg)",
            }}
          >
            <img
              src={bookCoverSrc}
              alt=""
              width={292}
              height={390}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 8,
                bottom: 8,
                left: -6,
                width: 10,
                background:
                  "linear-gradient(90deg, #000000 0%, #1c1c1c 50%, #111111 100%)",
              }}
            />
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
          weight: 400,
        },
      ],
    },
  );
}
