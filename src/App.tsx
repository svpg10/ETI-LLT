"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Atom, BookOpen, ChevronDown, ChevronRight, CircleDot, Code2, FlaskConical, Home, Pause, Play, RotateCcw, SlidersHorizontal, Waves } from "lucide-react";
import { CodeWorkbench } from "@/components/code-workbench";
import { PlotGraph, ScopeCanvas } from "@/components/simulation-view";
import { getResult, LABS, type Lab, type LabId, type Values } from "@/lib/labs";

function readRoute():LabId|null {
  if(typeof window==="undefined")return null;
  const matched=window.location.hash.match(/^#\/lab\/([1-5])$/);
  return matched?Number(matched[1]) as LabId:null;
}

function Brand({light=false}:{light?:boolean}) {
  return <a href="#/" className={`brand ${light?"brand-light":""}`} aria-label="SVPG Electromagnetics Lab home">
    <span className="brand-mark"><Atom size={23} strokeWidth={1.6}/></span>
    <span className="brand-copy"><strong>SVPG <em>LAB</em></strong><small>APPLIED PHYSICS BUREAU</small></span>
  </a>;
}

function TopNav({active}:{active:LabId|null}) {
  return <header className={`global-header ${active?"lab-header":""}`}>
    <div className="header-inner">
      <Brand light={active!==null}/>
      <nav className="header-menu" aria-label="Primary navigation">
        <a href="#/" className={!active?"current":""}>HOME</a>
        <a href="#/lab/1" className={active?"current":""}>SIMULATIONS</a>
        <a href="#experiment-index">INDEX</a>
      </nav>
      <div className="header-stamp"><span className="pulse-dot"/> <span>INSTRUMENTS ONLINE</span><span className="header-stamp-num">05 / 05</span></div>
    </div>
  </header>;
}

function OrbitArt() {
  return <div className="orbit-art" aria-label="Decorative illustration of electromagnetic field orbits" role="img">
    <svg viewBox="0 0 540 520" aria-hidden="true">
      <defs><radialGradient id="core" cx="38%" cy="30%" r="70%"><stop stopColor="#ffe3a1"/><stop offset=".45" stopColor="#c4834d"/><stop offset="1" stopColor="#603c2c"/></radialGradient></defs>
      <circle cx="275" cy="253" r="216" fill="none" stroke="#8aa99a" strokeWidth="1" strokeDasharray="4 8"/>
      <circle cx="275" cy="253" r="163" fill="none" stroke="#7eaa99" strokeWidth="1.5"/>
      <circle cx="275" cy="253" r="113" fill="none" stroke="#8ba99b" strokeWidth="1.5"/>
      <ellipse cx="275" cy="253" rx="217" ry="86" transform="rotate(-35 275 253)" fill="none" stroke="#3c786d" strokeWidth="1.4"/>
      <ellipse cx="275" cy="253" rx="217" ry="86" transform="rotate(34 275 253)" fill="none" stroke="#3c786d" strokeWidth="1.4"/>
      <circle cx="275" cy="253" r="52" fill="url(#core)" stroke="#f4c98c" strokeWidth="4"/>
      <circle cx="275" cy="253" r="67" fill="none" stroke="#b78b57" strokeWidth="1" strokeDasharray="2 5"/>
      <circle cx="82" cy="344" r="9" fill="#c49a59"/><circle cx="454" cy="179" r="6" fill="#6ea18c"/>
      <path d="M58 100h78 M58 100v52 M420 436h73 M493 390v46" stroke="#a3afa2" fill="none" strokeWidth="1.4"/>
      <text x="58" y="91" fontSize="11" fill="#5a786c" fontFamily="monospace">FIG. A — FIELD LINES</text>
      <text x="354" y="460" fontSize="11" fill="#5a786c" fontFamily="monospace">Q / ε₀</text>
    </svg>
    <span className="orbit-serial">EXPERIMENTAL REFERENCE / 2026</span>
  </div>;
}

function Landing() {
  return <main className="landing">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line"/> SRM IST · ECE · COURSE 21ECC205T</div>
        <div className="hero-index">VOL. 01 <span>—</span> ELECTROMAGNETIC FIELD STUDIES</div>
        <h1>Invisible forces.<br/><em>Visible</em> experiments.</h1>
        <p>A digital physics laboratory where equations come alive. Explore five electromagnetic case studies with real-time controls, animated instruments, numerical graphs and readable Python source.</p>
        <div className="hero-actions">
          <a href="#/lab/1" className="btn btn-dark">ENTER THE LAB <ArrowRight size={18}/></a>
          <a href="#experiment-index" className="text-link">Browse experiments <ArrowUpRight size={16}/></a>
        </div>
        <div className="hero-byline"><span className="small-cross">✣</span><span><strong>SRK. VENKAT PRANAV GUPTA</strong><small>RA2511004011037 · II YEAR / III SEM / ECE</small></span></div>
      </div>
      <div className="hero-visual"><OrbitArt/><div className="hero-visual-caption"><span>ILLUSTRATION 01</span><span>THE FIELD IS EVERYWHERE.</span></div></div>
    </section>
    <section className="stats-strip" aria-label="Laboratory information">
      <div><strong>05</strong><span>COURSE-ALIGNED EXPERIMENTS</span></div>
      <div><strong>03</strong><span>PHYSICS DOMAINS</span></div>
      <div><strong>∞</strong><span>PARAMETER COMBINATIONS</span></div>
      <div><strong>PY</strong><span>DOWNLOADABLE SOURCE CODE</span></div>
    </section>
    <section id="experiment-index" className="experiment-index">
      <div className="section-heading"><div><div className="eyebrow">THE EXPERIMENT ARCHIVE / 01–05</div><h2>Choose your experiment.</h2></div><p>Five questions. Five scientific models. Each one has a code workspace and a live instrument to explore.</p></div>
      <div className="experiment-list">
        {LABS.map((l)=><a href={`#/lab/${l.id}`} className="experiment-card" key={l.id}>
          <div className="card-num">{String(l.id).padStart(2,"0")}</div>
          <div className="card-body"><span className="card-tag">{l.tag}</span><h3>{l.title}</h3><p>{l.subtitle}</p></div>
          <div className={`card-symbol symbol-${l.id}`} aria-hidden="true">{l.id===1?<CircleDot/>:l.id===2?<Atom/>:l.id===3?<FlaskConical/>:l.id===4?<Waves/>:<SlidersHorizontal/>}</div>
          <span className="card-arrow"><ArrowUpRight size={22}/></span>
        </a>)}
      </div>
      <div className="archive-note"><BookOpen size={18}/><span>BUILT FROM THE LLT1 CASE-STUDY QUESTIONS · ELECTROMAGNETIC THEORY AND INTERFERENCE</span><span>ACADEMIC YEAR 2026–27</span></div>
    </section>
  </main>;
}

function RangeControl({c,value,onChange}:{c:Lab["controls"][number];value:number;onChange:(v:number)=>void}) {
  const percent=100*(value-c.min)/(c.max-c.min);
  return <label className="control-block">
    <div className="control-head"><span>{c.label}</span><strong>{Number.isInteger(value)?value:value.toFixed(2)} <small>{c.unit}</small></strong></div>
    <input type="range" min={c.min} max={c.max} step={c.step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{"--fill":`${percent}%`} as React.CSSProperties}/>
    <div className="control-minmax"><span>{c.min} {c.unit}</span><span>{c.max} {c.unit}</span></div>
  </label>;
}

function LabScreen({id}:{id:LabId}) {
  const lab=LABS[id-1];
  const [values,setValues]=useState<Values>(lab.defaults);
  const [playing,setPlaying]=useState(true);
  const [runKey,setRunKey]=useState(0);
  const [panel,setPanel]=useState<"scope"|"plot">("scope");
  const result=getResult(id,values);
  function reset(){setValues(lab.defaults);setRunKey(v=>v+1);setPlaying(true);}
  function run(){setRunKey(v=>v+1);setPlaying(true);}
  return <main className="lab-shell" id="experiment-index">
    <aside className="lab-sidebar" aria-label="Experiment file explorer">
      <div className="sidebar-overline">EXPLORER <span>···</span></div>
      <a href="#/" className="sidebar-home"><Home size={15}/> LABORATORY HOME</a>
      <div className="sidebar-folder"><ChevronDown size={14}/> LLT1_CASE_STUDIES <span>05</span></div>
      <nav className="lab-menu" aria-label="Select a question">
        {LABS.map(l=><a key={l.id} href={`#/lab/${l.id}`} aria-current={id===l.id?"page":undefined} className={id===l.id?"selected":""}>
          <ChevronRight size={13}/><span className="menu-number">{String(l.id).padStart(2,"0")}</span><span>Question {l.id}<small>{l.short}</small></span>
        </a>)}
      </nav>
      <div className="sidebar-folder secondary-folder"><ChevronDown size={14}/> SOURCE FILES</div>
      <div className="sidebar-python"><Code2 size={14}/>{lab.file}</div>
      <div className="sidebar-bottom"><div className="status-ring"/> SESSION ACTIVE<br/><span>SCIENTIFIC INSTRUMENTS 2026</span></div>
    </aside>
    <div className="lab-content">
      <nav className="question-tabs" aria-label="Question menu">
        {LABS.map(l=><a href={`#/lab/${l.id}`} key={l.id} className={id===l.id?"active":""}>{String(l.id).padStart(2,"0")} <span>{l.short}</span></a>)}
      </nav>
      <section className="lab-intro">
        <div><div className="eyebrow lab-eyebrow">EXPERIMENT {String(id).padStart(2,"0")} / 05 · {lab.tag}</div><h1>{lab.title}</h1><p>{lab.subtitle}</p></div>
        <div className="formula-stamp"><span>GOVERNING RELATION</span><strong>{lab.formula}</strong></div>
      </section>
      <div className="lab-grid">
        <CodeWorkbench lab={lab} terminal={result.terminal}/>
        <div className="instrument-column">
          <section className="instrument-card">
            <div className="instrument-title"><span><span className="live-dot"/> INSTRUMENT MONITOR</span><span>CH 0{id} · CRT MODEL</span></div>
            <div className="instrument-tabs"><button onClick={()=>setPanel("scope")} className={panel==="scope"?"active":""}><CircleDot size={14}/> MODEL VIEW</button><button onClick={()=>setPanel("plot")} className={panel==="plot"?"active":""}><Waves size={14}/> RESULT PLOT</button></div>
            {panel==="scope"?<ScopeCanvas id={id} values={values} playing={playing} runKey={runKey}/>:<div className="plot-in-scope"><PlotGraph plot={result.plot}/></div>}
            <div className="scope-controls"><span><span className="live-dot"/> {playing?"ANIMATION ACTIVE":"ANIMATION PAUSED"}</span><div><button onClick={()=>setPlaying(v=>!v)} aria-label={playing?"Pause animation":"Play animation"}>{playing?<Pause size={14}/>:<Play size={14}/>} {playing?"Pause":"Play"}</button><button onClick={run}><RotateCcw size={14}/> Restart</button></div></div>
          </section>
          <section className="parameters-card"><div className="section-mini-title"><SlidersHorizontal size={17}/> LIVE PARAMETERS <span>DRAG TO EXPLORE</span></div>
            <div className="parameters-controls">{lab.controls.map(c=><RangeControl key={c.key} c={c} value={values[c.key]} onChange={v=>setValues(old=>({...old,[c.key]:v}))}/>)}</div>
            <div className="parameter-actions"><button onClick={run} className="run-button"><Play size={15} fill="currentColor"/> RUN SIMULATION</button><button onClick={reset} className="reset-button"><RotateCcw size={15}/> Reset</button></div>
          </section>
        </div>
      </div>
      <section className="analysis-grid" aria-label="Numerical results and explanation">
        <div className="results-card"><div className="section-mini-title"><Waves size={17}/> NUMERICAL PLOT <span>MODEL OUTPUT</span></div><h2>{result.plot.title}</h2><PlotGraph plot={result.plot}/><p className="model-note">{result.note}</p></div>
        <div className="results-right"><div className="metrics-card"><div className="section-mini-title"><CircleDot size={17}/> READOUTS <span>COMPUTED LIVE</span></div><div className="metrics-grid">{result.metrics.map(m=><div key={m.label}><span>{m.label}</span><strong>{m.value}<small>{m.unit}</small></strong></div>)}</div></div>
          <div className="theory-card"><div className="eyebrow">FIELD NOTE / Q{id}</div><h2>The physics behind it.</h2><p>{lab.theory}</p><div className="theory-divider"/><p><strong>Engineering inference.</strong> {lab.interpretation}</p></div>
        </div>
      </section>
      <div className="lab-footer"><a href={id>1?`#/lab/${id-1}`:"#/"}><ArrowLeft size={16}/> {id>1?`Previous: Q${id-1}`:"Back home"}</a><span>LIVE BROWSER MODEL · DOWNLOADABLE PYTHON · NOT MEASURED DATA</span><a href={id<5?`#/lab/${id+1}`:"#/"}>{id<5?`Next: Q${id+1}`:"Return to archive"} <ArrowRight size={16}/></a></div>
    </div>
  </main>;
}

export default function HomePage() {
  const [route,setRoute]=useState<LabId|null>(null);
  useEffect(()=>{const update=()=>{setRoute(readRoute());window.scrollTo(0,0);};update();window.addEventListener("hashchange",update);return()=>window.removeEventListener("hashchange",update);},[]);
  return <div className={route?"site theme-lab":"site theme-paper"}><a href="#main-content" className="skip-link">Skip to content</a><TopNav active={route}/><div id="main-content">{route?<LabScreen key={route} id={route}/>:<Landing/>}</div><footer className="global-footer"><span>© 2026 SVPG LAB · SRM IST ECE</span><span>DESIGN & COMPUTATION BY SRIKAKULAM VENKAT PRANAV GUPTA</span><a href="#/">RETURN TO TOP ↑</a></footer></div>;
}
