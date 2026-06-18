# -*- coding: utf-8 -*-
import numpy as np, wave
sr=44100; TOTAL=62.0; N=int(TOTAL*sr); mix=np.zeros(N); K=1.4; D=14.0
def env(a,d,n):
    e=np.ones(n); ai=int(a*sr); di=int(d*sr)
    if ai>0:e[:ai]=np.linspace(0,1,ai)
    if di>0:e[-di:]=np.linspace(1,0,di)
    return e
def add(sig,at):
    i=int(at*sr); j=min(N,i+len(sig))
    if 0<=i<N: mix[i:j]+=sig[:j-i]
def tone(fr,length,vol=0.2,dec=0.25):
    n=int(length*sr); tt=np.arange(n)/sr; return (np.sin(2*np.pi*fr*tt)+0.3*np.sin(2*np.pi*2*fr*tt))*np.exp(-tt/dec)*vol
NT={'C':261.63,'D':293.66,'E':329.63,'F':349.23,'G':392.0,'A':440.0,'B':493.88}
def f(x,o=0): return NT[x]*(2**o)
bpm=110; beat=60/bpm; clen=2*beat
prog=[('A',['A','C','E']),('F',['F','A','C']),('C',['C','E','G']),('G',['G','B','D'])]
tc=0; ci=0
while tc<TOTAL:
    root,tones=prog[ci%4]; n=int(clen*sr); tt=np.arange(n)/sr; pad=np.zeros(n)
    for to in tones:
        fr=f(to,-1); pad+=np.sin(2*np.pi*fr*tt)+np.sin(2*np.pi*fr*1.003*tt)
    add(pad*env(0.25,0.3,n)*0.030,tc)
    for b in range(2): add(tone(f(root,-2),beat*0.95,0.13,0.22),tc+b*beat)
    seq=[tones[0],tones[1],tones[2],tones[1]]
    for k in range(4): add(tone(f(seq[k],0),beat/2*0.9,0.08,0.18),tc+k*beat/2)
    tc+=clen; ci+=1
tb=0
while tb<TOTAL:
    n=int(0.13*sr); tt=np.arange(n)/sr; fk=110*np.exp(-tt/0.03)+45
    add(np.sin(2*np.pi*np.cumsum(fk)/sr)*np.exp(-tt/0.10)*0.40,tb)
    nh=int(0.04*sr); hat=np.random.rand(nh)*2-1
    add(np.diff(np.concatenate([[0],hat]))*np.exp(-np.arange(nh)/sr/0.02)*0.08,tb+beat/2)
    tb+=beat
def click(at,fr=1150,vol=0.2):
    n=int(0.06*sr); tt=np.arange(n)/sr; add((np.sin(2*np.pi*fr*tt)+0.4*(np.random.rand(n)*2-1))*np.exp(-tt/0.018)*vol,at)
def pop(at,fr=620,vol=0.17):
    n=int(0.10*sr); tt=np.arange(n)/sr; add(np.sin(2*np.pi*fr*tt)*np.exp(-tt/0.032)*vol,at)
def whoosh(at,dur=0.5,vol=0.22):
    n=int(dur*sr); tt=np.arange(n)/sr; noise=np.random.rand(n)*2-1
    add(np.convolve(noise*(np.sin(np.pi*tt/dur)**2)*vol,np.ones(40)/40,mode='same')*1.5,at)
def chime(at,vol=0.18):
    for fr,d in [(880,0.6),(1320,0.5),(1760,0.4)]:
        n=int(d*sr); tt=np.arange(n)/sr; add(np.sin(2*np.pi*fr*tt)*np.exp(-tt/0.25)*vol,at)
for tl in [2.0,5.0,7.0,7.6,8.2,8.8,9.5,12.0,14.0,14.6,15.2,16.2]: click(D+K*tl, fr=1050+(tl*23)%450)
for tl in [17.1,18.4,19.6]: pop(D+K*tl)
for tl in [3.0,13.0,16.4]: whoosh(D+K*tl,0.4,0.16)
for b in [3.0,6.6,10.4,14.0,47.6,51.2,55.0,58.4]: whoosh(b-0.1)
chime(0.2); chime(D+K*21.3); chime(55.0); chime(58.5)
mix=mix/(np.max(np.abs(mix))+1e-6)*0.9; mix=np.tanh(mix*1.2)
pcm=(np.stack([mix,mix],1)*32767).astype(np.int16)
with wave.open("/tmp/promo4b_audio.wav","wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
print("audio4b ok",TOTAL)
