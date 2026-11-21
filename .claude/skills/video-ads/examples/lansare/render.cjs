// node render.cjs <cadru_start> <cadru_final_exclusiv> <ieșire.mp4> [scale]
const {chromium}=require('playwright');const path=require('path');const {spawn}=require('child_process');
(async()=>{const [a,b]=[+process.argv[2],+process.argv[3]];const out=process.argv[4];const scale=+(process.argv[5]||2);
const AR=process.env.AR||'916';const HH={916:1920,45:1350,11:1080}[AR];const br=await chromium.launch({args:['--enable-gpu-rasterization','--ignore-gpu-blocklist','--force-color-profile=srgb']});
const p=await br.newPage({viewport:{width:1080,height:HH},deviceScaleFactor:scale});
await p.goto('file://'+path.resolve('ad.html')+'?ar='+AR);await p.evaluate(()=>window.ready);
const fps=await p.evaluate(()=>window.FPS);
const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','png','-i','-',
 '-c:v','libx264','-preset','medium','-crf','14','-pix_fmt','yuv420p','-profile:v','high','-level','5.2','-r',String(fps),out],{stdio:['pipe','inherit','inherit']});
const t0=Date.now();
for(let f=a;f<b;f++){await p.evaluate(t=>window.renderAt(t),f/fps);const buf=await p.screenshot({type:'png'});
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
 if((f-a)%60===0)console.log(out,f,((Date.now()-t0)/(f-a+1)).toFixed(0)+'ms/cadru');}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();console.log('gata',out,((Date.now()-t0)/1000).toFixed(0)+'s')})();
