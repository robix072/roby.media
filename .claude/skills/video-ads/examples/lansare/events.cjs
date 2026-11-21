const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve('ad.html'));await p.evaluate(()=>window.ready);
const d=await p.evaluate(()=>({events:window.EVENTS,kicks:window.KICKS,bpm:window.BPM,duration:window.DURATION,song:window.SONG}));
fs.writeFileSync('events.json',JSON.stringify(d,null,1));console.log(d.events.length,'events',d.duration);await b.close()})();
