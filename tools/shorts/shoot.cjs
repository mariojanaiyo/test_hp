// 指定したショートの指定時刻を撮影して横並びの画像にする(目視チェック用)
// 使い方: node tools/shorts/shoot.cjs <出力dir> <ショートの番号|id> <t1,t2,...>
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
(async()=>{
  const [out,which,times]=process.argv.slice(2);
  if(!out||!which||!times){console.log('usage: node shoot.cjs <outDir> <index|id> <t1,t2,...>');process.exit(1)}
  fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:780}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(__dirname,'../../public/shorts/index.html'));
  await p.waitForTimeout(600);
  const idx=await p.evaluate(w=>/^\d+$/.test(w)?+w:window.Shorts.cards.findIndex(c=>c.sc.id===w),which);
  if(idx<0){console.log('not found:',which);process.exit(1)}
  const files=[];
  for(const t of times.split(',').map(Number)){
    await p.evaluate(([i,t])=>window.Shorts.seek(i,t),[idx,t]);
    await p.waitForTimeout(700); // アニメーション(スタンプ等)が落ち着くのを待つ
    const f=path.join(out,`s${idx}_t${t}.png`);await p.screenshot({path:f});files.push(f);
  }
  console.log(files.join('\n'));console.log('errors:',errs);
  await b.close();
})();
