import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

function buildCandidates(): string[] {
  const home = os.homedir();
  const candidates: string[] = [];

  if (process.platform === "win32") {
    const localAppData =
      process.env.LOCALAPPDATA ?? path.join(home, "AppData", "Local");

    candidates.push(
      path.join(localAppData, "Programs", "ffmpeg", "bin", "ffmpeg.exe"),
      // Chocolatey and Scoop shims
      "C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe",
      path.join(home, "scoop", "shims", "ffmpeg.exe"),
      "C:\\ffmpeg\\bin\\ffmpeg.exe"
    );
  } else {
    candidates.push(
      "/usr/bin/ffmpeg",
      "/usr/local/bin/ffmpeg",
      "/opt/homebrew/bin/ffmpeg",
      path.join(home, ".local/bin/ffmpeg")
    );
  }

  return candidates;
}

/**
 * `ffmpeg-static` is not a dependency of this project — it is an ~80MB download
 * on top of the Chromium that Puppeteer already pulls, and most machines have a
 * system ffmpeg. If someone installs it anyway (the easiest route on Windows),
 * use it.
 */
function fromFfmpegStatic(): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("ffmpeg-static");
    const resolved = typeof mod === "string" ? mod : mod?.default;
    if (typeof resolved === "string" && fs.existsSync(resolved)) return resolved;
  } catch {
    // Not installed — expected.
  }
  return null;
}

function probePath(): string | null {
  try {
    const cmd = process.platform === "win32" ? "where" : "command";
    const args = process.platform === "win32" ? ["ffmpeg"] : ["-v", "ffmpeg"];
    const result = spawnSync(cmd, args, {
      encoding: "utf-8",
      shell: process.platform !== "win32",
      timeout: 2000,
    });
    if (result.status === 0 && result.stdout) {
      const first = result.stdout.split(/\r?\n/).find((l) => l.trim());
      if (first && fs.existsSync(first.trim())) return first.trim();
    }
  } catch {
    // ignore
  }
  return null;
}

export function findFfmpegPath(): string | null {
  // An explicit FFMPEG_PATH is authoritative: if it is set but wrong, report
  // "not found" rather than silently encoding with some other binary, which
  // makes a typo here impossible to diagnose from the app.
  if (process.env.FFMPEG_PATH) {
    return fs.existsSync(process.env.FFMPEG_PATH)
      ? process.env.FFMPEG_PATH
      : null;
  }
  const fromStatic = fromFfmpegStatic();
  if (fromStatic) return fromStatic;
  for (const candidate of buildCandidates()) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return probePath();
}

export function getFfmpegPath(): string {
  const found = findFfmpegPath();
  if (found) return found;
  if (process.env.FFMPEG_PATH) {
    throw new Error(
      `FFMPEG_PATH is set to "${process.env.FFMPEG_PATH}" but no file exists there. Fix or remove it in .env.local.`
    );
  }
  throw new Error(
    "ffmpeg not found. Install it (macOS: brew install ffmpeg, Debian/Ubuntu: apt install ffmpeg, Windows: choco install ffmpeg) or set FFMPEG_PATH in .env.local"
  );
}

export function isFfmpegAvailable(): boolean {
  return findFfmpegPath() !== null;
}
