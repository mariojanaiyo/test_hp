(function(){
'use strict';
const LW=360; // 描画の論理幅。高さは画面比率で変わる
const feed=document.getElementById('feed');
const autoBtn=document.getElementById('auto');
const hint=document.getElementById('hint');
const sheet=document.getElementById('sheet');
const scrim=document.getElementById('scrim');
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
let likes=new Set(store.get('cs-likes',[]));
let auto=store.get('cs-auto',true);
const SPEED=1.35, HOOK_T=3.4; // 動画を速めに流す / 冒頭フックの表示時間(動画内秒)
let paused=false, sheetOpen=false, active=-1;

const cards=window.SCENES.map((sc,i)=>{
  const el=document.createElement('article');
  el.className='card';
  el.innerHTML=
    '<canvas></canvas><div class="shade"></div><div class="dim"></div>'+
    '<div class="hook"><p>'+sc.hook[0]+'</p><p class="a">'+sc.hook[1]+'</p></div>'+
    '<div class="bar"><i></i></div>'+
    '<div class="chip">'+sc.tag+'</div>'+
    '<div class="cap"><p class="line"></p><div class="dots">'+sc.beats.map(()=>'<i></i>').join('')+'</div></div>'+
    '<div class="src">'+sc.source.short+'</div>'+
    '<div class="rail"><button class="like" aria-label="好き">♡</button><button class="info" aria-label="くわしく">i<small>論文</small></button></div>'+
    '<div class="pausemark">❚❚</div>';
  feed.appendChild(el);
  const cv=el.querySelector('canvas');
  const card={sc,el,cv,c:cv.getContext('2d'),t:0,loops:0,beat:-1,state:null,k:1,W:LW,H:640,
    line:el.querySelector('.line'),dots:[...el.querySelectorAll('.dots i')],bar:el.querySelector('.bar i'),likeBtn:el.querySelector('.like')};
  if(likes.has(sc.id)){card.likeBtn.classList.add('on');card.likeBtn.textContent='♥'}
  card.likeBtn.addEventListener('click',e=>{
    e.stopPropagation();
    const on=!likes.has(sc.id);
    on?likes.add(sc.id):likes.delete(sc.id);
    card.likeBtn.classList.toggle('on',on);card.likeBtn.textContent=on?'♥':'♡';
    store.set('cs-likes',[...likes]);
  });
  el.querySelector('.info').addEventListener('click',e=>{e.stopPropagation();openSheet(card)});
  el.addEventListener('click',()=>{paused=!paused;syncPause()});
  new ResizeObserver(()=>resize(card)).observe(el);
  return card;
});

function resize(card){
  const w=card.el.clientWidth,h=card.el.clientHeight;
  if(!w||!h)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  card.cv.width=Math.round(w*dpr);card.cv.height=Math.round(h*dpr);
  card.k=w/LW;card.W=LW;card.H=h/card.k;card.dpr=dpr;
  card.state=card.sc.init(card.W,card.H);
  render(card);
}
function render(card){
  if(!card.state)return;
  const c=card.c,s=card.k*card.dpr;
  c.setTransform(s,0,0,s,0,0);
  c.globalCompositeOperation='source-over';c.globalAlpha=1;c.shadowBlur=0;
  card.sc.draw(c,card.t,card.W,card.H,card.state);
}
function setBeat(card){
  let b=0;
  card.sc.beats.forEach((x,i)=>{if(card.t>=x.t)b=i});
  if(b===card.beat)return;
  card.beat=b;
  const L=card.line;
  L.innerHTML=card.sc.beats[b].text;
  L.className='line'+(b===0?' first':'');
  void L.offsetWidth; // アニメーション再始動
  card.dots.forEach((d,i)=>d.classList.toggle('on',i<=b));
}
function syncPause(){cards.forEach((c,i)=>c.el.classList.toggle('paused',paused&&i===active))}
function activate(i){
  if(i===active)return;
  active=i;
  const card=cards[i];
  card.t=0;card.loops=0;card.beat=-1;
  card.state=card.sc.init(card.W,card.H);
  paused=false;syncPause();
  setBeat(card);
  if(i>0)hint.classList.add('gone');
}
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=0.6)activate(cards.findIndex(c=>c.el===e.target))});
},{root:feed,threshold:[0.6]});
cards.forEach(c=>io.observe(c.el));

function next(dir){
  const i=Math.min(cards.length-1,Math.max(0,active+dir));
  if(i===active&&dir>0){cards[0].el.scrollIntoView({behavior:'smooth'});return}
  cards[i].el.scrollIntoView({behavior:'smooth'});
}
let last=performance.now();
function frame(now){
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  const card=cards[active];
  if(card){
    if(!paused&&!sheetOpen){
      card.t+=dt*SPEED;
      if(card.t>=card.sc.dur){
        card.t-=card.sc.dur;card.loops++;card.beat=-1;
        if(auto&&card.loops>=1)next(1);
      }
    }
    card.el.classList.toggle('hooking',card.t<HOOK_T);
    setBeat(card);
    card.bar.style.width=(card.t/card.sc.dur*100)+'%';
    render(card);
  }
  requestAnimationFrame(frame);
}

function openSheet(card){
  const sc=card.sc;
  document.getElementById('shTitle').textContent=sc.title;
  document.getElementById('shMore').textContent=sc.more;
  document.getElementById('shCaveat').textContent=sc.caveat;
  document.getElementById('shCite').textContent=sc.source.cite;
  document.getElementById('shLink').href='https://scholar.google.com/scholar?q='+encodeURIComponent(sc.source.query);
  sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');scrim.hidden=false;sheetOpen=true;
}
function closeSheet(){sheet.classList.remove('open');sheet.setAttribute('aria-hidden','true');scrim.hidden=true;sheetOpen=false}
document.getElementById('sheetClose').addEventListener('click',closeSheet);
scrim.addEventListener('click',closeSheet);

function syncAuto(){autoBtn.setAttribute('aria-pressed',String(auto))}
autoBtn.addEventListener('click',()=>{auto=!auto;store.set('cs-auto',auto);syncAuto()});
syncAuto();

window.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeSheet();
  else if(e.key==='ArrowDown'||e.key==='j'){e.preventDefault();next(1)}
  else if(e.key==='ArrowUp'||e.key==='k'){e.preventDefault();next(-1)}
  else if(e.key===' '){e.preventDefault();paused=!paused;syncPause()}
});

// テスト・デバッグ用: 任意のショートの任意の時刻を描画する
window.Shorts={cards,seek(i,t){
  cards[i].el.scrollIntoView();active=i;paused=true;syncPause();
  const c=cards[i];
  c.state=c.sc.init(c.W,c.H);
  // 状態を持つシーン(アリなど)のために少しずつ時間を進める
  for(let x=0;x<=t;x+=0.1){c.t=x;render(c)}
  c.t=t;c.beat=-1;c.el.classList.toggle('hooking',t<HOOK_T);setBeat(c);render(c);
}};
requestAnimationFrame(frame);
})();
