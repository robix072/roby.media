---
name: video-ads
description: Know-how for making short motion-graphics video ads and product animations rendered from browser pages (2D canvas, WebGL2 panels, three.js): story beats, camera, shape-morph transitions, text animation, 3D UI panels, sound design and music synced to events, voiceover scripts, ending an ad into real footage, and known pitfalls. Use when planning, building, rendering, reviewing or giving notes on a video ad, explainer, logo animation, sound design or VO/music for one.
---

# Video ads

Read the reference that matches the task before starting. Apply `style-rules.md` to every ad, and check
`pitfalls.md` before rendering.

| Task | Read |
|---|---|
| Story, camera, transitions, text, framing, end card, feel | `references/style-rules.md` |
| 3D UI panels in space (gl3d.js) or real models (three.js) | `references/engine-3d.md` |
| SFX synced to events, voiceover script, Suno music prompts | `references/sound-and-music.md` |
| Ending the animation on the first frame of a real clip | `references/into-footage.md` |
| Something looks or renders wrong | `references/pitfalls.md` |

## Missing pieces

These guides came from a larger toolkit. The tools they name are **not in this repo**: `scripts/gl3d.js`,
`render.mjs`, `templates/template-3d.html`, `mix.py`, `synth_sfx.py`, `compose_into_clip.py`, `tracks.py`, and the
guides `blender.md` and `engine-2d-puppet.md`. Ask the user for them before relying on them; otherwise build the
equivalent (e.g. a page with a deterministic `renderAt(t)` captured frame by frame with Playwright, then ffmpeg).

## Ground rules

- Use only assets, footage, fonts, music and models the user owns or is licensed to use.
- Spec ads for other brands: small disclaimer at the end, never claim to be the brand or reuse its campaign lines.
- Generate voice or music on paid services (ElevenLabs, Suno) only when the user asks; it spends their credits.
