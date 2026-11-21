#!/bin/bash
# Randează toate formatele la 4K60 și pune sunetul (normalizat la -14 LUFS)
set -e
cd "$(dirname "$0")"
N=$(node -e "console.log(Math.ceil(42.042857*60))")
for AR in 916 45 11; do
  mkdir -p seg/$AR
  A=0; B=$((N/3)); C=$((2*N/3))
  AR=$AR node render.cjs $A $B seg/$AR/a.mp4 2 > seg/$AR/a.log 2>&1 &
  AR=$AR node render.cjs $B $C seg/$AR/b.mp4 2 > seg/$AR/b.log 2>&1 &
  AR=$AR node render.cjs $C $N seg/$AR/c.mp4 2 > seg/$AR/c.log 2>&1 &
  wait
  printf "file 'a.mp4'\nfile 'b.mp4'\nfile 'c.mp4'\n" > seg/$AR/list.txt
  ffmpeg -loglevel error -y -f concat -safe 0 -i seg/$AR/list.txt -c copy seg/$AR/video.mp4
  case $AR in 916) NAME="9x16-TikTok-Reels-Shorts";; 45) NAME="4x5-Instagram-Facebook-feed";; 11) NAME="1x1-patrat";; esac
  ffmpeg -loglevel error -y -i seg/$AR/video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11 -ar 48000 -c:a aac -b:a 320k -shortest -movflags +faststart "out/roby-media-Lansare-$NAME-4K60.mp4"
  echo "gata $AR"
done
