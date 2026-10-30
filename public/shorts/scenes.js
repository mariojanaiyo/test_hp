(function(){
'use strict';
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,t)=>a+(b-a)*t;
const sm=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x)};
const wrap=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function glow(c,x,y,r,rgb,a){
  const g=c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,'rgba('+rgb+','+a+')');g.addColorStop(1,'rgba('+rgb+',0)');
  c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
}
function vgrad(c,x,y,w,h,stops){
  const g=c.createLinearGradient(0,y,0,y+h);
  stops.forEach(s=>g.addColorStop(s[0],s[1]));
  c.fillStyle=g;c.fillRect(x,y,w,h);
}
function lerpColor(a,b,t){return 'rgb('+a.map((v,i)=>Math.round(mix(v,b[i],t))).join(',')+')'}
function polyAt(pts,u){
  u=clamp(u);let L=0;const seg=[];
  for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
  let d=u*L;
  for(let i=0;i<seg.length;i++){
    if(d<=seg[i]||i===seg.length-1){const f=seg[i]?d/seg[i]:0;return[mix(pts[i][0],pts[i+1][0],f),mix(pts[i][1],pts[i+1][1],f)]}
    d-=seg[i];
  }
}
function stars(c,W,H,s,t,h){
  s.forEach(p=>{if(p.y>h)return;c.fillStyle='rgba(255,255,255,'+(0.25+0.45*Math.sin(t*p.f+p.p)**2)+')';c.fillRect(p.x,p.y,p.s,p.s)});
}
function mkStars(n,W,H,seed){const r=rng(seed);return Array.from({length:n},()=>({x:r()*W,y:r()*H,s:r()<.15?2:1,f:1+r()*2,p:r()*6}))}
function txt(c,s,x,y,size,color,align,weight){
  c.font=(weight||700)+' '+size+'px "Noto Sans JP",sans-serif';c.fillStyle=color;c.textAlign=align||'left';c.textBaseline='middle';c.fillText(s,x,y);
}

// ---- 動物シルエット ----
function elk(c,x,y,sc,dir,ph,head,col){
  c.save();c.translate(x,y);c.scale(sc*dir,sc);
  c.strokeStyle=col;c.fillStyle=col;c.lineWidth=1.7;c.lineCap='round';c.shadowColor=col;c.shadowBlur=7;
  c.beginPath();c.ellipse(0,-14,12,6,0,0,TAU);c.fill();
  [[-8,0],[-4,1.6],[5,3.2],[9,4.8]].forEach(l=>{const sw=Math.sin(ph+l[1])*3;c.beginPath();c.moveTo(l[0],-10);c.lineTo(l[0]+sw,0);c.stroke()});
  const hx=mix(17,21,head),hy=mix(-27,-6,head);
  c.beginPath();c.moveTo(9,-17);c.lineTo(hx,hy);c.stroke();
  c.beginPath();c.ellipse(hx+2,hy,3.6,2.4,head*0.9,0,TAU);c.fill();
  if(head<0.6){c.lineWidth=1.2;c.beginPath();c.moveTo(hx,hy-2);c.lineTo(hx-3,hy-9);c.moveTo(hx-1.5,hy-5.5);c.lineTo(hx+2,hy-9);c.moveTo(hx-3,hy-9);c.lineTo(hx-6,hy-8);c.stroke()}
  c.restore();
}
function wolf(c,x,y,sc,dir,ph,col){
  c.save();c.translate(x,y);c.scale(sc*dir,sc);
  c.strokeStyle=col;c.fillStyle=col;c.lineWidth=1.8;c.lineCap='round';c.shadowColor=col;c.shadowBlur=9;
  c.beginPath();c.ellipse(0,-10,11,4.6,0,0,TAU);c.fill();
  [[-7,0],[-3,2],[5,3.5],[9,5.5]].forEach(l=>{const sw=Math.sin(ph*1.4+l[1])*4;c.beginPath();c.moveTo(l[0],-7);c.lineTo(l[0]+sw,0);c.stroke()});
  c.beginPath();c.moveTo(-11,-11);c.quadraticCurveTo(-18,-12,-19,-5);c.stroke();
  c.beginPath();c.ellipse(13,-14,4.2,3.4,0,0,TAU);c.fill();
  c.beginPath();c.moveTo(16,-15);c.lineTo(22,-12.5);c.lineTo(16,-12);c.fill();
  c.beginPath();c.moveTo(11,-16);c.lineTo(12,-21);c.lineTo(14,-17);c.fill();
  c.shadowBlur=0;c.fillStyle='#ff5a4a';c.beginPath();c.arc(15,-14.5,1,0,TAU);c.fill();
  c.restore();
}
function tree(c,x,y,h,g){
  const hh=h*(0.28+0.72*g);
  c.strokeStyle='rgb(120,92,62)';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-hh);c.stroke();
  const r=hh*0.36*g+2;
  c.globalCompositeOperation='lighter';glow(c,x,y-hh,r*2.4,'110,255,170',0.32*g);c.globalCompositeOperation='source-over';
  c.fillStyle='hsl('+mix(55,128,g)+','+mix(22,58,g)+'%,'+mix(30,38,g)+'%)';
  c.beginPath();c.ellipse(x,y-hh,r,r*1.25,0,0,TAU);c.fill();
}

const S=[];

// 1 ─────────── オオカミと川 ───────────
S.push({
  id:'wolf',pin:{t:17,text:'川が曲がった！'},hook:['オオカミが帰ると、','川が曲がりはじめた'],tag:'栄養カスケード',dur:26,
  title:'オオカミが戻ると、川の形まで変わった？',
  beats:[
    {t:0,text:'1995年、<b>オオカミ</b>を森に戻した'},
    {t:5,text:'エルクが川辺を<b>避けはじめた</b>'},
    {t:10,text:'木が育ち、<b>ビーバー</b>も帰還'},
    {t:17,text:'岸が固まり、<b>川がくねりだす</b>'},
    {t:22,text:'捕食者1種が<b>風景を変えたと言われる</b>'}
  ],
  more:'1995年、米イエローストーン国立公園にオオカミが再導入されました。エルクが川辺の若木を食べ尽くさなくなり、ヤナギやポプラが回復。それに伴ってビーバーや鳴き鳥が増え、河岸が安定した——という「栄養カスケード(捕食者が食物網を何段も伝って影響する現象)」の代表例として知られています。',
  caveat:'「川の形まで変わった」という話はSNSで広まった単純化で、実際は気候・干ばつ・エルク駆除・ハンターなど他の要因と絡み、効果の大きさは研究者の間でも議論が続いています。動画は「こういう連鎖が起きうる」という直感のための模式図です。',
  source:{short:'Ripple & Beschta 2012, Biol. Conserv.',cite:'Ripple, W.J. & Beschta, R.L. (2012). Trophic cascades in Yellowstone: The first 15 years after wolf reintroduction. Biological Conservation, 145, 205–213.',query:'Trophic cascades in Yellowstone: The first 15 years after wolf reintroduction'},
  init(W,H){const r=rng(11);return{
    st:mkStars(50,W,H*0.3,3),
    trees:Array.from({length:11},(_,i)=>({x:10+i*33+r()*12,h:46+r()*28,y:(i%3)*5,d:r()*4})),
    ff:Array.from({length:26},()=>({x:r()*360,y:r(),f:.5+r()*1.5,p:r()*6}))}},
  draw(c,t,W,H,s){
    const gy=H*0.5,ry=H*0.575;
    vgrad(c,0,0,W,H,[[0,'#0b1a2e'],[0.3,'#1e4a5c'],[0.5,'#d9a066'],[0.51,'#17301f'],[1,'#07130d']]);
    stars(c,W,H,s.st,t,H*0.25);
    // 遠い丘
    c.fillStyle='#14303a';c.beginPath();c.moveTo(0,gy);
    for(let x=0;x<=W;x+=10)c.lineTo(x,gy-26-18*Math.sin(x*0.018+1)-9*Math.sin(x*0.05));
    c.lineTo(W,gy);c.fill();
    c.fillStyle='#0f2a22';c.beginPath();c.moveTo(0,gy+3);
    for(let x=0;x<=W;x+=10)c.lineTo(x,gy-8-9*Math.sin(x*0.03+3));
    c.lineTo(W,gy+3);c.fill();
    // 地面
    vgrad(c,0,gy,W,ry-gy+4,[[0,'#16331f'],[1,'#1d4a2a']]);
    // 川
    const wid=mix(7,17,sm(t,13,23)),amp=mix(0,6,sm(t,14,24));
    c.beginPath();c.moveTo(0,ry);
    for(let x=0;x<=W;x+=8)c.lineTo(x,ry-wid*0.5+amp*Math.sin(x*0.03));
    for(let x=W;x>=0;x-=8)c.lineTo(x,ry+wid+amp*Math.sin(x*0.03));
    c.closePath();
    vgrad(c,0,ry-10,W,wid+20,[[0,'#2c7fa0'],[1,'#0f4a6c']]);
    c.save();c.beginPath();c.moveTo(0,ry);
    for(let x=0;x<=W;x+=8)c.lineTo(x,ry-wid*0.5+amp*Math.sin(x*0.03));
    for(let x=W;x>=0;x-=8)c.lineTo(x,ry+wid+amp*Math.sin(x*0.03));
    c.closePath();c.clip();
    c.strokeStyle='rgba(180,235,255,.35)';c.lineWidth=1;
    for(let i=0;i<8;i++){const x=((i*53+t*18)%(W+40))-20;c.beginPath();c.moveTo(x,ry+2+i%3*3);c.lineTo(x+14,ry+2+i%3*3);c.stroke()}
    c.restore();
    // 木の成長(ヤナギ)
    const g=0.1+0.9*sm(t,8,18);
    s.trees.forEach(tr=>tree(c,tr.x,gy+6+tr.y,tr.h,clamp(g*(1.1-tr.d*0.06))));
    // エルク
    const away=sm(t,4.5,10);
    [[60,0],[105,1.7],[150,3.3]].forEach((e,i)=>{
      const x=mix(e[0],250+i*34,away),y=gy+16+i*2-away*5;
      const head=mix(1,0.15+0.1*Math.sin(t*2+i),sm(t,4,6));
      const graze=head>0.6?Math.sin(t*5+i)*0.12:0;
      elk(c,x,y,mix(1,0.85,away),1,t*7*(away>0&&away<1?1:0)+e[1],clamp(head+graze),'rgb(255,222,170)');
    });
    // オオカミ
    const wx=mix(-40,380,sm(t,0.5,9));
    if(wx<370)wolf(c,wx,gy+22,1.15,1,t*9,'rgb(170,205,255)');
    // ビーバー
    if(t>12){
      const a=sm(t,12,16),bx=130+20*Math.sin(t*0.8);
      c.globalAlpha=a;c.fillStyle='#8b5a34';c.beginPath();c.ellipse(bx,ry+4,7,3.5,0,0,TAU);c.fill();
      c.beginPath();c.arc(bx+7,ry+3,2.5,0,TAU);c.fill();
      c.strokeStyle='rgba(180,235,255,.5)';c.lineWidth=1;
      for(let k=0;k<2;k++){const r=((t*8+k*6)%12);c.globalAlpha=a*(1-r/12);c.beginPath();c.ellipse(bx,ry+5,8+r,3+r*0.3,0,0,TAU);c.stroke()}
      c.globalAlpha=1;
      // ダム
      c.strokeStyle='#6a4526';c.lineWidth=2;c.globalAlpha=a;
      c.beginPath();c.moveTo(210,ry+wid+1);c.lineTo(222,ry-wid*0.4);c.moveTo(216,ry+wid+1);c.lineTo(228,ry-wid*0.4);c.stroke();c.globalAlpha=1;
    }
    // 蛍
    c.globalCompositeOperation='lighter';
    s.ff.forEach(f=>{const a=sm(t,8,16)*(0.3+0.7*Math.sin(t*f.f+f.p)**2);glow(c,f.x+10*Math.sin(t*0.5+f.p),gy-20+f.y*60,5,'190,255,150',a*0.8)});
    c.globalCompositeOperation='source-over';
  }
});

// 2 ─────────── クマ・サケ・森 ───────────
S.push({
  id:'bear',pin:{t:14,text:'海が森になる！'},hook:['森は、海のサケで','できている'],tag:'海と森のつながり',dur:26,
  title:'森の木は、海のサケを食べている？',
  beats:[
    {t:0,text:'森の栄養は<b>海から来る</b>'},
    {t:5,text:'サケが川を<b>のぼる</b>'},
    {t:9,text:'クマが<b>森の奥へ</b>運ぶ'},
    {t:14,text:'窒素が<b>木の根</b>に届く'},
    {t:20,text:'クマが消えると<b>海の栄養が止まる</b>'}
  ],
  more:'サケは体の窒素の大部分を海から得ています。川を遡ったサケをクマが森に運ぶと、食べ残しや排泄物が土に入り、海由来の窒素が樹木に取り込まれます。窒素の同位体(15N)を調べると、河畔のトウヒの窒素の一部がサケ由来だと分かります。',
  caveat:'サケ由来の窒素が樹木の成長にどの程度効くかは地域・樹種・年によって異なり、「森がサケでできている」というのは表現としては誇張を含みます。クマ以外(ワシ・オオカミ・昆虫・洪水)も運び手です。',
  source:{short:'Hilderbrand et al. 1999, Oecologia',cite:'Hilderbrand, G.V. et al. (1999). Role of brown bears (Ursus arctos) in the flow of marine nitrogen into a terrestrial ecosystem. Oecologia, 121, 546–550.',query:'Role of brown bears in the flow of marine nitrogen into a terrestrial ecosystem'},
  init(W,H){const r=rng(21);
    const trees=[[235,H*.34],[290,H*.27],[260,H*.43],[320,H*.38],[215,H*.22],[310,H*.12],[250,H*.08]].map(p=>({x:p[0],y:p[1],r:15+r()*6}));
    return{trees,salmon:Array.from({length:18},(_,i)=>({u:i/18,l:(r()-.5)*2,sp:.035+r()*.02,p:r()*6})),
      bg:Array.from({length:60},()=>({x:r()*W,y:r()*H*0.62,s:1+r()*1.5}))}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#06141f'],[1,'#0a2a22']]);
    // 川 (下=海、上=上流)
    const riverX=y=>95+28*Math.sin(y*0.012)+ (1-y/(H*0.62))*10;
    c.beginPath();
    for(let y=0;y<=H;y+=6){const x=riverX(y)-26;y?c.lineTo(x,y):c.moveTo(x,y)}
    for(let y=H;y>=0;y-=6)c.lineTo(riverX(y)+26,y);
    c.closePath();vgrad(c,0,0,W,H,[[0,'#145f7e'],[0.62,'#0d3c66'],[1,'#071f3d']]);
    txt(c,'海',20,H*0.6,13,'rgba(180,230,255,.85)');txt(c,'↑ 川上',22,18+H*0.02,10,'rgba(180,230,255,.6)');
    // 森の地面
    s.bg.forEach(p=>{if(p.x>riverX(p.y)+34){c.fillStyle='rgba(60,120,70,.25)';c.fillRect(p.x,p.y,p.s,p.s)}});
    // 樹冠(上から見た図)
    const gr=sm(t,12,22);
    s.trees.forEach((tr,i)=>{
      const rr=tr.r*(1+0.35*gr);
      c.globalCompositeOperation='lighter';glow(c,tr.x,tr.y,rr*2.2,'110,255,160',0.18+0.3*gr);c.globalCompositeOperation='source-over';
      c.fillStyle='hsl(135,'+(35+25*gr)+'%,'+(20+8*gr)+'%)';c.beginPath();c.arc(tr.x,tr.y,rr,0,TAU);c.fill();
      c.fillStyle='rgba(150,255,190,.12)';c.beginPath();c.arc(tr.x-rr*.25,tr.y-rr*.25,rr*.6,0,TAU);c.fill();
    });
    // サケ
    c.globalCompositeOperation='lighter';
    s.salmon.forEach(f=>{
      const u=(f.u+t*f.sp)%1,y=H*0.62*(1-u),x=riverX(y)+f.l*16+Math.sin(t*2+f.p)*3;
      const a=sm(t,1,5);
      glow(c,x,y,9,'255,140,70',0.4*a);
      c.fillStyle='rgba(255,170,100,'+0.95*a+')';c.beginPath();c.ellipse(x,y,2.6,6.5,Math.sin(t*6+f.p)*0.2,0,TAU);c.fill();
    });
    c.globalCompositeOperation='source-over';
    // クマの動き
    const keys=[[0,150,H*.36],[3,150,H*.36],[5,122,H*.33],[6.5,122,H*.33],[10,222,H*.30],[11.5,222,H*.30],[15,300,H*.20],[26,300,H*.20]];
    let bx=150,by=H*.36,bang=Math.PI;
    for(let i=1;i<keys.length;i++){
      if(t<=keys[i][0]){const f=sm(t,keys[i-1][0],keys[i][0]);bx=mix(keys[i-1][1],keys[i][1],f);by=mix(keys[i-1][2],keys[i][2],f);
        const dx=keys[i][1]-keys[i-1][1],dy=keys[i][2]-keys[i-1][2];if(Math.hypot(dx,dy)>1)bang=Math.atan2(dy,dx);break}
    }
    c.save();c.translate(bx,by);c.rotate(bang);
    c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=8;
    c.fillStyle='#6b4528';c.beginPath();c.ellipse(0,0,17,11,0,0,TAU);c.fill();
    c.beginPath();c.arc(17,0,7,0,TAU);c.fill();
    c.beginPath();c.arc(14,-6,2.6,0,TAU);c.arc(14,6,2.6,0,TAU);c.fill();
    c.shadowBlur=0;c.fillStyle='#2a1a0e';c.beginPath();c.arc(23,0,2,0,TAU);c.fill();
    if(t>5.5&&t<10){c.fillStyle='#ff9a5c';c.beginPath();c.ellipse(25,0,6,2.4,0,0,TAU);c.fill()}
    c.restore();
    // 置かれたサケ → 分解
    const cx=232,cy=H*.30+16;
    if(t>10.5){
      const a=1-sm(t,12,20);
      c.globalAlpha=a;c.fillStyle='#ff9a5c';c.beginPath();c.ellipse(cx,cy,7,2.6,0.3,0,TAU);c.fill();c.globalAlpha=1;
      // 窒素粒子
      c.globalCompositeOperation='lighter';
      for(let k=0;k<30;k++){
        const tk=11.5+k*0.28,p=(t-tk)/5;if(p<0||p>1)continue;
        const tr=s.trees[k%s.trees.length],e=p*p*(3-2*p);
        const x=mix(cx,tr.x,e)+Math.sin(p*9+k)*6*(1-e),y=mix(cy,tr.y,e)+Math.cos(p*7+k)*6*(1-e);
        glow(c,x,y,7,'90,235,255',0.9*Math.sin(p*Math.PI));
        c.fillStyle='rgba(220,255,255,'+Math.sin(p*Math.PI)+')';c.beginPath();c.arc(x,y,1.6,0,TAU);c.fill();
      }
      c.globalCompositeOperation='source-over';
      if(t>13&&t<21)txt(c,'窒素 (N)',cx-6,cy+22,10,'rgba(140,240,255,'+sm(t,13,14.5)*(1-sm(t,19,21))+')','center');
    }
  }
});

// 3 ─────────── 菌根ネットワーク ───────────
S.push({
  id:'myco',pin:{t:16,text:'助けてる！？'},hook:['木は地下で、','会話しているのか？'],tag:'地下のネットワーク',dur:26,
  title:'森の地下には、木々をつなぐ網がある',
  beats:[
    {t:0,text:'地面の下は<b>菌のネット</b>'},
    {t:5,text:'根と菌は<b>栄養を交換</b>'},
    {t:10,text:'木から木へ<b>炭素が移動</b>した報告'},
    {t:16,text:'母なる木が<b>若木を助ける？</b>'},
    {t:21,text:'ただし<b>まだ論争中</b>'}
  ],
  more:'ほとんどの陸上植物は、根に菌根菌を共生させています。1997年のSimardらの研究では、炭素の同位体で標識した光合成産物が、菌のネットワークを通じて別種の樹木へ移動したと報告されました。「ウッド・ワイド・ウェブ」として有名になりました。',
  caveat:'近年(Karstら 2023)、「木が菌網で若木を助ける」という主張は、データに比べて過度に一般化されているとの批判論文が出ています。菌網そのものは確実に存在しますが、その生態的な意味は検証が続いています。動画前半は「分かっていること」、後半は「仮説」です。',
  source:{short:'Simard et al. 1997, Nature / Karst et al. 2023',cite:'Simard, S.W. et al. (1997). Net transfer of carbon between ectomycorrhizal tree species in the field. Nature, 388, 579–582. / Karst, J. et al. (2023). Positive citation bias and overinterpreted results lead to misinformation on common mycorrhizal networks in forests. Nature Ecology & Evolution, 7, 501–511.',query:'Net transfer of carbon between ectomycorrhizal tree species in the field'},
  init(W,H){const r=rng(33);const gy=H*0.27;
    const bases=[[50,.45,'s'],[115,.6,'s'],[180,1,'m'],[250,.5,'s'],[315,.7,'s']].map(b=>({x:b[0],y:gy,sz:b[1],m:b[2]==='m'}));
    const hubs=Array.from({length:16},()=>({x:20+r()*320,y:gy+35+r()*H*0.31}));
    const nodes=bases.concat(hubs);
    const edges=[];
    nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<92&&!(i<5&&j<5)){edges.push({a:i,b:j,cx:(a.x+b.x)/2+(r()-.5)*24,cy:(a.y+b.y)/2+(r()-.5)*24,ph:r()*6})}}));
    // 母の木から各若木への最短経路(ダイクストラ簡易)
    const dist=nodes.map(()=>1e9),prev=nodes.map(()=>-1),done=nodes.map(()=>false);dist[2]=0;
    for(let n=0;n<nodes.length;n++){let u=-1;nodes.forEach((_,i)=>{if(!done[i]&&(u<0||dist[i]<dist[u]))u=i});if(u<0||dist[u]>=1e9)break;done[u]=true;
      edges.forEach(e=>{const v=e.a===u?e.b:e.b===u?e.a:-1;if(v<0)return;const d=dist[u]+Math.hypot(nodes[u].x-nodes[v].x,nodes[u].y-nodes[v].y);if(d<dist[v]){dist[v]=d;prev[v]=u}})}
    const paths={};[0,1,3,4].forEach(k=>{const p=[];let v=k;while(v>=0){p.unshift([nodes[v].x,nodes[v].y]);v=prev[v]}paths[k]=p});
    return{gy,bases,nodes,edges,paths,st:mkStars(60,W,gy,9),fl:Array.from({length:30},()=>({x:r()*W,y:gy+r()*H*0.3,p:r()*6}))}},
  draw(c,t,W,H,s){
    const gy=s.gy;
    vgrad(c,0,0,W,H,[[0,'#050818'],[0.2,'#0a1230'],[0.27,'#0e1f25'],[0.28,'#120c14'],[1,'#0a0610']]);
    stars(c,W,H,s.st,t,gy);
    const reveal=sm(t,0.5,4);
    // 菌糸
    c.globalCompositeOperation='lighter';
    s.edges.forEach(e=>{
      const a=s.nodes[e.a],b=s.nodes[e.b];
      c.strokeStyle='rgba(255,120,220,'+(reveal*(0.16+0.1*Math.sin(t*1.2+e.ph)))+')';c.lineWidth=1.1;
      c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo(e.cx,e.cy,b.x,b.y);c.stroke();
    });
    s.nodes.forEach((n,i)=>{if(i>=5)glow(c,n.x,n.y,6,'255,130,230',0.35*reveal*(0.6+0.4*Math.sin(t*2+i)))});
    // 根
    s.bases.forEach((b,i)=>{
      c.strokeStyle='rgba(255,200,140,'+0.5*reveal+')';c.lineWidth=1.3;
      for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(b.x,b.y);c.quadraticCurveTo(b.x+k*8,b.y+18,b.x+k*14,b.y+30+Math.abs(k)*4);c.stroke()}
    });
    // 流れる光
    const flow=sm(t,9,13);
    [0,1,3,4].forEach((k,ki)=>{
      const p=s.paths[k];if(!p||p.length<2)return;
      for(let n=0;n<6;n++){
        const u=((t*0.11+n/6+ki*.17)%1);
        const pt=polyAt(p,u);
        glow(c,pt[0],pt[1],9,'255,225,120',0.85*flow*Math.sin(u*Math.PI));
      }
    });
    c.globalCompositeOperation='source-over';
    // 木
    const give=sm(t,12,20);
    s.bases.forEach((b,i)=>{
      const h=(b.m?110:58)*(b.sz>0.6?1:1)*(b.m?1:b.sz+0.3);
      c.strokeStyle='#6a5037';c.lineWidth=b.m?4:2.4;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.x,b.y-h);c.stroke();
      const r=b.m?32:14+b.sz*8;
      const pulse=b.m?0.5+0.5*Math.sin(t*2.2)**2:give*0.8+0.2;
      c.globalCompositeOperation='lighter';
      glow(c,b.x,b.y-h,r*2.3,b.m?'255,225,130':'120,255,190',0.25+0.35*pulse);
      c.globalCompositeOperation='source-over';
      c.fillStyle='hsl(140,'+(40+20*pulse)+'%,'+(22+8*pulse)+'%)';c.beginPath();c.ellipse(b.x,b.y-h,r,r*1.15,0,0,TAU);c.fill();
    });
    txt(c,'母なる木',180,gy-158,10,'rgba(255,235,170,'+sm(t,15,17)+')','center');
    // 議論マーク
    if(t>20){
      const a=sm(t,20,22);c.globalAlpha=a;
      c.fillStyle='rgba(255,200,90,.14)';c.strokeStyle='rgba(255,200,90,.7)';c.lineWidth=1;
      c.beginPath();c.roundRect(110,gy+H*0.33,140,26,13);c.fill();c.stroke();
      txt(c,'⚖ 研究者の間で議論中',180,gy+H*0.33+13,11,'#ffd98a','center');c.globalAlpha=1;
    }
  }
});

// 4 ─────────── アリ(超個体) ───────────
function antReset(s){
  const r=rng(5);
  s.pher=new Float32Array(s.gw*s.gh);
  s.ants=Array.from({length:110},()=>({x:s.nest.x+(r()-.5)*10,y:s.nest.y+(r()-.5)*10,a:-Math.PI/2+(r()-.5)*2.2,f:false,w:r()}));
  s.simT=0;s.last=0;s.rnd=rng(77);
}
function antStep(s,W,dt){
  const {gw,gh,cs,nest,food,rock}=s,rnd=s.rnd;
  for(const a of s.ants){
    if(s.simT<a.w*8)continue;
    const sense=da=>{const ang=a.a+da,x=a.x+Math.cos(ang)*9,y=a.y+Math.sin(ang)*9,gx=(x/cs)|0,gy=(y/cs)|0;return(gx>=0&&gy>=0&&gx<gw&&gy<gh)?s.pher[gy*gw+gx]:0};
    if(!a.f){
      const L=sense(-.6),M=sense(0),R=sense(.6);
      if(L+M+R>0.08){if(M<L||M<R)a.a+=L>R?-.28:.28;a.a+=(rnd()-.5)*.25}
      else a.a+=(rnd()-.5)*.8+clamp(wrap(Math.atan2(food.y-a.y,food.x-a.x)-a.a),-.05,.05);
    }else{
      const ta=Math.atan2(nest.y-a.y,nest.x-a.x);
      a.a+=clamp(wrap(ta-a.a),-.22,.22)+(rnd()-.5)*.12;
      const gx=(a.x/cs)|0,gy=(a.y/cs)|0;
      if(gx>=0&&gy>=0&&gx<gw&&gy<gh){const i=gy*gw+gx;s.pher[i]=Math.min(6,s.pher[i]+.9)}
    }
    const sp=58*dt;a.x+=Math.cos(a.a)*sp;a.y+=Math.sin(a.a)*sp;
    const dx=a.x-rock.x,dy=a.y-rock.y,d=Math.hypot(dx,dy);
    if(d<rock.r+3){a.x=rock.x+dx/d*(rock.r+3);a.y=rock.y+dy/d*(rock.r+3);a.a+=.7}
    if(a.x<3||a.x>W-3){a.a=Math.PI-a.a;a.x=clamp(a.x,3,W-3)}
    if(a.y<3||a.y>s.SH-3){a.a=-a.a;a.y=clamp(a.y,3,s.SH-3)}
    if(!a.f&&Math.hypot(a.x-food.x,a.y-food.y)<14){a.f=true;a.a+=Math.PI}
    else if(a.f&&Math.hypot(a.x-nest.x,a.y-nest.y)<12){a.f=false;a.a=-Math.PI/2+(rnd()-.5)*2}
  }
  for(let i=0;i<s.pher.length;i++)s.pher[i]*=.9935;
  s.simT+=dt;
}
S.push({
  id:'ant',pin:{t:14,text:'道ができた！'},hook:['アリ1匹はバカ。','なのに群れは天才。'],tag:'超個体 / 社会生物学',dur:30,
  title:'アリの群れは、ひとつの生きものみたい',
  beats:[
    {t:0,text:'アリ1匹は<b>ほぼ無知</b>'},
    {t:7,text:'帰り道に<b>匂い</b>を残す'},
    {t:14,text:'濃い道を<b>仲間が選ぶ</b>'},
    {t:21,text:'指揮官ゼロで<b>群れが賢くなる</b>'},
    {t:26,text:'ウィルソンの<b>超個体</b>'}
  ],
  more:'アリは個体としては単純なルールしか持ちませんが、フェロモンの濃淡を介して情報を共有し、最短経路の発見や分業といった高度な振る舞いを集団として実現します。E.O.ウィルソンはアリ研究を土台に、社会性昆虫の集団を一つの「超個体」とみなす見方と、動物の社会行動を進化で説明する「社会生物学」(1975)を提唱しました。',
  caveat:'画面のアリは、フェロモンを辿る単純なルールに基づく簡易シミュレーションです(実際の種ではさらに複雑で、種ごとに違います)。「超個体」概念は強力ですが、生物学では適用範囲について今も議論があります。',
  source:{short:'Deneubourg et al. 1990 / Hölldobler & Wilson 2009',cite:'Deneubourg, J.L. et al. (1990). The self-organizing exploratory pattern of the Argentine ant. Journal of Insect Behavior, 3, 159–168. / Hölldobler, B. & Wilson, E.O. (2009). The Superorganism. W.W. Norton.',query:'The self-organizing exploratory pattern of the Argentine ant'},
  init(W,H){
    const SH=H*0.62,cs=5,gw=Math.ceil(W/cs),gh=Math.ceil(SH/cs);
    const off=document.createElement('canvas');off.width=gw;off.height=gh;
    const s={SH,cs,gw,gh,off,octx:off.getContext('2d'),nest:{x:70,y:SH-34},food:{x:282,y:92},rock:{x:178,y:SH*0.5,r:32},st:mkStars(40,W,H,4)};
    s.img=s.octx.createImageData(gw,gh);antReset(s);return s},
  draw(c,t,W,H,s){
    if(t<s.last-0.5)antReset(s);
    while(s.simT<t)antStep(s,W,1/30);
    s.last=t;
    vgrad(c,0,0,W,H,[[0,'#1a120b'],[0.62,'#241a10'],[1,'#07050a']]);
    // 土の粒
    const rr=rng(8);for(let i=0;i<90;i++){c.fillStyle='rgba(255,220,170,'+(0.03+rr()*0.05)+')';c.fillRect(rr()*W,rr()*s.SH,1+rr()*2,1+rr()*2)}
    // フェロモン
    const d=s.img.data;
    for(let i=0;i<s.pher.length;i++){const v=s.pher[i],a=Math.min(255,v*95);d[i*4]=255;d[i*4+1]=185;d[i*4+2]=60;d[i*4+3]=a}
    s.octx.putImageData(s.img,0,0);
    c.imageSmoothingEnabled=true;c.globalCompositeOperation='lighter';c.globalAlpha=sm(t,5,9)*0.9+0.1*(t>7?1:0);
    c.drawImage(s.off,0,0,s.gw*s.cs,s.gh*s.cs);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    // 岩・巣・餌
    c.fillStyle='#2e2a30';c.beginPath();c.arc(s.rock.x,s.rock.y,s.rock.r,0,TAU);c.fill();
    c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.arc(s.rock.x-8,s.rock.y-8,s.rock.r*.6,0,TAU);c.fill();
    c.fillStyle='#0a0705';c.beginPath();c.ellipse(s.nest.x,s.nest.y,16,10,0,0,TAU);c.fill();
    txt(c,'巣',s.nest.x,s.nest.y+22,10,'rgba(255,230,190,.7)','center');
    c.globalCompositeOperation='lighter';glow(c,s.food.x,s.food.y,28,'120,255,160',0.45+0.15*Math.sin(t*3));c.globalCompositeOperation='source-over';
    c.fillStyle='#7be08a';for(let i=0;i<7;i++){c.beginPath();c.arc(s.food.x+Math.cos(i*2.4)*6,s.food.y+Math.sin(i*2.4)*6,2.6,0,TAU);c.fill()}
    txt(c,'餌',s.food.x,s.food.y+24,10,'rgba(200,255,210,.8)','center');
    // アリ
    s.ants.forEach((a,i)=>{
      if(s.simT<a.w*8)return;
      c.fillStyle=a.f?'#ffe08a':'#e8d9c4';
      c.beginPath();c.arc(a.x,a.y,1.7,0,TAU);c.fill();
      c.beginPath();c.arc(a.x-Math.cos(a.a)*2.4,a.y-Math.sin(a.a)*2.4,1.3,0,TAU);c.fill();
      if(a.f){c.fillStyle='#7be08a';c.beginPath();c.arc(a.x+Math.cos(a.a)*2.6,a.y+Math.sin(a.a)*2.6,1.1,0,TAU);c.fill()}
    });
    // 最初は1匹に注目
    if(t<7){const a=s.ants.find(x=>s.simT>=x.w*8)||s.ants[0];const f=1-sm(t,5.5,7);
      c.strokeStyle='rgba(255,255,255,'+0.8*f+')';c.lineWidth=1.2;c.beginPath();c.arc(a.x,a.y,9+2*Math.sin(t*6),0,TAU);c.stroke();}
  }
});

// 5 ─────────── 腸と脳 ───────────
S.push({
  id:'gut',pin:{t:12,text:'腸 → 脳！'},hook:['あなたの気分は、','お腹の菌が握ってる？'],tag:'腸内細菌と脳',dur:26,
  title:'お腹の細菌は、気分に口を出す？',
  beats:[
    {t:0,text:'腸には<b>38兆</b>の細菌'},
    {t:6,text:'腸にも<b>神経</b>がびっしり'},
    {t:12,text:'<b>腸から脳へ</b>信号が飛ぶ'},
    {t:18,text:'菌が<b>気分</b>に関わるかも'}
  ],
  more:'ヒトの腸内細菌は細胞数でほぼ体の細胞と同程度(約38兆個、Senderら2016)。腸には約5億個の神経細胞からなる腸管神経系があり、迷走神経・免疫・ホルモン・細菌の代謝産物を介して脳と双方向に連絡する「腸脳相関」が研究されています。体内セロトニンの大半が腸でつくられることも知られています。',
  caveat:'動物実験(マウス)の結果が多く、ヒトで「この菌を摂れば気分が良くなる」と言えるほどの証拠はまだ限られます。腸のセロトニンがそのまま脳内のセロトニンになるわけでもありません。',
  source:{short:'Cryan et al. 2019, Physiol. Rev.',cite:'Cryan, J.F. et al. (2019). The Microbiota-Gut-Brain Axis. Physiological Reviews, 99, 1877–2013. / Sender, R., Fuchs, S. & Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. PLoS Biology, 14, e1002533.',query:'The Microbiota-Gut-Brain Axis Cryan 2019 Physiological Reviews'},
  init(W,H){const r=rng(41);const by=H*0.15;
    const nodes=[];while(nodes.length<36){const x=(r()-.5)*2,y=(r()-.5)*2;if(x*x+y*y<1)nodes.push({x:180+x*66,y:by+y*40,p:r()*6})}
    const edges=[];nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(a.x-b.x,a.y-b.y)<30)edges.push([i,j])}));
    const bact=Array.from({length:160},()=>({u:r(),o:(r()-.5)*2,sp:.01+r()*.03,h:[150,45,200,330,20][(r()*5)|0],p:r()*6}));
    return{by,nodes,edges,bact,gutY:H*0.43,st:mkStars(40,W,H*.6,14)}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#0a0716'],[1,'#12060f']]);
    stars(c,W,H,s.st,t,H*.6);
    const gy=s.gutY,gut=(u)=>[50+260*u,gy+24*Math.sin(u*TAU*2.2+t*0.5)];
    const up=sm(t,10,14);
    // 迷走神経
    const vag=[];for(let i=0;i<=24;i++){const u=i/24;vag.push([mix(172,66,u)+Math.sin(u*Math.PI)*-26,mix(s.by+42,gy-18,u)])}
    c.strokeStyle='rgba(255,220,120,.45)';c.lineWidth=2.2;c.beginPath();vag.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    // 腸
    c.lineCap='round';c.lineJoin='round';
    const path=[];for(let i=0;i<=60;i++)path.push(gut(i/60));
    c.strokeStyle='rgba(255,150,170,.28)';c.lineWidth=34;c.beginPath();path.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    c.strokeStyle='rgba(60,10,30,.8)';c.lineWidth=26;c.beginPath();path.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    // 細菌
    c.globalCompositeOperation='lighter';
    const bn=Math.round(160*sm(t,0.3,5));
    s.bact.slice(0,bn).forEach(b=>{
      const u=(b.u+t*b.sp)%1,p=gut(u);
      const x=p[0]+Math.sin(t*2+b.p)*2,y=p[1]+b.o*9+Math.cos(t*2.3+b.p)*2;
      c.fillStyle='hsla('+b.h+',90%,62%,.9)';c.beginPath();c.ellipse(x,y,2.8,1.5,Math.sin(t+b.p),0,TAU);c.fill();
    });
    // 神経ネットワーク(腸壁の点)
    const en=sm(t,6,9);
    for(let i=0;i<30;i++){const p=gut(i/29);glow(c,p[0],p[1]-13*(i%2?-1:1),5,'255,230,130',0.5*en*(0.5+0.5*Math.sin(t*3+i)))}
    // 脳
    s.edges.forEach(e=>{const a=s.nodes[e[0]],b=s.nodes[e[1]];c.strokeStyle='rgba(150,190,255,.22)';c.lineWidth=.8;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()});
    s.nodes.forEach((n,i)=>{
      const fire=Math.max(0,Math.sin(t*2.6+n.p*3))**6;
      const extra=up*Math.max(0,Math.sin(t*1.4-(n.y-s.by)*0.05))**4;
      glow(c,n.x,n.y,8+8*(fire+extra),'140,190,255',0.35+0.55*Math.min(1,fire+extra));
    });
    // 信号(上り)
    const nUp=Math.round(2+7*up);
    for(let i=0;i<nUp;i++){const u=1-((t*0.22+i/nUp)%1),p=polyAt(vag,u);glow(c,p[0],p[1],8,'255,225,120',0.9)}
    // 下り信号
    for(let i=0;i<2;i++){const u=((t*0.2+i/2)%1),p=polyAt(vag,u);glow(c,p[0],p[1],6,'160,200,255',0.6)}
    // セロトニン風の粒
    const se=sm(t,15,17);
    for(let i=0;i<14;i++){const u=i/13,p=gut(u),ph=((t*0.3+i*.37)%1);glow(c,p[0]+Math.sin(i*5)*8,p[1]-ph*34-12,5,'210,140,255',0.8*se*(1-ph))}
    c.globalCompositeOperation='source-over';
    txt(c,'脳',286,s.by-30,12,'rgba(190,215,255,.85)','center');
    txt(c,'迷走神経',54,mix(s.by,gy,.45),10,'rgba(255,225,140,.85)','left');
    txt(c,'腸',330,gy-34,12,'rgba(255,190,200,.85)','center');
    const n=Math.round(38e12*sm(t,0.5,5)).toLocaleString('en-US');
    txt(c,n,180,H*0.585,19,'rgba(200,255,225,'+(0.95*(1-sm(t,12,14)))+')','center',900);
    txt(c,'個の腸内細菌',180,H*0.585+20,10,'rgba(200,255,225,'+(0.7*(1-sm(t,12,14)))+')','center');
    if(t>16)txt(c,'腸でつくられる化学物質(セロトニンなど)',180,H*0.585,11,'rgba(225,175,255,'+sm(t,16,18)+')','center');
  }
});

// 6 ─────────── 色覚 ───────────
S.push({
  id:'color',pin:{t:10,text:'見つけた！'},hook:['赤が見えるのは、','果物のおかげ？'],tag:'目の進化',dur:24,
  title:'赤が見えるのは、果物を探すためだった？',
  beats:[
    {t:0,text:'熟した実は<b>どれ？</b>'},
    {t:5,text:'2色型だと<b>葉に溶ける</b>'},
    {t:10,text:'3色型なら<b>一瞬で見つかる</b>'},
    {t:16,text:'食べ物探しが<b>目を変えた？</b>'}
  ],
  more:'多くの哺乳類は2色型(青と緑寄りの2種類の錐体)ですが、旧世界ザルと類人猿(ヒトを含む)は、赤と緑を区別する3色型色覚を持ちます。「熟した果実や若葉を緑の葉の中で見つけやすい」ことが進化の理由だという仮説があり、実際の果実・葉の反射スペクトルの解析がその裏づけとされています。',
  caveat:'これは有力な仮説のひとつで、「社会的なシグナル(顔色など)を読むため」という説や、昼行性・夜行性の履歴など別の要因も議論されています。画面の色は模式的な再現です。',
  source:{short:'Regan et al. 2001, Phil. Trans. R. Soc. B',cite:'Regan, B.C. et al. (2001). Fruits, foliage and the evolution of primate colour vision. Philosophical Transactions of the Royal Society B, 356, 229–283.',query:'Fruits, foliage and the evolution of primate colour vision'},
  init(W,H){const r=rng(52);const cx=180,cy=H*0.34,R=150;
    const pts=(n,pad)=>Array.from({length:n},()=>{const a=r()*TAU,d=Math.sqrt(r())*(R-pad);return{x:cx+Math.cos(a)*d,y:cy+Math.sin(a)*d,a:r()*TAU,s:.8+r()*.6,v:r()}});
    const leaves=pts(190,8),fruits=pts(13,18),over=pts(60,8);
    return{cx,cy,R,leaves,fruits,over,st:mkStars(40,W,H*.15,15)}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#0a1a14'],[1,'#050a08']]);
    const m=sm(t,10,12.5);
    const leafDi=[118,120,66],leafTri=[40,120,48],fruitDi=[132,120,62],fruitTri=[240,70,40];
    c.save();c.beginPath();c.arc(s.cx,s.cy,s.R,0,TAU);c.clip();
    c.fillStyle=lerpColor([60,58,36],[18,52,28],m);c.fillRect(s.cx-s.R,s.cy-s.R,s.R*2,s.R*2);
    const drawLeaf=l=>{
      c.save();c.translate(l.x,l.y);c.rotate(l.a);
      const vv=(l.v-.5)*18;
      c.fillStyle=lerpColor(leafDi.map(x=>x+vv),leafTri.map((x,i)=>x+(i===1?vv:vv*0.4)),m);
      c.beginPath();c.ellipse(0,0,11*l.s,5*l.s,0,0,TAU);c.fill();
      c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=.6;c.beginPath();c.moveTo(-9*l.s,0);c.lineTo(9*l.s,0);c.stroke();c.restore();
    };
    s.leaves.forEach(drawLeaf);
    s.fruits.forEach(f=>{
      c.fillStyle=lerpColor(fruitDi.map(x=>x+(f.v-.5)*10),fruitTri,m);
      c.beginPath();c.arc(f.x,f.y,7.5,0,TAU);c.fill();
      c.fillStyle='rgba(255,255,255,'+(0.16+0.2*m)+')';c.beginPath();c.arc(f.x-2.2,f.y-2.5,2.3,0,TAU);c.fill();
    });
    s.over.forEach(drawLeaf);
    c.restore();
    // 光るリング
    c.globalCompositeOperation='lighter';
    s.fruits.forEach((f,i)=>{if(m>.5){const a=(m-.5)*2*(0.5+0.5*Math.sin(t*3+i));glow(c,f.x,f.y,17,'255,150,80',0.55*a)}});
    c.globalCompositeOperation='source-over';
    c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1.5;c.beginPath();c.arc(s.cx,s.cy,s.R+2,0,TAU);c.stroke();
    // ラベル
    const ly=s.cy+s.R+24;
    c.globalAlpha=1-m;txt(c,'2色型の見え方(多くの哺乳類)',180,ly,12,'#e6e0a8','center');
    c.globalAlpha=m;txt(c,'3色型の見え方(ヒト・旧世界ザル)',180,ly,12,'#ffb89a','center');c.globalAlpha=1;
    if(t>0.5&&t<9)txt(c,'どれが熟した実?',180,s.cy-s.R-18,13,'rgba(255,255,255,'+(0.6+0.3*Math.sin(t*4))+')','center');
  }
});

// 7 ─────────── 笑いの起源 ───────────
S.push({
  id:'laugh',pin:{t:15,text:'ここが違う！'},hook:['笑いの正体は、','サルのくすぐり遊び'],tag:'人間も動物',dur:24,
  title:'笑いは、サルの遊びから始まった？',
  beats:[
    {t:0,text:'笑うのは<b>人だけ？</b>'},
    {t:5,text:'類人猿も<b>くすぐれば笑う</b>'},
    {t:10,text:'吸っても吐いても<b>ハッハッ</b>'},
    {t:15,text:'ヒトは<b>吐く息だけ</b>'},
    {t:19,text:'起源は<b>1000万年以上前？</b>'}
  ],
  more:'ヒトと大型類人猿(チンパンジー・ボノボ・ゴリラ・オランウータン)が、くすぐり遊びで出す笑い声を音響分析した研究では、笑い声の特徴が系統関係に沿って似ていることが示されました。ヒト以外では吸気と呼気が交互に出る笑いが多く、ヒトは呼気主体で、遊びに伴う発声が共通祖先まで遡るとされます。',
  caveat:'「1000万年以上前」は、系統樹と音の類似度から推定された共通祖先の話で、その時点で現在と同じ「笑い」があったという意味ではありません。画面の波形は特徴を単純化した模式図です。',
  source:{short:'Davila Ross et al. 2009, Curr. Biol.',cite:'Davila Ross, M., Owren, M.J. & Zimmermann, E. (2009). Reconstructing the evolution of laughter in great apes and humans. Current Biology, 19, 1106–1111.',query:'Reconstructing the evolution of laughter in great apes and humans'},
  init(W,H){return{st:mkStars(50,W,H*.4,18)}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#130a22'],[1,'#07040e']]);
    stars(c,W,H,s.st,t,H*.4);
    const y0=H*0.2;
    const pulse=Math.max(0,Math.sin((t*TAU)/0.9));
    const laughing=sm(t,4,5.5);
    const face=(x,y,body,ear,lau,flip,hum)=>{
      c.save();c.translate(x,y);
      c.shadowColor=body;c.shadowBlur=14;
      c.fillStyle=body;c.beginPath();c.arc(0,0,27,0,TAU);c.fill();
      c.beginPath();c.arc(-24,-6,8,0,TAU);c.arc(24,-6,8,0,TAU);c.fill();
      c.shadowBlur=0;
      c.fillStyle=ear;c.beginPath();c.arc(-24,-6,4.5,0,TAU);c.arc(24,-6,4.5,0,TAU);c.fill();
      c.beginPath();c.ellipse(0,8,18,14,0,0,TAU);c.fill();
      c.strokeStyle='#2a1608';c.lineWidth=2.4;c.lineCap='round';
      for(const ex of[-9,9]){c.beginPath();c.arc(ex,-4,4.2,Math.PI*1.1,Math.PI*1.9);c.stroke()}
      c.fillStyle='#3a0f10';c.beginPath();c.ellipse(0,11,7+3*lau,2+7*lau,0,0,TAU);c.fill();
      if(hum){c.fillStyle='#4a2a1a';c.beginPath();c.arc(0,-24,13,Math.PI,TAU);c.fill()}
      c.restore();
    };
    const bounceA=-Math.abs(Math.sin(t*3.5))*10*laughing,bounceB=-Math.abs(Math.sin(t*3.5+1.2))*10*laughing;
    const px=mix(0,14,Math.sin(t*1.5));
    face(112+px,y0+50+bounceA,'#b9763a','#e6b17c',pulse*laughing,1,false);
    face(248-px,y0+50+bounceB,'#e8b48a','#f7d1b2',pulse*laughing,-1,true);
    txt(c,'類人猿',112+px,y0+95,10,'rgba(255,220,180,.8)','center');txt(c,'ヒト',248-px,y0+95,10,'rgba(255,220,180,.8)','center');
    // 吹き出し
    if(laughing>.5){
      const k=Math.floor(t/0.9);const a=pulse>0.1?1:0.2;
      txt(c,'ハッ',k%2?112+px:248-px,y0-4-pulse*6,15,'rgba(255,240,170,'+a+')','center',900);
    }
    // 波形パネル
    const my=H*0.45,amp=26,x0=20,wpx=320;
    c.fillStyle='rgba(255,255,255,.05)';c.beginPath();c.roundRect(x0-8,my-42,wpx+16,84,12);c.fill();
    const morph=sm(t,12,15);
    const burst=(tt)=>{ // 0.55秒ごとの発声
      if(tt<0)return 0;
      const k=Math.floor(tt/0.55),dt=tt-k*0.55;if(dt>0.42)return 0;
      const env=Math.sin(dt/0.42*Math.PI)**1.5;
      const inhale=(k%2===1);
      const f=inhale?mix(-0.55,1,morph):1;
      return env*f*(0.8+0.2*Math.sin(dt*110));
    };
    const show=sm(t,5,7);
    c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;c.beginPath();c.moveTo(x0,my);c.lineTo(x0+wpx,my);c.stroke();
    c.globalCompositeOperation='lighter';
    c.beginPath();
    for(let i=0;i<=wpx;i+=1){
      const tt=t-(1-i/wpx)*3.2;
      const v=burst(tt+0.0)*show;
      const y=my-v*amp;i?c.lineTo(x0+i,y):c.moveTo(x0+i,y);
    }
    c.strokeStyle=morph<.5?'rgba(255,190,110,.95)':'rgba(140,230,255,.95)';c.lineWidth=2;c.shadowColor=c.strokeStyle;c.shadowBlur=8;c.stroke();c.shadowBlur=0;
    c.globalCompositeOperation='source-over';
    c.globalAlpha=show;
    txt(c,'↑吐く',x0+wpx+4,my-16,9,'rgba(255,255,255,.55)','right');txt(c,'↓吸う',x0+wpx+4,my+16,9,'rgba(255,255,255,.55)','right');
    c.globalAlpha=(1-morph)*show;txt(c,'類人猿:吸う⇄吐くを交互に',x0,my-30,10,'#ffc88a','left');
    c.globalAlpha=morph*show;txt(c,'ヒト:吐く息だけで「ハッ・ハッ」',x0,my-30,10,'#9fe6ff','left');c.globalAlpha=1;
    // 系統のつながり
    const a=sm(t,18,21);
    if(a>0){
      c.globalAlpha=a;c.strokeStyle='rgba(255,230,160,.8)';c.lineWidth=1.5;c.setLineDash([4,4]);
      c.beginPath();c.moveTo(112,my+58);c.lineTo(180,my+98);c.lineTo(248,my+58);c.stroke();c.setLineDash([]);
      glow(c,180,my+98,24,'255,230,160',.5);
      txt(c,'共通祖先',180,my+118,11,'#ffe9a8','center');c.globalAlpha=1;
    }
  }
});

// 8 ─────────── マメ科と根粒菌 ───────────
S.push({
  id:'legume',pin:{t:11,text:'空気が肥料に！'},hook:['空気から肉の材料を','つくる豆の裏ワザ'],tag:'マメ科 × 微生物',dur:26,
  title:'空気からタンパク質をつくる、小さな工場',
  beats:[
    {t:0,text:'空気の<b>78%</b>は窒素'},
    {t:6,text:'でも植物は<b>使えない</b>'},
    {t:11,text:'<b>根粒菌</b>が肩代わり'},
    {t:16,text:'お礼は<b>糖</b>'},
    {t:21,text:'<b>豆</b>は動物の栄養源に'}
  ],
  more:'窒素ガス(N₂)は三重結合が強く、ほとんどの生物は直接利用できません。根粒菌(リゾビウムなど)はニトロゲナーゼという酵素でN₂をアンモニアに変え(窒素固定)、植物は光合成でつくった糖を提供します。豆類の豊富なタンパク質は、ヒトを含む多くの動物の食料になっています。',
  caveat:'植物と菌の関係は「完全な友好」ではなく、窒素をあまり固定しない菌には植物側が酸素や糖の供給を減らして制裁する(Kiersら2003)など、取引のような駆け引きが見られます。',
  source:{short:'Kiers et al. 2003, Nature',cite:'Kiers, E.T. et al. (2003). Host sanctions and the legume–rhizobium mutualism. Nature, 425, 78–81.',query:'Host sanctions and the legume-rhizobium mutualism'},
  init(W,H){const r=rng(61);const gy=H*0.31;
    return{gy,N:[236,H*0.47],st:mkStars(40,W,gy,16),
      soil:Array.from({length:120},()=>({x:r()*W,y:gy+4+r()*(H*0.62-gy),s:1+r()*2,a:r()*.1})),
      p2:Array.from({length:18},(_,k)=>({x:30+r()*300,y:gy+30+r()*H*0.27,k,tw:r()*6})),
      cap:Array.from({length:14},()=>({a:r()*TAU,d:r()*17,s:.4+r()*.8,p:r()*6}))}},
  draw(c,t,W,H,s){
    const gy=s.gy,N=s.N;
    vgrad(c,0,0,W,H,[[0,'#07162a'],[0.3,'#13324a'],[0.31,'#2b1a10'],[1,'#120a06']]);
    stars(c,W,H,s.st,t,gy);
    s.soil.forEach(p=>{c.fillStyle='rgba(255,210,160,'+p.a+')';c.fillRect(p.x,p.y,p.s,p.s)});
    c.fillStyle='rgba(60,200,100,.22)';c.fillRect(0,gy-2,W,3);
    // 空気中のN₂ラベル
    txt(c,'空気: N₂ 78%',20,gy-90,11,'rgba(180,215,255,'+(0.9-0.7*sm(t,6,8))+')','left');
    const root=[[N[0],N[1]],[N[0]-24,N[1]-14],[N[0]-56,N[1]-38],[180,gy+8],[180,gy-70]];
    // 根
    c.lineCap='round';c.strokeStyle='#d9b88a';c.lineWidth=3.2;
    c.beginPath();c.moveTo(180,gy);c.lineTo(180,gy+40);c.moveTo(180,gy+40);c.lineTo(180,H*0.56);c.stroke();
    c.beginPath();root.slice(0,4).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    c.lineWidth=1.4;[[-34,.52],[28,.46],[-20,.4]].forEach(b=>{c.beginPath();c.moveTo(180,H*b[1]-8);c.quadraticCurveTo(180+b[0]*.6,H*b[1]+8,180+b[0],H*b[1]+16);c.stroke()});
    // 根粒
    const act=sm(t,5,9);
    c.globalCompositeOperation='lighter';glow(c,N[0],N[1],42,'255,120,170',0.2+0.3*act*(0.7+0.3*Math.sin(t*3)));c.globalCompositeOperation='source-over';
    c.fillStyle='#e6a2b4';c.beginPath();c.arc(N[0],N[1],25*(0.4+0.6*sm(t,3,7)),0,TAU);c.fill();
    c.fillStyle='#f6c6d2';c.beginPath();c.arc(N[0]-6,N[1]-7,9,0,TAU);c.fill();
    if(t>5){const a=sm(t,5,7);c.globalAlpha=a;
      s.cap.forEach(b=>{const x=N[0]+Math.cos(b.a+t*.3*b.s)*b.d,y=N[1]+Math.sin(b.a*1.3+t*.4*b.s)*b.d*.8;c.fillStyle='#5a2a40';c.beginPath();c.ellipse(x,y,3,1.7,b.a+t,0,TAU);c.fill()});c.globalAlpha=1}
    txt(c,'根粒菌',N[0]+4,N[1]+40,10,'rgba(255,200,215,'+sm(t,6,8)+')','center');
    // N₂ → NH₃
    c.globalCompositeOperation='lighter';
    for(let k=0;k<16;k++){
      const tk=4+k*0.65,p=(t-tk)/3,P=s.p2[k];
      if(p>0&&p<1){
        const e=p*p*(3-2*p),x=mix(P.x,N[0],e)+Math.sin(p*8+k)*8*(1-e),y=mix(P.y,N[1],e)+Math.cos(p*6+k)*8*(1-e);
        glow(c,x,y,8,'150,190,255',0.8*Math.min(1,p*4));
        c.fillStyle='#cfe0ff';c.beginPath();c.arc(x-2.2,y,2,0,TAU);c.arc(x+2.2,y,2,0,TAU);c.fill();
      }
      const q=(t-tk-3)/4.5;
      if(q>0&&q<1){
        const pt=polyAt(root,q);
        glow(c,pt[0],pt[1],9,'130,255,170',0.85*Math.sin(q*Math.PI));
        c.fillStyle='#d4ffe0';c.beginPath();c.arc(pt[0],pt[1],2.4,0,TAU);c.arc(pt[0]+3,pt[1]+2,1.4,0,TAU);c.arc(pt[0]-3,pt[1]+2,1.4,0,TAU);c.arc(pt[0],pt[1]-3,1.4,0,TAU);c.fill();
      }
    }
    // 糖(上から下へ)
    for(let k=0;k<14;k++){
      const q=(t-(10+k*.8))/4.5;if(q<=0||q>=1)continue;
      const pt=polyAt(root,1-q);glow(c,pt[0]+4,pt[1],8,'255,215,100',0.85*Math.sin(q*Math.PI));
      c.fillStyle='#fff2b8';c.fillRect(pt[0]+2,pt[1]-2,4,4);
    }
    c.globalCompositeOperation='source-over';
    if(t>12)txt(c,'NH₃',N[0]-44,N[1]-56,10,'rgba(160,255,190,'+sm(t,12,14)+')','center');
    if(t>16)txt(c,'糖',150,gy+42,11,'rgba(255,225,130,'+sm(t,16,18)+')','center');
    // 植物
    const gr=sm(t,6,22);
    c.strokeStyle='#4fbf6a';c.lineWidth=4;c.beginPath();c.moveTo(180,gy);c.lineTo(180,gy-74);c.stroke();
    [[-1,-24],[1,-36],[-1,-52],[1,-62]].forEach((l,i)=>{
      const sc=0.55+0.55*gr;
      c.save();c.translate(180,gy+l[1]);c.rotate(l[0]*(-0.55)+Math.sin(t*1.2+i)*0.04);c.scale(l[0],1);
      c.globalCompositeOperation='lighter';glow(c,18*sc,0,26*sc,'120,255,160',0.18+0.15*gr);c.globalCompositeOperation='source-over';
      c.fillStyle='hsl(130,55%,'+(30+10*gr)+'%)';c.beginPath();c.ellipse(16*sc,0,18*sc,8*sc,0,0,TAU);c.fill();c.restore();
    });
    // 豆のさや
    const pod=sm(t,19,24);
    if(pod>0){
      [[205,gy-22],[158,gy-40],[210,gy-58]].forEach((p,i)=>{
        c.save();c.translate(p[0],p[1]);c.rotate(i%2?-.4:.4);c.scale(pod,pod);
        c.globalCompositeOperation='lighter';glow(c,0,12,26,'170,255,150',.25);c.globalCompositeOperation='source-over';
        c.fillStyle='#6ccf62';c.beginPath();c.roundRect(-5,0,10,34,5);c.fill();
        c.fillStyle='#c7f3a0';for(let k=0;k<4;k++){c.beginPath();c.arc(0,6+k*7.5,3.2,0,TAU);c.fill()}
        c.restore();
      });
    }
  }
});

// 9 ─────────── 大陸移動と動物 ───────────
S.push({
  id:'gondwana',pin:{t:12,text:'離ればなれ！'},hook:['大陸が割れた日、','動物の運命が分かれた'],tag:'地球のうごき × 進化',dur:28,
  title:'大陸が割れて、動物たちの運命も分かれた',
  beats:[
    {t:0,text:'南の大陸は<b>ひとつだった</b>'},
    {t:5,text:'1億8000万年前、<b>割れはじめる</b>'},
    {t:12,text:'生きものも<b>切り離された</b>'},
    {t:19,text:'豪州で<b>有袋類</b>が独自進化'},
    {t:24,text:'地球が<b>系統図</b>を描いた'}
  ],
  more:'ゴンドワナ超大陸(南米・アフリカ・インド・南極・オーストラリアなど)は、約1億8000万年前から分裂が進みました。有袋類は南米・南極・オーストラリアがまだつながっていた時代に広がり、その後オーストラリアが孤立して独自に多様化したと考えられています。遺伝子の挿入配列(レトロポゾン)の分析もこの説を支持します。',
  caveat:'図は理解のための「模式図」で、大陸の形・位置・分裂のタイミングは正確ではありません(分裂は地域ごとに数千万年単位でずれています)。有袋類の起源地や拡散経路には、まだ複数の説があります。',
  source:{short:'Nilsson et al. 2010, PLoS Biol.',cite:'Nilsson, M.A. et al. (2010). Tracking marsupial evolution using archaic genomic retroposon insertions. PLoS Biology, 8, e1000436.',query:'Tracking marsupial evolution using archaic genomic retroposon insertions'},
  init(W,H){const r=rng(71);
    const mk=(n,rad)=>{const ph=Array.from({length:5},()=>r()*TAU),am=Array.from({length:5},()=>.05+r()*.12);
      return Array.from({length:n},(_,i)=>{const a=i/n*TAU;let k=1;for(let h=0;h<5;h++)k+=am[h]*Math.sin(a*(h+2)+ph[h]);return[Math.cos(a)*rad*k,Math.sin(a)*rad*k*.9]})};
    const cont=[
      {n:'南米',j:[-62,-26],f:[-110,-40],r:36,c:'110,230,150'},
      {n:'アフリカ',j:[0,-52],f:[-24,-96],r:44,c:'255,190,100'},
      {n:'南極',j:[-12,24],f:[-4,98],r:46,c:'190,230,255'},
      {n:'インド',j:[50,-6],f:[104,-58],r:19,c:'255,150,150'},
      {n:'マダガスカル',j:[38,-32],f:[62,-46],r:8,c:'230,160,255'},
      {n:'豪州',j:[66,42],f:[110,70],r:30,c:'255,230,110'}
    ].map((c,i)=>({...c,poly:mk(26,c.r)}));
    return{cont,st:mkStars(70,W,H,19),hop:Array.from({length:7},()=>({x:(r()-.5)*40,y:(r()-.5)*30,p:r()*6}))}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#04070f'],[1,'#080d1b']]);
    stars(c,W,H,s.st,t,H);
    const cx=180,cy=H*0.37,K=1.0;
    // 緯度経度の格子
    c.strokeStyle='rgba(120,160,255,.07)';c.lineWidth=1;
    for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(cx+i*40,cy-170);c.lineTo(cx+i*40,cy+170);c.stroke();c.beginPath();c.moveTo(cx-170,cy+i*38);c.lineTo(cx+170,cy+i*38);c.stroke()}
    const p=sm(t,5,19);
    s.cont.forEach(k=>{
      const j=k.j,f=k.f;
      const wob=(1-p)*Math.sin(t*1.5+k.r)*1.2;
      const x=cx+mix(j[0],f[0],p)*K+wob,y=cy+mix(j[1],f[1],p)*K;
      const aus=k.n==='豪州',hl=aus?sm(t,18,21):0;
      c.save();c.translate(x,y);
      c.globalCompositeOperation='lighter';glow(c,0,0,k.r*K*2.3,k.c,0.14+0.28*hl*(0.7+0.3*Math.sin(t*3)));c.globalCompositeOperation='source-over';
      c.beginPath();k.poly.forEach((q,i)=>i?c.lineTo(q[0]*K,q[1]*K):c.moveTo(q[0]*K,q[1]*K));c.closePath();
      c.fillStyle='rgba('+k.c+','+(0.32+0.25*hl)+')';c.fill();
      c.strokeStyle='rgba('+k.c+',.95)';c.lineWidth=1.4;c.shadowColor='rgb('+k.c+')';c.shadowBlur=6;c.stroke();c.shadowBlur=0;
      if(k.r>10)txt(c,k.n,0,k.r*K+10,9,'rgba(255,255,255,.75)','center');
      if(aus&&hl>0.1){
        c.globalAlpha=hl;
        s.hop.forEach(h=>{const hy=-Math.abs(Math.sin(t*3+h.p))*7;c.fillStyle='#fff3b0';c.beginPath();c.arc(h.x*.6,h.y*.6+hy,2,0,TAU);c.arc(h.x*.6+3,h.y*.6+hy-3,1.2,0,TAU);c.fill()});
        txt(c,'有袋類',0,-k.r*K-12,11,'#fff0a8','center');c.globalAlpha=1;
      }
      c.restore();
    });
    // 年代
    const ma=Math.round(180*(1-p));
    txt(c,ma>0?'約 '+ma+' 百万年前':'現在',cx,cy-186+4,13,'rgba(180,210,255,.85)','center');
    txt(c,'※模式図',340,H*0.6,9,'rgba(160,190,230,.55)','right');
  }
});

// 10 ─────────── 大酸化イベント ───────────
S.push({
  id:'goe',pin:{t:9,text:'錆びた！'},hook:['地球最初の公害は、','「酸素」だった'],tag:'地球史 × 生命',dur:28,
  title:'最初の公害は、酸素だった',
  beats:[
    {t:0,text:'24億年前、<b>酸素ほぼゼロ</b>'},
    {t:4,text:'シアノバクテリアが<b>酸素を放出</b>'},
    {t:9,text:'海の鉄が<b>錆びて沈む</b>'},
    {t:15,text:'<b>空の色</b>まで変わる'},
    {t:21,text:'酸素は毒。でも<b>新時代の始まり</b>'}
  ],
  more:'大酸化イベント(約24〜20億年前)では、シアノバクテリアの光合成による酸素が、まず海中の溶存鉄を酸化して縞状鉄鉱層として沈殿させ、鉄を使い切ったあと大気へ蓄積しました。酸素は当時の嫌気性生物にとって有害でしたが、酸素呼吸は大きなエネルギーを生み、のちの多細胞生物・動物の進化の前提になりました。',
  caveat:'酸素が増えた時期や速度、空の色の変化などの詳細には幅があり、研究が進行中です。縞状鉄鉱層の形成は大酸化イベントより前から続いています。図は模式的で、時間も大きく圧縮しています。',
  source:{short:'Lyons et al. 2014, Nature',cite:'Lyons, T.W., Reinhard, C.T. & Planavsky, N.J. (2014). The rise of oxygen in Earth\'s early ocean and atmosphere. Nature, 506, 307–315.',query:'The rise of oxygen in Earth\'s early ocean and atmosphere'},
  init(W,H){const r=rng(81);
    return{fe:Array.from({length:110},()=>({x:r()*W,y:H*0.2+r()*H*0.3,tc:4+r()*11,v:.6+r()*.8,p:r()*6})),
      mats:Array.from({length:9},(_,i)=>({x:8+i*11+r()*3,h:3+r()*4})),
      ox:Array.from({length:30},()=>({x:20+r()*100,sp:.1+r()*.12,p:r()*6,o:r()})),st:mkStars(60,W,H*.2,17)}},
  draw(c,t,W,H,s){
    const surf=H*0.22,floor=H*0.64;
    const sk=sm(t,12,20);
    // 空
    vgrad(c,0,0,W,surf+4,[[0,lerpColor([48,24,24],[16,48,100],sk)],[1,lerpColor([130,78,52],[96,170,235],sk)]]);
    c.globalAlpha=1-sk;stars(c,W,H,s.st,t,surf);c.globalAlpha=1;
    // 海
    vgrad(c,0,surf,W,floor-surf,[[0,'#0d5d6e'],[1,'#06283a']]);
    c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;c.beginPath();
    for(let x=0;x<=W;x+=6)c.lineTo(x,surf+1.5*Math.sin(x*.08+t*2));c.stroke();
    // 縞状鉄鉱層
    const layers=Math.floor(sm(t,6,18)*14);
    for(let i=0;i<layers;i++){
      const y=floor-(i+1)*3.6;c.fillStyle=i%2?'rgb(112,40,28)':'rgb(52,48,56)';c.fillRect(0,y,W,3.6);
    }
    vgrad(c,0,floor,W,H-floor,[[0,'#2c2733'],[1,'#0a090d']]);
    // 鉄イオン
    const topY=floor-layers*3.6;
    c.globalCompositeOperation='lighter';
    s.fe.forEach(f=>{
      const done=t>f.tc;
      let x=f.x+Math.sin(t*.6+f.p)*8,y=f.y+Math.cos(t*.5+f.p)*6;
      if(done){const q=clamp((t-f.tc)*.12*f.v);y=mix(y,topY-2,q*q);}
      const col=done?'255,100,60':'110,255,215';
      const a=done?0.85:0.55;
      glow(c,x,y,5.5,col,a);
    });
    c.globalCompositeOperation='source-over';
    // シアノバクテリアのマット
    const mat=sm(t,2,5);
    s.mats.forEach((m,i)=>{
      c.fillStyle='hsl(150,60%,'+(28+8*Math.sin(t*2+i))+'%)';c.beginPath();c.ellipse(m.x,surf+6,6,m.h*mat,0,0,TAU);c.fill();
    });
    c.globalCompositeOperation='lighter';
    s.mats.forEach((m,i)=>glow(c,m.x,surf+6,12,'120,255,160',.25*mat));
    // 酸素の泡
    const bub=sm(t,4,6);
    s.ox.forEach((b,i)=>{
      const k=((t*b.sp+b.o)%1);
      const y=surf+14-k*(surf*1.0+ (k>.1?0:0));
      // 水中→空気中
      const inWater=k<0.18;
      if(inWater){const yy=surf+14-k/.18*14;glow(c,b.x+Math.sin(t*3+b.p)*3,yy,4,'200,240,255',.7*bub)}
      else{
        const q=(k-.18)/.82;const yy=surf-q*surf*.9;
        glow(c,b.x+q*(40+b.o*160)+Math.sin(t*2+b.p)*4,yy,5,'200,240,255',.75*bub*(1-q*.4));
      }
    });
    c.globalCompositeOperation='source-over';
    txt(c,'O₂',16,surf-18,13,'rgba(210,240,255,'+bub+')','left',900);
    // 酸素メーター
    const lv=sm(t,10,20)*0.95+0.03;
    const mx=336,mh=surf-30;
    c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.roundRect(mx-5,18,10,mh+8,5);c.fill();
    c.fillStyle='rgb(120,220,255)';c.beginPath();c.roundRect(mx-5,18+(mh+8)*(1-lv),10,(mh+8)*lv,5);c.fill();
    txt(c,'大気の酸素',mx,surf-0,8.5,'rgba(220,240,255,.85)','center');
    // ラベル
    if(layers>3)txt(c,'縞状鉄鉱層',W-14,floor-layers*3.6/2-4,10,'rgba(255,200,170,'+sm(t,10,12)+')','right');
    if(t<8)txt(c,'溶けた鉄(Fe²⁺)',180,floor-34,10,'rgba(150,255,225,'+(0.8-0.8*sm(t,6,9))+')','center');
  }
});


// 0 ─────────── 浮気ネズミ ───────────
function vole(c,x,y,a,col,sc){
  c.save();c.translate(x,y);c.rotate(a);c.scale(sc,sc);
  c.shadowColor=col;c.shadowBlur=12;c.fillStyle=col;
  c.beginPath();c.ellipse(0,0,11,7,0,0,TAU);c.fill();
  c.beginPath();c.arc(10,0,5.5,0,TAU);c.fill();
  c.beginPath();c.arc(8,-5,2.8,0,TAU);c.arc(8,5,2.8,0,TAU);c.fill();
  c.strokeStyle=col;c.lineWidth=1.2;c.beginPath();c.moveTo(-11,0);c.quadraticCurveTo(-18,3,-21,-2);c.stroke();
  c.shadowBlur=0;c.fillStyle='#1a1020';c.beginPath();c.arc(12,-1.8,1,0,TAU);c.fill();
  c.restore();
}
S.push({
  id:'vole',pin:{t:10.6,text:'遺伝子 +1！'},hook:['浮気ネズミが、','遺伝子1つで一途に'],tag:'愛の科学',dur:22,
  title:'浮気ネズミが、遺伝子1つで一途になった',
  beats:[
    {t:0,text:'ふつうのオスは<b>気ままに渡り歩く</b>'},
    {t:6,text:'脳の<b>バソプレシン受容体</b>に注目'},
    {t:10,text:'その遺伝子を<b>1つ足すと…</b>'},
    {t:13,text:'<b>1匹のメスに</b>ずっと寄り添う'},
    {t:18,text:'ヒトも？ <b>それはまだ不明</b>'}
  ],
  more:'ハタネズミの仲間には、つがいで暮らす種(プレーリーハタネズミ)と、特定のパートナーを持たない種(メドウハタネズミ)がいます。違いの一つは、脳の報酬系でのバソプレシン受容体(V1aR)の量。パートナーを持たない種のオスの脳でこの遺伝子を発現させると、特定のメスを好むようになりました。',
  caveat:'ネズミでの結果です。ヒトの恋愛や浮気が1つの遺伝子で決まるという意味ではありません。ヒトでは関連遺伝子と結びつきの強さの相関を調べた研究がある程度で、因果は分かっていません。',
  source:{short:'Lim et al. 2004, Nature',cite:'Lim, M.M. et al. (2004). Enhanced partner preference in a promiscuous species by manipulating the expression of a single gene. Nature, 429, 754–757.',query:'Enhanced partner preference in a promiscuous species by manipulating the expression of a single gene'},
  init(W,H){const r=rng(91);return{st:mkStars(50,W,H*.6,21),rec:Array.from({length:26},()=>({a:r()*TAU,d:Math.sqrt(r())*24,p:r()*6}))}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#150a1f'],[1,'#07040c']]);
    stars(c,W,H,s.st,t,H*.6);
    const y1=H*0.25,y2=H*0.47,cx=180,cy=(y1+y2)/2;
    const F=[[85,y1],[275,y1],[85,y2],[275,y2]];
    const B=sm(t,10.5,13.5);
    // メス
    const fp=F.map((f,i)=>i===0?[mix(f[0],cx+36,B),mix(f[1],cy,B)]:[mix(f[0],f[0]+(f[0]<cx?-30:30),B),f[1]]);
    // オスの位置
    let mx,my,ang;
    if(t<10.5){
      const k=t/2.6,i=Math.floor(k)%4,j=(i+1)%4,e=sm(k%1,0.35,1);
      mx=mix(F[i][0],F[j][0],e)+(i%2?-30:30)*(1-Math.abs(2*e-1)*0);my=mix(F[i][1],F[j][1],e);
      mx=mix(F[i][0]+(F[i][0]<cx?28:-28),F[j][0]+(F[j][0]<cx?28:-28),e);
      ang=Math.atan2(F[j][1]-F[i][1],F[j][0]-F[i][0]+(e<1?0:0));
      if(e<=0.01||e>=0.99)ang=Math.PI*(F[j][0]<cx?1:0);
    }else{const o=(t-10.5)*1.6;const rr=mix(40,34,B);mx=fp[0][0]+Math.cos(o+Math.PI)*rr*B+(1-B)*(F[0][0]+28-fp[0][0]);my=fp[0][1]+Math.sin(o+Math.PI)*rr*B+(1-B)*(F[0][1]-fp[0][1]);ang=o+Math.PI/2*1;}
    // 絆の線
    c.globalCompositeOperation='lighter';
    if(B>0){
      c.strokeStyle='rgba(255,120,190,'+0.55*B+')';c.lineWidth=2+1.5*Math.sin(t*4);
      c.beginPath();c.moveTo(fp[0][0],fp[0][1]);c.lineTo(mx,my);c.stroke();
      for(let i=0;i<6;i++){const u=(t*.4+i/6)%1;glow(c,mix(fp[0][0],mx,u),mix(fp[0][1],my,u),9,'255,140,200',0.8*B*Math.sin(u*Math.PI))}
      glow(c,(fp[0][0]+mx)/2,(fp[0][1]+my)/2,36,'255,100,170',0.25*B);
    }else{
      F.forEach((f,i)=>{c.strokeStyle='rgba(255,255,255,.08)';c.setLineDash([3,5]);c.beginPath();c.moveTo(f[0],f[1]);c.lineTo(mx,my);c.stroke();c.setLineDash([])});
    }
    c.globalCompositeOperation='source-over';
    fp.forEach((f,i)=>{c.globalAlpha=i===0?1:1-0.75*B;vole(c,f[0],f[1],i%2?Math.PI:0,'#ff9ac9',1.25);c.globalAlpha=1});
    vole(c,mx,my,ang,'#7fb4ff',1.35);
    txt(c,'オス',mx,my-22,10,'rgba(160,200,255,.9)','center');
    // 遺伝子フラッシュ
    const fl=sm(t,9.8,10.6)*(1-sm(t,10.6,12.5));
    if(fl>0){
      c.globalCompositeOperation='lighter';glow(c,cx,cy,220*fl+40,'200,150,255',0.45*fl);c.globalCompositeOperation='source-over';
      c.strokeStyle='rgba(235,210,255,'+fl+')';c.lineWidth=2.5;
      for(let k=0;k<2;k++){c.beginPath();for(let i=0;i<=40;i++){const yy=cy-70+i*3.5,xx=cx+Math.sin(i*.35+t*4+k*Math.PI)*22;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke()}
      txt(c,'遺伝子 +1',cx,cy+84,16,'rgba(240,220,255,'+fl+')','center',900);
    }
    // 脳パネル(受容体)
    const bx=292,by=H*0.585;
    c.strokeStyle='rgba(210,170,255,.5)';c.lineWidth=1.2;c.beginPath();c.ellipse(bx,by,34,22,0,0,TAU);c.stroke();
    const n=Math.round(4+22*sm(t,10.5,14));
    c.globalCompositeOperation='lighter';
    s.rec.slice(0,n).forEach(r=>glow(c,bx+Math.cos(r.a)*r.d*1.3,by+Math.sin(r.a)*r.d*.8,5,'200,140,255',0.6+0.4*Math.sin(t*3+r.p)));
    c.globalCompositeOperation='source-over';
    txt(c,'脳の受容体',bx,by+34,9,'rgba(220,190,255,.85)','center');
    txt(c,t<10.5?'ふつうのオス':'遺伝子を足したオス',20,H*0.585,11,t<10.5?'rgba(190,200,255,.85)':'rgba(255,170,215,.95)','left');
  }
});

// 12 ─────────── アメリカ大交差 ───────────
S.push({
  id:'interchange',pin:{t:12.5,text:'ぶつかった！'},hook:['大陸がぶつかると、','動物が入れ替わる'],tag:'地球のうごき × 進化',dur:24,
  title:'陸がつながった日、南北アメリカの動物が入れ替わった',
  beats:[
    {t:0,text:'南米は、長いあいだ<b>孤島</b>だった'},
    {t:5,text:'独自の動物が<b>勝手に進化</b>していた'},
    {t:10,text:'そこへ北米と<b>陸がつながる</b>'},
    {t:14,text:'南北で<b>動物が大移動</b>'},
    {t:19,text:'<b>ぶつかった場所</b>で、生態系が作り直された'}
  ],
  more:'南アメリカは約6000万年前から長く他の大陸から離れ、アルマジロやナマケモノの仲間、巨大なグリプトドンなど独自の哺乳類が進化しました。中央アメリカで陸橋が完成して南北がつながると、北からネコ科・イヌ科・ウマ・シカなどが南下し、南からはオポッサム、アルマジロ、ヤマアラシなどが北上しました(アメリカ大陸間大交差)。',
  caveat:'陸橋の完成時期は約300万年前が定説でしたが、近年は1000万年以上前から部分的にあったとする研究もあり、議論が続いています。南米の固有動物の絶滅が、北からの動物のせいかどうかも単純には言えません。図は模式図です。',
  source:{short:'Marshall et al. 1982, Science / Montes et al. 2015',cite:'Marshall, L.G. et al. (1982). Mammalian evolution and the Great American Interchange. Science, 215, 1351–1357. / Montes, C. et al. (2015). Middle Miocene closure of the Central American Seaway. Science, 348, 226–229.',query:'Mammalian evolution and the Great American Interchange'},
  init(W,H){const r=rng(97);
    const ny=H*0.2,sy=H*0.44;
    const N=[[-85,-55],[85,-60],[62,-5],[24,38],[9,70],[-9,70],[-24,34],[-72,0]].map(p=>[180+p[0],ny+p[1]]);
    const So=[[-10,-62],[10,-62],[56,-40],[60,-8],[36,42],[14,86],[0,92],[-16,52],[-46,-6],[-42,-38]].map(p=>[180+p[0],sy+p[1]]);
    const inN=()=>[180+(r()-.5)*110,ny+(r()-.5)*70-8],inS=()=>[180+(r()-.5)*60,sy+(r()-.2)*100-10];
    const an=Array.from({length:9},(_,i)=>({n:true,h:inN(),d:inS(),tk:12.5+i*.9,p:r()*6}));
    const as=Array.from({length:9},(_,i)=>({n:false,h:inS(),d:inN(),tk:12.8+i*.9,p:r()*6}));
    return{ny,sy,N,So,an:an.concat(as),st:mkStars(70,W,H,22)}},
  draw(c,t,W,H,s){
    vgrad(c,0,0,W,H,[[0,'#04101f'],[1,'#06182c']]);
    stars(c,W,H,s.st,t,H);
    c.strokeStyle='rgba(120,180,255,.06)';c.lineWidth=1;
    for(let i=0;i<10;i++){c.beginPath();c.moveTo(0,H*0.05+i*38);c.lineTo(W,H*0.05+i*38);c.stroke()}
    const br=sm(t,9.5,12.5);
    const poly=(P,col,a)=>{c.beginPath();P.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();
      c.fillStyle='rgba('+col+','+a+')';c.fill();c.strokeStyle='rgba('+col+',.9)';c.lineWidth=1.4;c.shadowColor='rgb('+col+')';c.shadowBlur=7;c.stroke();c.shadowBlur=0};
    // 近づく(模式)
    const gap=mix(6,0,sm(t,6,11));
    c.save();c.translate(0,-gap);poly(s.N,'255,190,100',.28);c.restore();
    c.save();c.translate(0,gap);poly(s.So,'110,230,150',.28);c.restore();
    // 陸橋
    const by0=s.ny+70-gap,by1=s.sy-62+gap;
    c.globalCompositeOperation='lighter';
    if(br>0){const h=(by1-by0)*br;c.fillStyle='rgba(255,230,160,'+(0.55*br)+')';c.fillRect(176,by0,8,h);glow(c,180,by0+h/2,46,'255,220,140',0.3*br)}
    // 衝突の衝撃波
    c.globalCompositeOperation='source-over';
    txt(c,'北米',300,s.ny-10,12,'rgba(255,210,150,.9)','center');
    txt(c,'南米',90,s.sy+10,12,'rgba(150,240,180,.9)','center');
    // 動物
    s.an.forEach(a=>{
      const u=clamp((t-a.tk)/3.4),e=u*u*(3-2*u);
      let x,y;
      if(u<=0){x=a.h[0]+Math.sin(t*1.3+a.p)*5;y=a.h[1]+Math.cos(t*1.1+a.p)*4}
      else if(u>=1){x=a.d[0]+Math.sin(t*1.3+a.p)*5;y=a.d[1]+Math.cos(t*1.1+a.p)*4}
      else{
        const way=[[a.h[0],a.h[1]],[180,a.n?by0-4:by1+4],[180,a.n?by1+4:by0-4],[a.d[0],a.d[1]]];
        const pt=polyAt(way,e);x=pt[0];y=pt[1];
      }
      const col=a.n?'255,170,70':'90,230,140';
      c.globalCompositeOperation='lighter';glow(c,x,y,10,col,0.5);c.globalCompositeOperation='source-over';
      c.fillStyle='rgb('+col+')';
      if(a.n){c.beginPath();c.ellipse(x,y,4.5,3,0,0,TAU);c.fill();c.beginPath();c.moveTo(x+2,y-2);c.lineTo(x+3.5,y-6);c.lineTo(x+5,y-2);c.fill()}
      else{c.beginPath();c.ellipse(x,y,5.5,3.6,0,0,TAU);c.fill();c.strokeStyle='rgba(0,40,20,.55)';c.lineWidth=.8;c.beginPath();c.moveTo(x-2,y-3);c.lineTo(x-2,y+3);c.moveTo(x+1,y-3);c.lineTo(x+1,y+3);c.stroke()}
    });
    // ラベル/凡例
    const ly=H*0.585;
    c.fillStyle='#ffaa46';c.beginPath();c.arc(30,ly,4,0,TAU);c.fill();txt(c,'北の動物(ネコ・ウマ・シカなど)',40,ly,10,'rgba(255,215,160,.9)','left');
    c.fillStyle='#5ae68c';c.beginPath();c.arc(30,ly+18,4,0,TAU);c.fill();txt(c,'南の動物(アルマジロ・ナマケモノなど)',40,ly+18,10,'rgba(170,250,200,.9)','left');
    if(t>10.5)txt(c,'パナマの陸橋',204,(by0+by1)/2,10,'rgba(255,235,180,'+sm(t,10.5,12)+')','left');
  }
});

S.push({
  id:'deer',pin:{t:14,text:'足元が空っぽ！'},hook:['鹿が増えすぎると','森はどうなる？'],tag:'森と動物のつながり',dur:24,
  title:'鹿が増えすぎた森では、何が起きる？',
  beats:[
    {t:0,text:'下草が<b>茂る森</b>に、鳥の声'},
    {t:5,text:'鹿が<b>増えていく</b>'},
    {t:10,text:'草も低木も<b>食べられる</b>'},
    {t:14,text:'林の<b>足元が空っぽ</b>に'},
    {t:19,text:'<b>鳥や虫</b>にも広がる'}
  ],
  more:'シカ類は世界各地で急に増えています。シカは植物を選んで食べるので、草・低木・若木の育ち方が変わり、食べ続けられた森では植物の量と種類が減ります。その影響は昆虫や鳥、ほかの哺乳類にも広がり、一度単純になった状態は元に戻りにくいことがある、と総説は述べています。',
  caveat:'これは模式図です。頭数や時間は実際の数字ではありません。論文(総説)は「シカの過密が森を単純にし、鳥や昆虫にも波及する」と述べますが、抄録には具体的な数値はありません。また、クマやオオカミがいなくなったことがシカ増加の原因になるかは、この動画では扱っていません(未確認)。',
  source:{short:'Côté et al. 2004, Annu Rev Ecol Evol Syst',cite:'Côté, S.D., Rooney, T.P., Tremblay, J.-P., Dussault, C. & Waller, D.M. (2004). Ecological impacts of deer overabundance. Annual Review of Ecology, Evolution, and Systematics, 35, 113–147. doi:10.1146/annurev.ecolsys.35.021103.105725',query:'Ecological impacts of deer overabundance Côté 2004'},
  init(W,H){const r=rng(77);
    return{
      trunks:Array.from({length:7},(_,i)=>({x:20+i*52+r()*14,w:7+r()*5})),
      plants:Array.from({length:34},(_,i)=>({x:14+i*10.2+r()*4,h:12+r()*20,te:6+r()*9,sw:r()*6})),
      deer:Array.from({length:9},(_,i)=>({t0:2+i*1.2,x0:(i%2?W+20:-20),dir:i%2?-1:1,gx:40+r()*280,ph:r()*6,sp:6+r()*5,y:r()*10})),
      birds:Array.from({length:6},(_,i)=>({x:40+i*55+r()*15,y:0.16+r()*0.12,tl:13+i*1.6,p:r()*6}))
    }},
  draw(c,t,W,H,s){
    const gy=H*0.5;
    vgrad(c,0,0,W,H,[[0,'#07170f'],[1,'#0c2a1a']]);
    // 木の幹
    s.trunks.forEach(k=>{c.fillStyle='#1c2a1c';c.fillRect(k.x,0,k.w,gy);c.fillStyle='rgba(120,200,120,.05)';c.fillRect(k.x,0,2,gy)});
    // 樹冠の影
    c.globalCompositeOperation='lighter';glow(c,W/2,H*0.02,W*0.6,'90,200,110',0.12);c.globalCompositeOperation='source-over';
    // 地面
    vgrad(c,0,gy,W,H*0.12,[[0,'#2a1d12'],[1,'#120c07']]);
    // 下草
    s.plants.forEach(p=>{
      const eat=sm(t,p.te,p.te+2.2);
      const h=p.h*(1-eat*0.93);
      if(h<1)return;
      const sw=Math.sin(t*1.5+p.sw)*1.5;
      c.strokeStyle='hsl('+(115+p.sw*3)+',45%,'+(32+8*(1-eat))+'%)';c.lineWidth=1.6;c.lineCap='round';
      for(let k=-1;k<=1;k++){c.beginPath();c.moveTo(p.x,gy);c.quadraticCurveTo(p.x+k*4+sw,gy-h*0.5,p.x+k*7+sw,gy-h*(k?0.75:1));c.stroke()}
    });
    // 鳥
    s.birds.forEach(b=>{
      const fl=clamp((t-b.tl)/3.5);
      let x=b.x,y=H*b.y;
      if(fl>0){x+=fl*(b.x<W/2?-1:1)*120;y-=fl*fl*H*0.2+fl*20}
      if(x<-10||x>W+10||y<-10)return;
      const wing=fl>0?Math.sin(t*22+b.p)*4:0;
      c.fillStyle='#e8d070';c.beginPath();c.ellipse(x,y,5,3.2,0,0,TAU);c.fill();
      c.beginPath();c.arc(x+4.5,y-2,2.4,0,TAU);c.fill();
      c.strokeStyle='#e8d070';c.lineWidth=1.3;c.beginPath();c.moveTo(x-1,y);c.lineTo(x-4,y-3-wing);c.stroke();
      if(fl===0){c.strokeStyle='#4a3a20';c.beginPath();c.moveTo(x-12,y+5);c.lineTo(x+12,y+5);c.stroke()}
    });
    // 鹿
    let n=0;
    s.deer.forEach(d=>{
      if(t<d.t0)return;n++;
      const u=sm(t,d.t0,d.t0+4);
      const x=mix(d.x0,d.gx,u)+Math.sin(t*0.4+d.ph)*8*u;
      const moving=u<1;
      elk(c,x,gy+6+d.y,1.5,d.dir>0?1:-1,t*d.sp*0.5+d.ph,moving?0.05:0.9+0.1*Math.sin(t*2+d.ph),'#d9b27a');
    });
    // 頭数
    txt(c,'シカ '+n+' 頭(模式)',W-12,H*0.04,12,'rgba(240,215,160,.9)','right');
    // 空っぽ表示
    const em=sm(t,14,16);
    if(em>0)txt(c,'下草がほとんどない',W/2,gy+H*0.1,13,'rgba(255,200,150,'+em+')','center');
  }
});

window.SCENES=[S[S.length-1],S[10],S[0],S[1],S[2],S[3],S[4],S[5],S[6],S[7],S[8],S[11],S[9]];
})();
