"""Instrumental trap 140 BPM (Fa minor) + efecte sonore, sincronizate cu events.json din pagină.
Totul e sintetizat aici: fără sample-uri externe, fără drepturi de terți.
Ieșire: music.wav, sfx.wav, mix.wav (48 kHz, stereo)."""
import json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(7)
ev = json.load(open("events.json"))
BPM = ev["bpm"]
BEAT = 60 / BPM
DUR = ev["duration"] + 0.6
N = int(DUR * SR)
E = {e["name"]: e["t"] for e in ev["events"]}
SONG = ev["song"]
BARS, DEND = SONG["bars"], SONG["drumsEnd"]


def T(bar, beat=0.0):
    return (bar * 4 + beat) * BEAT


def bus():
    return np.zeros((N, 2))


def place(b, sig, t, gain=1.0, pan=0.0):
    """Pune un semnal mono sau stereo pe bus la timpul t (secunde)."""
    i = int(round(t * SR))
    if i >= N or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], 1)
    s0 = max(0, -i)
    i0 = max(i, 0)
    n = min(len(sig) - s0, N - i0)
    b[i0:i0 + n] += sig[s0:s0 + n] * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def filt(x, kind, f, order=2):
    sos = butter(order, f, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def osc(freq, d):
    f = np.broadcast_to(freq, (int(d * SR),)) if np.ndim(freq) == 0 else freq
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def reverb(x, sec=2.2, wet=0.3, hp=300):
    ir_t = tt(sec)
    ir = rng.standard_normal((len(ir_t), 2)) * np.exp(-ir_t / (sec / 5))[:, None]
    ir = filt(ir, "highpass", hp)
    ir /= np.sqrt((ir ** 2).sum(0))
    out = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], 1)
    return x * (1 - wet) + out * wet * 1.6


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


# ------------------------------------------------------------------ instrumente
def kick(d=0.32):
    t = tt(d)
    f = 48 + 120 * np.exp(-t / 0.035)
    s = osc(f, d) * np.exp(-t / 0.13)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.004) * 0.35
    return np.tanh((s + click) * 2.2) * 0.9


def b808(note, d, glide_from=None):
    t = tt(d)
    f0 = midi(note)
    f = np.full(len(t), f0)
    if glide_from is not None:
        f = midi(glide_from) + (f0 - midi(glide_from)) * (1 - np.exp(-t / 0.06))
    f = f * (1 + 0.9 * np.exp(-t / 0.02))
    s = osc(f, d)
    s = np.tanh(s * 2.6) * 0.75
    env = np.minimum(1, t / 0.004) * np.exp(-t / (d * 0.55))
    rel = np.minimum(1, (d - t) / 0.03)
    return filt(s * env * rel, "lowpass", 900)


def clap():
    d = 0.5
    t = tt(d)
    n = rng.standard_normal(len(t))
    env = np.zeros(len(t))
    for k, o in enumerate([0, 0.011, 0.022, 0.034]):
        m = t >= o
        env[m] += np.exp(-(t[m] - o) / (0.008 if k < 3 else 0.16))
    s = filt(n * env, "bandpass", [900, 7000])
    snap = osc(np.full(len(t), 190.0), d) * np.exp(-t / 0.05) * 0.5
    return s * 0.8 + snap


def hat(open_=False, pitch=1.0):
    d = 0.32 if open_ else 0.06
    t = tt(d)
    n = rng.standard_normal(len(t))
    metal = sum(np.sign(osc(np.full(len(t), f * pitch), d)) for f in (3200, 4570, 5310, 6890)) * 0.2
    s = filt(n * 0.7 + metal, "highpass", 7000, 3)
    return s * np.exp(-t / (0.09 if open_ else 0.013)) * 0.5


def bell(note, d=1.6):
    t = tt(d)
    f = midi(note)
    mod = osc(np.full(len(t), f * 3.5), d) * 2.2 * np.exp(-t / 0.25)
    s = np.sin(2 * np.pi * f * t + mod)
    s += 0.35 * np.sin(2 * np.pi * f * 2 * t)
    return s * np.exp(-t / 0.55) * np.minimum(1, t / 0.002) * 0.35


def pad(notes, d):
    t = tt(d)
    s = np.zeros(len(t))
    for n in notes:
        for det in (-0.12, 0.0, 0.12):
            ph = (midi(n) * 2 ** (det / 12) * t + rng.random()) % 1
            s += 2 * ph - 1
    s = filt(s / (len(notes) * 3), "lowpass", 1400, 2)
    env = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.6)
    return s * env * 0.5


def noise_sweep(d, f0, f1, rev=False):
    t = tt(d)
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    blocks = 40
    for k in range(blocks):
        a, b = k * len(t) // blocks, (k + 1) * len(t) // blocks
        fc = f0 * (f1 / f0) ** (k / blocks)
        out[a:b] = filt(n, "bandpass", [fc * 0.6, min(fc * 1.6, 20000)])[a:b]
    env = (t / d) ** 2
    return out * env * (1.0 if not rev else 1.0)


def whoosh(d=0.45, up=True):
    t = tt(d)
    n = rng.standard_normal(len(t))
    lo = filt(n, "bandpass", [400, 3000])
    hi = filt(n, "bandpass", [2000, 9000])
    x = t / d
    shape = np.sin(np.pi * x) ** 2
    mixk = x if up else 1 - x
    return (lo * (1 - mixk) + hi * mixk) * shape * 0.5


def pop(f=900, d=0.09):
    t = tt(d)
    fr = f * (1 + 1.5 * np.exp(-t / 0.008))
    return osc(fr, d) * np.exp(-t / 0.025) * 0.6


def click(f=2400):
    d = 0.03
    t = tt(d)
    return (osc(np.full(len(t), f), d) * 0.6 + rng.standard_normal(len(t)) * 0.3) * np.exp(-t / 0.005)


def impact(d=2.4):
    t = tt(d)
    sub = osc(38 + 60 * np.exp(-t / 0.08), d) * np.exp(-t / 0.7)
    nz = filt(rng.standard_normal(len(t)), "lowpass", 5000) * np.exp(-t / 0.35) * 0.4
    return np.tanh((sub + nz) * 1.8) * 0.8


# ------------------------------------------------------------------ muzica
drums, bass, keys, fx = bus(), bus(), bus(), bus()
PROG = [(53, [65, 68, 72]), (49, [61, 65, 68]), (46, [58, 61, 65]), (48, [60, 64, 67])]   # Fm Db Bbm C
ARP = [0, 2, 1, 2, 0, 1, 2, 1]

for bar in range(BARS):
    root, ch = PROG[(bar // 2) % 4]
    # clopoțeii (melodia) pe optimi, toată piesa; mai rari în intro
    for k in range(8):
        if bar < 2 and k % 2:
            continue
        if bar >= DEND and k > 3:
            continue
        n = ch[ARP[k]] + 12 + (12 if (bar % 4 == 3 and k == 7) else 0)
        place(keys, bell(n), T(bar, k * 0.5), 0.5 if bar >= 2 else 1.5, pan=(-0.35 if k % 2 else 0.35))
    if bar % 2 == 0:
        place(keys, pad(ch, BEAT * 8 + 0.3), T(bar), 0.35 if bar >= 2 else 1.4)
    if 2 <= bar < DEND:
        # tobe
        place(drums, clap(), T(bar, 2), 0.75)
        for k in range(8):
            place(drums, hat(pitch=1 + 0.03 * (k % 3)), T(bar, k * 0.5), 0.35 if k % 2 else 0.5, pan=0.2)
        if bar % 2 == 1:
            for k in range(6):
                place(drums, hat(pitch=1.08), T(bar, 3) + k * BEAT / 6, 0.22 + 0.04 * k, pan=0.25)
        if bar % 4 == 2:
            place(drums, hat(True), T(bar, 1.5), 0.35, pan=-0.2)
        # 808 pe kick-uri
        hits = [0, 2.5] + ([3.5] if bar % 2 else [])
        for j, b in enumerate(hits):
            nxt = hits[j + 1] if j + 1 < len(hits) else 4
            note = root - 12 + (7 if (b == 3.5) else 0)
            place(bass, b808(note, (nxt - b) * BEAT, glide_from=(root - 12) if b == 3.5 else None), T(bar, b), 0.9)
# kick-urile exact din pagină
for k in ev["kicks"]:
    place(drums, kick(), k, 0.85)
# rulare de 32-imi înainte de drop și înainte de card
for start in (T(1, 3), SONG["pkgRise"]):
    for k in range(8):
        place(drums, hat(pitch=1.1), start + k * BEAT / 8, 0.15 + 0.04 * k, pan=0.15)
# outro: un 808 lung și clopoțeii
place(bass, b808(53 - 12, BEAT * 8), T(DEND), 0.8)
place(fx, impact(), T(2), 0.9)
place(fx, noise_sweep(BEAT * 4, 300, 9000), T(1), 0.35)
place(fx, noise_sweep(BEAT * 2, 500, 9000), SONG["pkgRise"] - BEAT, 0.25)
place(fx, impact(3.0), T(BARS), 0.7)

keys = reverb(keys, 2.6, 0.38)
# ducking ușor pe kick, ca 808-ul și clopoțeii să respire
duck = np.ones(N)
for k in ev["kicks"]:
    i = int(k * SR)
    seg_ = np.arange(min(int(0.18 * SR), N - i))
    duck[i:i + len(seg_)] = np.minimum(duck[i:i + len(seg_)], 0.55 + 0.45 * (seg_ / len(seg_)))
music = drums * 0.95 + (bass * 0.62 + keys * 0.6) * duck[:, None] + fx * 0.8

# ------------------------------------------------------------------ efecte sonore pe evenimente
sfx = bus()
for name, t in E.items():
    if name.startswith(("hook.", "list.")):
        place(sfx, pop(220, 0.16), t, 1.4)
        place(sfx, click(3000), t, 0.25)
    elif name == "logo.wipe":
        place(sfx, whoosh(0.4), t, 0.4)
    elif name == "logo.rec":
        place(sfx, pop(1400, 0.12), t, 0.45)
    elif name == "dot.grow":
        w = whoosh(E["mac.reveal"] - t, up=True)
        place(sfx, w, t, 0.6)
    elif name == "mac.reveal":
        place(sfx, whoosh(0.9, up=False), t, 0.35)
    elif name.startswith("site."):
        k = int(name.split(".")[1])
        place(sfx, pop(700 + 60 * k), t, 0.35, pan=-0.2 + 0.08 * k)
    elif name.startswith("scroll."):
        place(sfx, whoosh(0.32), t - 0.05, 0.35)
    elif name == "form.send":
        place(sfx, pop(1100, 0.12), t, 0.5)
        place(sfx, pop(1650, 0.12), t + 0.07, 0.4)
    elif name.startswith("clip."):
        if name in ("clip.toSlot",):
            place(sfx, whoosh(0.85), t, 0.45)
        elif name == "clip.land":
            place(sfx, click(1500), t, 0.5)
        else:
            k = int(name.split(".")[1])
            place(sfx, pop(600 + 90 * k, 0.1), t, 0.5, pan=[0, -0.3, 0.3, -0.6, 0.6][k])
    elif name.startswith("caption."):
        place(sfx, click(2600), t, 0.25)
    elif name in ("pixel", "toggle.1", "toggle.2"):
        place(sfx, click(2000 if name == "pixel" else 1600), t, 0.45)
    elif name.startswith("toast."):
        k = int(name.split(".")[1])
        place(sfx, pop(900 + 120 * k), t, 0.4, pan=0.3)
    elif name == "pkg.rise":
        place(sfx, whoosh(E["pkg.land"] - t + 0.05), t, 0.55)
    elif name == "pkg.land":
        place(sfx, impact(1.2), t, 0.35)
    elif name.startswith("tick."):
        k = int(name.split(".")[1])
        place(sfx, pop(880 * 2 ** (k * 3 / 12), 0.12), t, 0.5)
    elif name == "pkg.morph":
        place(sfx, whoosh(0.6, up=False), t, 0.4)
    elif name == "crm.window":
        place(sfx, whoosh(0.4, up=False), t - 0.1, 0.3)
    elif name.startswith("lead.in."):
        k = int(name.split(".")[2])
        place(sfx, pop(1000 + 110 * k, 0.1), t, 0.45, pan=-0.3 + 0.2 * k)
    elif name.startswith("lead.move."):
        place(sfx, whoosh(0.3), t - 0.04, 0.25)
        place(sfx, click(2200), t + 0.3, 0.3)
    elif name == "lead.won":
        place(sfx, pop(1320, 0.14), t + 0.25, 0.5)
        place(sfx, pop(1980, 0.14), t + 0.32, 0.4)
    elif name == "logo2":
        place(sfx, pop(300, 0.2), t, 0.6)

sfx = reverb(sfx, 1.2, 0.18, 500)

# ------------------------------------------------------------------ export
fade = np.ones(N)
nf = int(0.5 * SR)
fade[-nf:] = np.linspace(1, 0, nf)
for name, x in (("music", music), ("sfx", sfx), ("mix", music + sfx * 0.85)):
    y = x * fade[:, None]
    y = y / (np.abs(y).max() + 1e-9) * 0.89
    wavfile.write(f"{name}.wav", SR, (y * 32767).astype(np.int16))
print("ok", DUR)
