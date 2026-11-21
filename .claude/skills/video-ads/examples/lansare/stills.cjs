const {chromium}=require('playwright');const path=require('path');
(async()=>{const times=process.argv.slice(3).map(Number);const scale=+process.argv[2]||0.5;
const b=await chromium.launch({args:['--enable-gpu-rasterization','--ignore-gpu-blocklist']});const AR=process.env.AR||'916';const HH={916:1920,45:1350,11:1080}[AR];const p=await b.newPage({viewport:{width:1080,height:HH},deviceScaleFactor:scale});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+path.resolve('ad.html')+'?ar='+AR);await p.evaluate(()=>window.ready);
for(const t of times){await p.evaluate(t=>window.renderAt(t),t);await p.screenshot({path:`stills/${AR}_${t.toFixed(2)}.png`});}
console.log(errs.join('\n')||'ok');await b.close()})();
