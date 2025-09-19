// src/metrics/gemini-counter.ts
type Hit = { t: number };

// Sesuaikan bila kamu upgrade tier
const RPM_LIMIT = 5; // Gemini 2.5 Pro (Free)
const RPD_LIMIT = 100; // Gemini 2.5 Pro (Free)

const state = {
  rpm: [] as Hit[], // jejak request dalam 60 detik terakhir
  rpdCount: 0, // request per hari (PT)
  rpdDayKey: pacificDayKey(),
};

export function pacificDayKey(d = new Date()) {
  // Hari menurut Pacific Time (America/Los_Angeles)
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return f.format(d); // "YYYY-MM-DD"
}

function rollWindows(now = Date.now()) {
  // Bersihkan window RPM 60 detik
  const cutoff = now - 60_000;
  while (state.rpm.length && state.rpm[0].t < cutoff) state.rpm.shift();

  // Reset harian saat ganti hari di PT
  const key = pacificDayKey(new Date(now));
  if (key !== state.rpdDayKey) {
    state.rpdDayKey = key;
    state.rpdCount = 0;
  }
}

export function noteGeminiRequest() {
  const now = Date.now();
  rollWindows(now);
  state.rpm.push({ t: now });
  state.rpdCount += 1;
}

export function canSendGemini(): { ok: boolean; reason?: string } {
  rollWindows();
  if (state.rpm.length >= RPM_LIMIT)
    return { ok: false, reason: `RPM ${state.rpm.length}/${RPM_LIMIT}` };
  if (state.rpdCount >= RPD_LIMIT)
    return {
      ok: false,
      reason: `RPD ${state.rpdCount}/${RPD_LIMIT} (reset 00:00 PT)`,
    };
  return { ok: true };
}

export function getGeminiUsage() {
  rollWindows();
  return {
    rpmWindow: state.rpm.length,
    rpdCount: state.rpdCount,
    dayKeyPT: state.rpdDayKey,
    limits: { RPM_LIMIT, RPD_LIMIT },
  };
}
