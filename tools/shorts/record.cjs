// 指定したショートを1ループ分だけ録画して、縦長(1080x1920)のwebmにする(YouTube投稿用)
// 使い方: node tools/shorts/record.cjs <出力dir> <ショートの番号|id>
// 事前準備(初回のみ): npm i --no-save --legacy-peer-deps playwright && npx playwright install ffmpeg
// 録画は実時間。操作ボタン類は映さない。出典の短縮表記(.src)は映す。
// 動画の先頭は実時間とずれるので、ショートを止めた状態でマゼンタの目印を映し、
// 目印が消えて再生が始まるフレームを映像から探して、そこから1ループ分を切り出す。
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),os=require('os'),cp=require('child_process'),zlib=require('zlib');
const W=1080,H=1920,Z=W/480,SPEED=1.35,FPS=25; // 幅480pxの画面を Z 倍して1080幅にする。SPEED は app.js と合わせる
const msDir=path.join(process.env.LOCALAPPDATA||'','ms-playwright');
const ff=path.join(msDir,fs.readdirSync(msDir).find(d=>d.startsWith('ffmpeg-')),'ffmpeg-win64.exe');

// 1x1のPNGから色を読む(フィルタ0のRGB/RGBA前提。scale=1:1 で出したものだけに使う)
function pixel(file){
  const b=fs.readFileSync(file);let o=8,idat=[],ch=3;
  while(o<b.length){const n=b.readUInt32BE(o),t=b.toString('latin1',o+4,o+8);
    if(t==='IHDR')ch=b[o+17]===6?4:3;if(t==='IDAT')idat.push(b.subarray(o+8,o+8+n));o+=12+n}
  const raw=zlib.inflateSync(Buffer.concat(idat));return [raw[1],raw[2],raw[3]];
}
const isMarker=([r,g,bl])=>r>200&&g<60&&bl>200;

(async()=>{
  const [out,which]=process.argv.slice(2);
  if(!out||!which){console.log('usage: node record.cjs <outDir> <index|id>');process.exit(1)}
  fs.mkdirSync(out,{recursive:true});
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rec-'));
  const b=await chromium.launch({channel:'chrome'});
  const ctx=await b.newContext({viewport:{width:W,height:H},recordVideo:{dir:tmp,size:{width:W,height:H}}});
  const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(([z])=>{
    try{localStorage.setItem('cs-auto','false')}catch(e){}
    Object.defineProperty(window,'devicePixelRatio',{get:()=>z}); // canvas を細かく描かせる(app.js 側で上限2)
  },[Z]);
  await p.goto('file://'+path.resolve(__dirname,'../../public/shorts/index.html'));
  // 幅480pxの画面をそのまま Z 倍して映す。縦は 480x(1920/Z) になる
  await p.addStyleTag({content:`.phone{zoom:${Z};width:480px!important;height:${H/Z}px!important}.card{height:${H/Z}px!important}.rail,#auto,#hint,.pausemark{display:none!important}`});
  await p.waitForTimeout(600);
  const idx=await p.evaluate(w=>/^\d+$/.test(w)?+w:window.Shorts.cards.findIndex(c=>c.sc.id===w),which);
  if(idx<0){console.log('not found:',which);await b.close();process.exit(1)}
  const id=await p.evaluate(i=>window.Shorts.cards[i].sc.id,idx);
  const dur=await p.evaluate(i=>window.Shorts.cards[i].sc.dur,idx);
  // t=0 で止めて、目印を1.5秒映してから再生を始める
  await p.evaluate(i=>{document.getElementById('feed').style.scrollBehavior='auto';window.Shorts.seek(i,0);
    const d=document.createElement('div');d.id='mk';d.style.cssText='position:fixed;inset:0;background:#f0f;z-index:99999';document.body.appendChild(d)},idx);
  await p.waitForTimeout(1500);
  await p.evaluate(()=>document.getElementById('mk').remove());
  await p.keyboard.press('Space'); // 一時停止を解く
  await p.waitForTimeout(Math.ceil(dur/SPEED*1000)+1500);
  await ctx.close();await b.close();

  const raw=fs.readdirSync(tmp).filter(f=>f.endsWith('.webm')).map(f=>path.join(tmp,f))[0];
  const fr=path.join(tmp,'fr');fs.mkdirSync(fr);
  cp.execFileSync(ff,['-y','-i',raw,'-r',String(FPS),'-s','1x1',path.join(fr,'%05d.png')],{stdio:'ignore'});
  const files=fs.readdirSync(fr).sort();
  let last=-1;files.forEach((f,i)=>{if(isMarker(pixel(path.join(fr,f))))last=i});
  if(last<0){console.log('目印が映像に見つからない');process.exit(1)}
  const start=(last+1)/FPS;
  const dst=path.resolve(out,id+'.webm');
  cp.execFileSync(ff,['-y','-ss',String(start),'-i',raw,'-t',String(dur/SPEED),'-c:v','libvpx-vp9','-b:v','6M','-an',dst],{stdio:'ignore'});
  fs.rmSync(tmp,{recursive:true,force:true});
  console.log(dst);console.log('start(s):',start.toFixed(2),'errors:',errs);
})();
