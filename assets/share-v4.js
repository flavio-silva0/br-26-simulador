/* BR26 | Compartilhamento e reveal: zero dependencies */
'use strict';

// Tela intermediária. Nenhuma tabela é construída/exibida enquanto o apito final não tocar.
let revealTimer=null;
function simReveal(){
  return `<div class="sim-reveal-screen" aria-live="polite"><div class="reveal-live">44 palpites concluídos</div><span class="reveal-big" id="reveal-number" aria-hidden="true">3</span><h3 id="reveal-heading">Preparando sua tabela</h3><p id="reveal-description">Os pontos e os critérios de desempate definem a classificação final.</p><div class="reveal-meter"><div class="reveal-meter-label"><span id="reveal-step">Somando os pontos</span><b id="reveal-percent">0%</b></div><div class="reveal-track"><div class="reveal-fill" id="reveal-fill"></div></div></div></div>`;
}
function startRevealSequence(){
  if(revealTimer)clearInterval(revealTimer);
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduce?250:1200,started=performance.now();
  const states=[['3','Somando os pontos'],['2','Conferindo os resultados'],['1','Aplicando os desempates'],['✓','Tabela pronta']];
  function step(){
    if(game.phase!=='reveal'){clearInterval(revealTimer);revealTimer=null;return;}
    const progress=Math.min(1,(performance.now()-started)/duration),pos=Math.min(3,Math.floor(progress*4));
    const [num,label]=states[pos];
    const n=document.getElementById('reveal-number'),p=document.getElementById('reveal-percent'),b=document.getElementById('reveal-fill'),t=document.getElementById('reveal-step');
    if(!n||!b)return;
    n.textContent=num;t.textContent=label;p.textContent=Math.round(progress*100)+'%';b.style.width=(progress*100)+'%';
    if(progress===1){
      clearInterval(revealTimer);revealTimer=null;
      // A classificação só é calculada no momento da revelação efetiva.
      game.phase='result';saveGame();renderSimulation();
      const y=document.getElementById('view-simulation');if(y&&page==='simulation') window.scrollTo({top:0,behavior:'instant'});
    }
  }
  step();revealTimer=setInterval(step,60);
}

const shareState={format:'story',blob:null,previewURL:null,busy:false,closeFocus:null,key:null,assets:new Map()};
function sitePublicUrl(){
  if(!/^https?:$/.test(location.protocol)||/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname))return '';
  return location.origin+location.pathname;
}
function publicHost(){return sitePublicUrl()?location.host:'SEU LINK NA VERCEL';}
function shareText(){
  const r=computeFinal();if(!r)return '';
  const p=r.rows.findIndex(t=>t.name===game.favorite)+1,fan=r.rows[p-1];
  return `⚽ EU MONTEI MINHA TABELA DO BRASILEIRÃO 2026!\n\n🏆 Meu campeão: ${r.rows[0].name}.\n🔥 Meu ${game.favorite} terminou em ${p}º, com ${fan.pts} pontos.\n\n${sitePublicUrl()?`👉 Jogue também: ${sitePublicUrl()}`:'👉 Jogue também no BR26 (link disponível após publicar na Vercel)'}`;
}
function shareDescription(){return document.getElementById('share-caption')?.value||shareText();}
function canvasRound(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function fitText(ctx,text,maxWidth,minSize=16){let size=parseInt(ctx.font.match(/\d+px/)?.[0]||'20',10);while(size>minSize&&ctx.measureText(text).width>maxWidth){size-=1;ctx.font=ctx.font.replace(/\d+px/,size+'px')}return size;}
function fillRight(ctx,text,x,y){ctx.textAlign='right';ctx.fillText(String(text),x,y);ctx.textAlign='left';}
function paintLogo(ctx,img,x,y,w,h){if(!img)return false;try{const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;if(!iw||!ih)return false;const s=Math.min(w/iw,h/ih);ctx.drawImage(img,x+(w-iw*s)/2,y+(h-ih*s)/2,iw*s,ih*s);return true}catch(_){return false}}
function loadAsset(id){
  if(shareState.assets.has(id))return shareState.assets.get(id);
  const path=id==='league'?'assets/brasileirao-serie-a-2026.svg':crestPath(id);
  const url=location.protocol==='file:'&&id!=='league'?crestRemote(id):path;
  const promise=new Promise(resolve=>{
    const img=new Image();img.crossOrigin='anonymous';
    const timeout=setTimeout(()=>{img.onload=null;img.onerror=null;resolve(null)},7000);
    img.onload=()=>{clearTimeout(timeout);resolve(img)};
    img.onerror=()=>{clearTimeout(timeout);resolve(null)};
    img.src=url;
  });
  shareState.assets.set(id,promise);return promise;
}
async function makeShareArtwork(format){
  const result=computeFinal();if(!result)throw new Error('Ainda não existe tabela completa.');
  const story=format==='story';const W=1080,H=story?1920:1350;
  const canvas=document.createElement('canvas');const scale=2;canvas.width=W*scale;canvas.height=H*scale;
  const c=canvas.getContext('2d',{alpha:false});
  c.scale(scale,scale);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const rows=result.rows,favPos=rows.findIndex(x=>x.name===game.favorite)+1,favorite=rows[favPos-1];
  const teamImgs=await Promise.all(rows.map(t=>loadAsset(t.name))),leagueImg=await loadAsset('league');
  const imap=Object.fromEntries(rows.map((t,i)=>[t.name,teamImgs[i]]));
  if(document.fonts?.ready)await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,800))]);
  // Solid background keeps the table readable when shared at smaller sizes.
  c.fillStyle='#141817';c.fillRect(0,0,W,H);
  c.fillStyle='#1c2420';c.fillRect(0,0,W,story?366:263);
  c.fillStyle='#b9dc78';c.fillRect(64,0,88,6);
  const titleY=story?138:108;
  c.textBaseline='alphabetic';c.textAlign='left';
  c.fillStyle='#c8f56e';c.font='800 24px Arial, Arial';c.fillText('BR26  /  MODO TORCEDOR',64,story?69:53);
  c.fillStyle='#fff';c.font=`800 ${story?66:57}px Arial, Arial`;c.fillText('MINHA TABELA FINAL',64,titleY);
  c.fillStyle='#b6cdcb';c.font=`700 ${story?25:23}px Arial, Arial`;c.fillText('BRASILEIRÃO SÉRIE A · 2026',64,titleY+(story?47:37));
  const logoSize=story?122:99;
  if(!paintLogo(c,leagueImg,W-64-logoSize,story?62:39,logoSize,logoSize)){
    c.fillStyle='#c9f56b';c.font='800 38px Arial,Arial';c.fillText('SÉRIE A',W-260,story?100:80)
  }
  // Personal fan card
  const fy=story?239:175,fh=story?99:73;
  canvasRound(c,64,fy,W-128,fh,18);c.fillStyle='#1b3132';c.fill();c.strokeStyle='#b4f36d65';c.lineWidth=2;c.stroke();
  paintLogo(c,imap[game.favorite],84,fy+10,story?75:53,story?78:54);
  c.fillStyle='#9dd3c0';c.font=`800 ${story?19:15}px Arial,Arial`;c.fillText('EU TORÇO PELO',story?177:154,fy+(story?35:27));
  c.font=`850 ${story?30:25}px Arial,Arial`;c.fillStyle='#f5f9f6';c.fillText(game.favorite.toUpperCase(),story?177:154,fy+(story?70:54));
  c.textAlign='right';c.fillStyle='#c9f56b';c.font=`800 ${story?42:33}px Arial,Arial`;c.fillText(favPos+'º',W-90,fy+(story?51:44));
  c.fillStyle='#b7d7c3';c.font=`750 ${story?17:15}px Arial,Arial`;c.fillText(favorite.pts+' PONTOS',W-90,fy+(story?78:62));c.textAlign='left';
  // Shared standings banner
  const tblY=story?382:282;
  c.font=`850 ${story?24:19}px Arial,Arial`;c.fillStyle='#ffffff';c.fillText('CLASSIFICAÇÃO FINAL',64,tblY);
  c.textAlign='right';c.fillStyle='#97b3b0';c.font=`650 ${story?17:14}px Arial,Arial`;c.fillText('38 RODADAS · 20 CLUBES',W-64,tblY);c.textAlign='left';
  const headY=tblY+17,headH=story?49:35,rowH=story?70:47,rowStart=headY+headH;
  canvasRound(c,64,headY,W-128,headH,9);c.fillStyle='#20363f';c.fill();
  const cols=[{t:'POS',x:83},{t:'CLUBE',x:189},{t:'PTS',x:596},{t:'J',x:655},{t:'V',x:710},{t:'E',x:765},{t:'D',x:815},{t:'GP',x:874},{t:'GC',x:926},{t:'SG',x:997}];
  c.font=`800 ${story?17:13}px Arial,Arial`;c.fillStyle='#c1d7d0';c.textBaseline='middle';
  cols.forEach(({t,x},i)=>{if(i<2){c.textAlign='left';c.fillText(t,x,headY+headH/2)}else{c.textAlign='right';c.fillText(t,x,headY+headH/2)}});c.textAlign='left';
  rows.forEach((t,i)=>{
    const y=rowStart+i*rowH,z4=i>=16,g4=i<4,selected=t.name===game.favorite;
    const background=selected?'#294331':z4?(i%2?'#291f2c':'#2b222d'):(i%2?'#152631':'#111f2c');
    c.fillStyle=background;c.fillRect(64,y,W-128,rowH-1);
    c.fillStyle=g4?'#c9f56b':z4?'#ff7383':selected?'#82dbaa':'#3a5864';c.fillRect(64,y,4,rowH-1);
    if(selected){c.strokeStyle='#c9f56b85';c.lineWidth=1;c.strokeRect(64,y,W-128,rowH-1)}
    c.textBaseline='middle';c.textAlign='left';c.font=`800 ${story?23:18}px Arial,Arial`;c.fillStyle=g4?'#d7f9a3':z4?'#ff9bac':'#acbfce';c.fillText(String(i+1).padStart(2,'0'),82,y+rowH/2);
    const logoBox=story?38:27; if(!paintLogo(c,imap[t.name],137,y+(rowH-logoBox)/2,logoBox,logoBox)){
      c.fillStyle='#8dab91';c.font=`850 ${story?16:12}px Arial,Arial`;c.fillText((META[t.name]||[])[3]||t.name.slice(0,3),139,y+rowH/2);
    }
    c.fillStyle='#f3f8f9';c.font=`750 ${story?21:17}px Arial,Arial`;
    fitText(c,t.name,story?335:343,story?16:13);c.fillText(t.name,story?189:183,y+rowH/2);
    c.textAlign='right';
    const valList=[t.pts,t.played,t.wins,t.draws,t.losses,t.gf,t.ga,(t.gd>0?'+':'')+t.gd];
    const xs=[596,655,710,765,815,874,926,997];
    valList.forEach((v,j)=>{
      c.font=`${j===0?'850':'650'} ${story?(j===0?25:19):(j===0?19:15)}px ${j===0?'Arial,Arial':'Arial,Arial'}`;
      c.fillStyle=j===0?'#d6f99a':(j===7&&t.gd<0?'#f8a0a7':'#c3d4d7');c.fillText(String(v),xs[j],y+rowH/2);
    });c.textAlign='left';
  });
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Seu navegador não gerou o PNG.')),'image/png'));
}
async function updateSharePreview(format){
  shareState.format=format;shareState.busy=true;shareState.blob=null;
  document.querySelectorAll('[data-share-format]').forEach(b=>b.classList.toggle('active',b.dataset.shareFormat===format));
  const frame=document.querySelector('.share-preview-shell');frame?.classList.toggle('is-feed',format==='feed');
  const status=document.getElementById('share-preview-status');status.hidden=false;status.innerHTML='<span class="share-loader"></span>Gerando imagem…';
  document.querySelectorAll('[data-share-platform]').forEach(b=>b.disabled=true);
  try{
    const blob=await makeShareArtwork(format);
    if(format!==shareState.format)return;
    if(shareState.previewURL)URL.revokeObjectURL(shareState.previewURL);
    shareState.previewURL=URL.createObjectURL(blob);shareState.blob=blob;
    document.getElementById('share-preview').src=shareState.previewURL;
    status.hidden=true;
  }catch(e){console.error('Falha ao preparar compartilhamento:',e);status.innerHTML='Não foi possível gerar esta imagem. Tente novamente.';toast('Não foi possível gerar a imagem.');}
  finally{if(format===shareState.format){shareState.busy=false;document.querySelectorAll('[data-share-platform]').forEach(b=>b.disabled=!shareState.blob)}}
}
function openShare(){
  if(game.phase!=='result'||!computeFinal())return;
  shareState.closeFocus=document.activeElement;
  const modal=document.getElementById('share-overlay');modal.hidden=false;
  document.body.classList.add('share-open');
  document.getElementById('share-caption').value=shareText();
  modal.querySelector('.share-dialog').focus();
  updateSharePreview(shareState.format);
}
function closeShare(){document.getElementById('share-overlay').hidden=true;document.body.classList.remove('share-open');shareState.closeFocus?.focus?.();}
function pngFile(){return new File([shareState.blob],`BR26_tabela_${(CREST_SLUGS[game.favorite]||'torcedor')}_${shareState.format}.png`,{type:'image/png'});}
function saveShareImage(){
  if(!shareState.blob){toast('A imagem ainda está sendo gerada.');return}
  const url=URL.createObjectURL(shareState.blob),a=document.createElement('a');a.href=url;a.download=pngFile().name;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  toast('Imagem completa salva em PNG.');
}
async function copyShareCaption(){
  const text=shareDescription();
  try{await navigator.clipboard.writeText(text)}catch(_){const field=document.createElement('textarea');field.value=text;document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}
  toast('Mensagem copiada.');
}
function canShareFile(){if(!shareState.blob||typeof navigator.canShare!=='function'||typeof navigator.share!=='function')return false;try{return navigator.canShare({files:[pngFile()]})}catch(_){return false}}
function sendNativeShare(platform){
  // This call executes from the button interaction, not from an async image-building effect.
  if(canShareFile()){
    const data={title:'Minha tabela final | BR26',text:shareDescription(),files:[pngFile()]};
    toast(platform?`Escolha ${platform} na lista de aplicativos.`:'Escolha onde compartilhar a imagem e o convite.');
    navigator.share(data).catch(e=>{if(e.name!=='AbortError'){console.warn('Share failed',e);toast('O app não aceitou o envio. Salve a imagem e tente novamente.')}});
    return true;
  }
  if(platform){saveShareImage();return false}
  saveShareImage();
  if(navigator.share)navigator.share({title:'BR26 — Meu Brasileirão 2026',text:shareDescription(),url:sitePublicUrl()||undefined}).catch(()=>copyShareCaption());
  else copyShareCaption();
  toast('Imagem salva. Anexe o PNG ao compartilhar o convite.');
  return false;
}
function openSocial(url){window.open(url,'_blank','noopener,noreferrer')}
function shareToPlatform(kind){
  if(!shareState.blob){toast('A imagem está sendo gerada.');return}
  const caption=shareDescription(),url=sitePublicUrl();
  if(kind==='download'){saveShareImage();return}
  if(kind==='copy'){copyShareCaption();return}
  if(kind==='native'){sendNativeShare();return}
  if(kind==='whatsapp'){
    if(sendNativeShare('WhatsApp'))return;
    openSocial('https://api.whatsapp.com/send?text='+encodeURIComponent(caption));
    toast('WhatsApp aberto com o convite. Anexe o PNG que foi salvo.');return;
  }
  if(kind==='instagram'){
    if(sendNativeShare('Instagram'))return;
    copyShareCaption();openSocial('https://www.instagram.com/');
    toast('Imagem salva. Poste no Instagram e cole o convite.');return;
  }
  if(kind==='x'){
    saveShareImage();const text='⚽ Eu montei minha tabela final do Brasileirão 2026 no BR26! Quem aceita o desafio? '+(url||'');
    openSocial('https://twitter.com/intent/tweet?text='+encodeURIComponent(text));
    toast('Anexe a imagem PNG ao seu post.');return;
  }
  if(kind==='telegram'){
    if(sendNativeShare('Telegram'))return;
    openSocial('https://t.me/share/url?url='+encodeURIComponent(url||'')+'&text='+encodeURIComponent(caption));
    toast('Telegram aberto. Anexe o PNG salvo.');return;
  }
}
document.addEventListener('click',e=>{
  if(e.target.id==='share-overlay'){closeShare();return}
  const closer=e.target.closest('[data-share-close]');if(closer){closeShare();return}
  const format=e.target.closest('[data-share-format]');if(format){if(format.dataset.shareFormat!==shareState.format)updateSharePreview(format.dataset.shareFormat);return}
  const action=e.target.closest('[data-share-platform]');if(action){shareToPlatform(action.dataset.sharePlatform)}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('share-overlay').hidden){closeShare();e.stopPropagation()}});
