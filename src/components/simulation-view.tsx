"use client";

import { useEffect, useRef } from "react";
import type { LabId, Plot, Values } from "@/lib/labs";
import { reflection } from "@/lib/labs";

const GREEN = "#9cedb6";
const AMBER = "#f3bb7a";
const BLUE = "#91c7c8";

function line(ctx: CanvasRenderingContext2D, points: [number,number][], color: string, width = 1.5, alpha = 1) {
  ctx.beginPath();
  points.forEach(([x,y], i) => i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y));
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha; ctx.stroke(); ctx.globalAlpha = 1;
}

function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1, width = 1) {
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha=alpha;ctx.stroke();ctx.globalAlpha=1;
}

function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 15;
  ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();ctx.restore();
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width=1.7) {
  const a = Math.atan2(y2-y1,x2-x1);
  line(ctx,[[x1,y1],[x2,y2]],color,width);
  line(ctx,[[x2-7*Math.cos(a-.55),y2-7*Math.sin(a-.55)],[x2,y2],[x2-7*Math.cos(a+.55),y2-7*Math.sin(a+.55)]],color,width);
}

function label(ctx: CanvasRenderingContext2D, words: string, x: number, y: number, color=BLUE, size=11) {
  ctx.fillStyle=color;ctx.font=`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;ctx.fillText(words,x,y);
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, id: number) {
  ctx.fillStyle="#0b1e1e";ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(126, 202, 164, .075)";ctx.lineWidth=1;
  for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  ctx.strokeStyle="rgba(126, 202, 164, .14)";
  ctx.strokeRect(15,15,w-30,h-30);
  label(ctx,`FIG 0${id}   /   FIELD INSTRUMENT`,25,32,"#a5c6b5",10);
  label(ctx,"CALIBRATED  •  IDEAL MODEL",Math.max(25,w-220),h-21,"#6f9a8a",9);
  ctx.fillStyle="#f0b66d";ctx.fillRect(w-38,23,6,6);
}

function drawGauss(ctx: CanvasRenderingContext2D, w: number, h: number, p: Values, t: number) {
  const cx=w/2,cy=h/2+8;
  const scale = Math.min(w,h)/340;
  const sphere=42*scale;
  const maxr=Math.min(w*0.39,h*0.39);
  const k = 22;
  for(let i=0;i<k;i++){
    const a=2*Math.PI*i/k;
    const inner=sphere*1.2,outer=maxr;
    arrow(ctx,cx+inner*Math.cos(a),cy+inner*Math.sin(a),cx+outer*Math.cos(a),cy+outer*Math.sin(a),GREEN,1.2);
    const pos=inner+((t*26+i*17)%(outer-inner));
    glowDot(ctx,cx+pos*Math.cos(a),cy+pos*Math.sin(a),1.8,AMBER);
  }
  const grad=ctx.createRadialGradient(cx-15,cy-14,5,cx,cy,sphere);
  grad.addColorStop(0,"#d1f3cc");grad.addColorStop(.4,"#5a9d85");grad.addColorStop(1,"#194a44");
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,sphere,0,2*Math.PI);ctx.fill();
  ring(ctx,cx,cy,sphere+2,"#d9ebc3",.95,1.8);
  label(ctx,"Q = "+p.q.toFixed(1)+" µC",cx-43,cy+4,"#0c2629",12);
  const markerR=sphere+(p.r-.1)/.4*(maxr-sphere);
  ring(ctx,cx,cy,markerR,AMBER,.52,1.6);
  glowDot(ctx,cx+markerR,cy,4,AMBER);
  label(ctx,`r = ${p.r.toFixed(2)} m`,cx+markerR+9,cy-9,AMBER,10);
  label(ctx,"RADIAL E FIELD",28,h-22,GREEN,11);
}

function drawCoil(ctx: CanvasRenderingContext2D,w:number,h:number,p:Values,t:number) {
  const cx=w/2,cy=h/2+4,r=Math.min(w*.29,h*.30);
  for(let i=0;i<11;i++){
    ctx.beginPath();ctx.ellipse(cx+(i-5)*3.1,cy,r*.47,r,0,0,Math.PI*2);
    ctx.strokeStyle=i%2?"#c18058":"#ebaa72";ctx.lineWidth=2.4;ctx.stroke();
  }
  for(let j=0;j<5;j++){
    const radius=r*(.6+j*.21);
    ctx.beginPath();ctx.ellipse(cx,cy,radius*.75,radius*.35,0,Math.PI,Math.PI*2);
    ctx.strokeStyle=GREEN;ctx.lineWidth=1.2;ctx.globalAlpha=.38;ctx.stroke();ctx.globalAlpha=1;
  }
  for(let i=-3;i<=3;i++){
    const x=cx+i*24;
    arrow(ctx,x,cy+r*.72,x,cy-r*.72,GREEN,1.4);
    glowDot(ctx,x,cy+Math.sin(t*1.8+i)*r*.55,2.0,GREEN);
  }
  ctx.setLineDash([4,6]);line(ctx,[[cx-r*.9,cy],[cx+r*.9,cy]],AMBER,1,.75);ctx.setLineDash([]);
  glowDot(ctx,cx,cy,5,AMBER);
  label(ctx,"SENSOR AT CENTER",cx+15,cy-12,AMBER,10);
  label(ctx,`${p.n} TURNS  /  ${p.i.toFixed(1)} A`,28,h-22,GREEN,11);
}

function drawMaxwell(ctx: CanvasRenderingContext2D,w:number,h:number,p:Values,t:number) {
  const cx=w/2,cy=h/2;
  const plateH=Math.min(h*.54,200),gap=Math.min(w*.35,190);
  const x0=cx-gap/2,x1=cx+gap/2;
  ctx.fillStyle="#bf9866";ctx.fillRect(x0-10,cy-plateH/2,14,plateH);
  ctx.fillStyle="#90c7b2";ctx.fillRect(x1-4,cy-plateH/2,14,plateH);
  for(let j=-3;j<=3;j++){
    const y=cy+j*plateH/8;
    arrow(ctx,x0+14,y,x1-16,y,GREEN,1.4);
    const tx=(t*p.i*65+j*35)%(gap-42);
    glowDot(ctx,x0+14+tx,y,2.0,AMBER);
  }
  for(let i=0;i<5;i++){
    const rr=28+i*19;
    ctx.beginPath();ctx.ellipse(cx,cy,rr*.65,rr,Math.PI/2,0,Math.PI*2);
    ctx.strokeStyle=BLUE;ctx.lineWidth=1.2;ctx.globalAlpha=.22+i*.06;ctx.stroke();ctx.globalAlpha=1;
  }
  label(ctx,"+ PLATE",x0-40,cy-plateH/2-12,AMBER,10);
  label(ctx,"− PLATE",x1-20,cy-plateH/2-12,GREEN,10);
  label(ctx,"Iᴅ = "+p.i.toFixed(2)+" A",28,h-22,GREEN,11);
}

function drawLine(ctx: CanvasRenderingContext2D,w:number,h:number,p:Values,t:number) {
  const g=reflection(p.r,p.x);
  const left=38,right=w-38,mid=h/2+6,amp=Math.min(h*.26,89);
  line(ctx,[[left,mid],[right,mid]],"#56817b",1);
  const forward:[number,number][]=[],back:[number,number][]=[],sum:[number,number][]=[];
  for(let i=0;i<=240;i++){
    const u=i/240,x=left+(right-left)*u;
    const phase=u*4*Math.PI;
    const a=Math.sin(phase-t*1.6),b=g.magnitude*Math.sin(phase+t*1.6+Math.atan2(g.im,g.re));
    forward.push([x,mid-amp*.68*a]);back.push([x,mid-amp*.68*b]);sum.push([x,mid-amp*.68*(a+b)]);
  }
  line(ctx,forward,"#5aaca0",1.1,.55);
  line(ctx,back,AMBER,1.0,.55);
  ctx.save();ctx.shadowColor=GREEN;ctx.shadowBlur=9;line(ctx,sum,GREEN,2.4,1);ctx.restore();
  label(ctx,"FORWARD",left,58,"#5aaca0",10);label(ctx,"REFLECTED",left+100,58,AMBER,10);
  label(ctx,"SUPERPOSITION",left+218,58,GREEN,10);
  label(ctx,`ZL = ${p.r} ${p.x<0?"−":"+"} j${Math.abs(p.x)} Ω`,28,h-22,GREEN,11);
}

function drawSmith(ctx: CanvasRenderingContext2D,w:number,h:number,p:Values) {
  const r=Math.min(h*.35,w*.28),cx=w/2,cy=h/2+8;
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
  for(const R of [.2,.5,1,2,5]){
    const center=R/(1+R),rad=1/(1+R);
    ring(ctx,cx+r*center,cy,r*rad,"#5a8c7c",.56,.95);
  }
  for(const X of [-5,-2,-1,-.5,.5,1,2,5]){
    const yc=-r/X;
    ring(ctx,cx+r,cy+yc,Math.abs(r/X),"#5a8c7c",.45,.85);
  }
  ctx.restore();ring(ctx,cx,cy,r,GREEN,.96,1.7);
  line(ctx,[[cx-r,cy],[cx+r,cy]],"#6a9a89",.9);
  const g=reflection(p.r,p.x),lx=cx+g.re*r,ly=cy-g.im*r;
  const after=(p.r-50)/(p.r+50);
  const ax=cx+after*r;
  ctx.setLineDash([5,5]);line(ctx,[[lx,ly],[ax,cy],[cx,cy]],AMBER,1.5);ctx.setLineDash([]);
  glowDot(ctx,lx,ly,5.5,GREEN);glowDot(ctx,ax,cy,3.5,AMBER);glowDot(ctx,cx,cy,3,BLUE);
  label(ctx,"LOAD",Math.min(w-65,lx+12),ly-10,GREEN,10);
  label(ctx,"MATCHED",cx+9,cy+20,BLUE,10);
  label(ctx,"SERIES COMPENSATION → λ/4",28,h-22,GREEN,10);
}

export function ScopeCanvas({id, values, playing, runKey}: {id:LabId;values:Values;playing:boolean;runKey:number}) {
  const ref=useRef<HTMLCanvasElement|null>(null);
  const reducedRef=useRef(false);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    let frame=0;let elapsed=0;let last=0;
    reducedRef.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w=0,h=0;
    const resize=()=>{
      const bounds=canvas.getBoundingClientRect();
      const scale=Math.min(window.devicePixelRatio||1,2);
      w=bounds.width;h=bounds.height;
      canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
      ctx.setTransform(scale,0,0,scale,0,0);
      paint();
    };
    const paint=()=>{
      if(!w||!h)return;
      drawBackground(ctx,w,h,id);
      if(id===1)drawGauss(ctx,w,h,values,elapsed);
      if(id===2)drawCoil(ctx,w,h,values,elapsed);
      if(id===3)drawMaxwell(ctx,w,h,values,elapsed);
      if(id===4)drawLine(ctx,w,h,values,elapsed);
      if(id===5)drawSmith(ctx,w,h,values);
    };
    const loop=(now:number)=>{
      if(last && playing && !reducedRef.current)elapsed+=Math.min((now-last)/1000,.05);
      last=now;paint();frame=requestAnimationFrame(loop);
    };
    const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
    frame=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[id,values,playing,runKey]);
  return <canvas ref={ref} className="scope-canvas" aria-label={`Animated scientific model for Question ${id}`} role="img"/>;
}

export function PlotGraph({plot}:{plot:Plot}) {
  const width=720,height=250,left=62,right=22,top=28,bottom=43;
  const pw=width-left-right,ph=height-top-bottom;
  const sx=(x:number)=>left+(x-plot.x0)/(plot.x1-plot.x0)*pw;
  const sy=(y:number)=>top+(1-(y-plot.ymin)/(plot.ymax-plot.ymin))*ph;
  const points=plot.x.map((x,i)=>`${sx(x).toFixed(1)},${sy(plot.y[i]).toFixed(1)}`).join(" ");
  const xs=Array.from({length:6},(_,i)=>plot.x0+(plot.x1-plot.x0)*i/5);
  const ys=Array.from({length:5},(_,i)=>plot.ymin+(plot.ymax-plot.ymin)*i/4);
  const fmt=(v:number)=>Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):v.toFixed(2);
  return <svg viewBox={`0 0 ${width} ${height}`} className="plot-svg" role="img" aria-label={`${plot.title}. Horizontal axis: ${plot.xlabel}. Vertical axis: ${plot.ylabel}.`}>
    <g stroke="#c2d6be" strokeWidth=".8" opacity=".7">
      {xs.map((x,i)=><line key={`gx${i}`} x1={sx(x)} x2={sx(x)} y1={top} y2={top+ph}/>)}
      {ys.map((y,i)=><line key={`gy${i}`} x1={left} x2={left+pw} y1={sy(y)} y2={sy(y)}/>)}
    </g>
    <g fill="#5b7068" fontSize="12" fontFamily="ui-monospace, Consolas, monospace">
      {xs.map((x,i)=><text key={`x${i}`} x={sx(x)} y={top+ph+18} textAnchor="middle">{fmt(x)}</text>)}
      {ys.map((y,i)=><text key={`y${i}`} x={left-10} y={sy(y)+4} textAnchor="end">{fmt(y)}</text>)}
    </g>
    <polyline points={points} fill="none" stroke="#167b67" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
    {plot.marker&&<><line x1={sx(plot.marker.x)} x2={sx(plot.marker.x)} y1={top} y2={top+ph} stroke="#bd7b46" strokeDasharray="4 5" strokeWidth="1.4"/><circle cx={sx(plot.marker.x)} cy={sy(plot.marker.y)} r="5.5" fill="#c7804c" stroke="#fff8e7" strokeWidth="2"/></>}
    <text x={left} y="16" fill="#24473f" fontSize="13" fontFamily="ui-monospace, Consolas, monospace">{plot.ylabel}</text>
    <text x={left+pw/2} y={height-5} textAnchor="middle" fill="#24473f" fontSize="13" fontFamily="ui-monospace, Consolas, monospace">{plot.xlabel}</text>
  </svg>;
}
