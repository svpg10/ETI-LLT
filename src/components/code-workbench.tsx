"use client";

import { useState } from "react";
import { Check, Copy, Download, FileCode2, Files, Terminal } from "lucide-react";
import type { Lab } from "@/lib/labs";

const tokenRegex = /(#[^\n]*|"""[^"\n]*"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:import|from|def|return|if|else|for|in|print|as|True|False|None)\b|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/gi;

function codeLine(line: string) {
  return line.split(tokenRegex).filter(Boolean).map((part, i) => {
    const cls = part.startsWith("#") ? "tok-comment" : part.startsWith("'") || part.startsWith('"') ? "tok-string"
      : /^(import|from|def|return|if|else|for|in|print|as|true|false|none)$/i.test(part) ? "tok-keyword"
      : /^\d/.test(part) ? "tok-number" : "";
    return <span className={cls} key={i}>{part}</span>;
  });
}

export function CodeWorkbench({lab,terminal}:{lab:Lab;terminal:string[]}) {
  const [copied,setCopied]=useState(false);
  async function copy() {
    try {await navigator.clipboard.writeText(lab.code);setCopied(true);window.setTimeout(()=>setCopied(false),1600);}
    catch {setCopied(false);}
  }
  function download() {
    const url=URL.createObjectURL(new Blob([lab.code],{type:"text/x-python;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=lab.file;a.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className="editor-card" aria-label="Python code workspace">
    <div className="editor-titlebar">
      <div className="window-dots" aria-hidden="true"><i/><i/><i/></div>
      <span>SVPG / ELECTROMAGNETICS / {lab.file}</span>
      <span className="readonly-badge">PYTHON REFERENCE</span>
    </div>
    <div className="editor-main">
      <div className="activity-rail" aria-hidden="true"><Files size={19}/><FileCode2 size={19}/><Terminal size={19}/></div>
      <div className="editor-content">
        <div className="editor-tab"><FileCode2 size={15}/><span>{lab.file}</span><span className="dirty-dot"/></div>
        <div className="code-scroll" role="region" aria-label={`${lab.file} source code`} tabIndex={0}>
          <div className="code-list">
            {lab.code.trimEnd().split("\n").map((l,i)=><div className="code-row" key={i}>
              <span className="line-number" aria-hidden="true">{i+1}</span>
              <code>{codeLine(l)}</code>
            </div>)}
          </div>
        </div>
        <div className="terminal-shell">
          <div className="terminal-header"><span><Terminal size={13}/> BROWSER MODEL OUTPUT</span><span>✓ MODEL READY</span></div>
          <div className="terminal-lines" aria-live="polite">
            <span className="prompt">$ simulate --model {lab.file}</span>
            {terminal.map((l,i)=><span key={i}>{l}</span>)}
          </div>
        </div>
      </div>
    </div>
    <div className="editor-status">
      <span>PYTHON 3 · COPY OR DOWNLOAD TO RUN LOCALLY</span>
      <div>
        <button className="editor-tool" onClick={copy} aria-label="Copy Python code">{copied?<Check size={13}/>:<Copy size={13}/>} {copied?"Copied":"Copy"}</button>
        <button className="editor-tool" onClick={download} aria-label="Download Python file"><Download size={13}/> Download .py</button>
      </div>
    </div>
  </section>;
}
