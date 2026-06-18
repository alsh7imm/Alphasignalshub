# -*- coding: utf-8 -*-
import sys, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0,"/tmp")
import screens as S

W,H,FPS=1080,1920,30
BGS=S.BGS; TXT=S.TXT; MUT=S.MUT; CARD=S.CARD; CARD2=S.CARD2; BORDER=S.BORDER
PUR=S.PUR; BLU=S.BLU; RED=S.RED; GLD=S.GLD; GRN=S.GRN
SW,SH=S.SW,S.SH
def fnt(s,w="Bold"): return ImageFont.truetype("/tmp/fonts/Tajawal-%s.ttf"%w,s)
def mix(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def col(c,a): return tuple(int(x*max(0,min(1,a))) for x in c)
def ease(t): t=max(0,min(1,t)); return 1-(1-t)*(1-t)
def eio(t): t=max(0,min(1,t)); return 3*t*t-2*t*t*t
def T(d,xy,t,f,fill,anchor="mm"): d.text(xy,t,font=f,fill=fill,anchor=anchor)
def rr(d,b,r,fill=None,outline=None,width=2): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def fmt(v): return f"{int(round(v)):,}"

PX,PY=218,470; PAD=22; SX,SY=PX+PAD,PY+PAD
mask=Image.new("L",(SW,SH),0); ImageDraw.Draw(mask).rounded_rectangle([0,0,SW,SH],radius=46,fill=255)

def make_bg():
    base=np.zeros((H,W,3),np.float32); base[:]=BGS
    yy,xx=np.mgrid[0:H,0:W]
    def g(cx,cy,r,c,it): base[:,:]+=np.dstack([np.exp(-(((xx-cx)**2+(yy-cy)**2)/(r*r)))*it*c[i] for i in range(3)])
    g(W*0.82,H*0.05,820,PUR,0.20); g(W*0.12,H*0.32,760,BLU,0.14); g(W*0.5,H*1.0,950,PUR,0.09)
    return Image.fromarray(np.clip(base,0,255).astype(np.uint8))
BGIMG=make_bg()

def logo(d,cx,cy,s,a=1.0):
    h=s/2; rr(d,[cx-h,cy-h,cx+h,cy+h],s*0.30,fill=col(PUR,a))
    cw=s*0.55; ch=s*0.40; rr(d,[cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2],s*0.09,fill=col((255,255,255),a))
    d.rectangle([cx-cw/2,cy-ch/2+ch*0.28,cx+cw/2,cy-ch/2+ch*0.28+s*0.07],fill=col((226,222,247),a))
    dr=s*0.10; d.ellipse([cx+cw/2-dr*2.4,cy+ch*0.05,cx+cw/2-dr*0.4,cy+ch*0.05+dr*2],fill=col(GLD,a))

# ---- real vector icons ----
def ic_wedding(d,cx,cy,r):
    d.ellipse([cx-r,cy-r*0.55,cx+r*0.1,cy+r*0.55],outline=GLD,width=6)
    d.ellipse([cx-r*0.1,cy-r*0.55,cx+r,cy+r*0.55],outline=PUR,width=6)
def ic_hajj(d,cx,cy,r):
    rr(d,[cx-r*0.8,cy-r*0.75,cx+r*0.8,cy+r*0.85],8,fill=(34,34,42),outline=(110,110,125),width=3)
    d.rectangle([cx-r*0.8,cy-r*0.15,cx+r*0.8,cy+r*0.02],fill=GLD)
    d.rectangle([cx-r*0.18,cy-r*0.75,cx+r*0.0,cy+r*0.85],fill=(60,60,72))
def ic_plane(d,cx,cy,r):
    d.polygon([(cx-r,cy+r*0.1),(cx+r*0.7,cy-r*0.7),(cx+r*0.95,cy-r*0.45),(cx+r*0.1,cy+r*0.25),(cx+r*0.3,cy+r*0.8),(cx+r*0.05,cy+r*0.9),(cx-r*0.35,cy+r*0.35),(cx-r,cy+r*0.55)],fill=BLU)

def newscr():
    img=Image.new("RGBA",(SW,SH),BGS+(255,)); d=ImageDraw.Draw(img)
    T(d,(SW-30,40),"9:41",fnt(28),TXT,"rm"); d.ellipse([34,30,52,48],outline=MUT,width=3); rr(d,[60,32,92,48],6,fill=MUT)
    return img,d

def evt_card(d,y,iconfn,name,due,prog,spent,bud,rem,rc):
    rr(d,[34,y,SW-34,y+168],18,fill=CARD,outline=BORDER,width=1)
    rr(d,[SW-98,y+24,SW-34,y+88],16,fill=mix(BGS,PUR,0.16)); iconfn(d,SW-66,y+56,22)
    T(d,(SW-120,y+46),name,fnt(34,"Bold"),TXT,"rm")
    T(d,(54,y+46),due,fnt(22),MUT,"lm")
    rr(d,[54,y+100,SW-54,y+120],10,fill=CARD2)
    if prog>0: rr(d,[SW-54-(SW-108)*prog,y+100,SW-54,y+120],10,fill=PUR)
    T(d,(SW-54,y+148),f"{spent} / {bud} د.إ",fnt(23),MUT,"rm"); T(d,(54,y+148),rem,fnt(23,"Bold"),rc,"lm")

def keypad(d,oy,litkey=None,kh=70):
    keys=["1","2","3","4","5","6","7","8","9","،","0","C"]
    kw=(SW-68)/3
    for i,k in enumerate(keys):
        r=i//3; c=i%3; kx=34+kw*c; ky=oy+r*(kh+10)
        lit = (litkey==i)
        rr(d,[kx+4,ky,kx+kw-4,ky+kh],14,fill=PUR if lit else CARD2)
        T(d,((kx+kx+kw)/2,ky+kh/2),k,fnt(34,"Bold"),(255,255,255) if lit else TXT,"mm")

def detail_screen(budget,paid,items_vis):
    # items_vis: list of (name,amt,appear_a)
    img,d=newscr()
    T(d,(SW-34,108),"زواج",fnt(46,"ExtraBold"),TXT,"rm"); T(d,(50,108),"بعد 45 يوم",fnt(24),MUT,"lm")
    rr(d,[34,160,SW-34,352],18,fill=CARD)
    rem=budget-paid
    cols=[("الميزانية",fmt(budget),TXT),("المدفوع",fmt(paid),GRN),("المتبقّي",fmt(rem),RED)]; cw=(SW-68)/3
    for k,(lb,vl,c) in enumerate(cols):
        cx=34+cw*(k+0.5); T(d,(cx,205),lb,fnt(24),MUT,"mm"); T(d,(cx,255),vl,fnt(40,"ExtraBold"),c,"mm")
    prog=paid/budget if budget else 0
    rr(d,[64,300,SW-64,324],12,fill=CARD2)
    if prog>0: rr(d,[SW-64-(SW-128)*prog,300,SW-64,324],12,fill=PUR)
    T(d,(SW/2,340),f"{int(prog*100)}% مكتمل",fnt(24),MUT,"mm")
    y=384
    rr(d,[34,y,SW-34,y+560],18,fill=CARD,outline=BORDER,width=1)
    yy=y+24
    for (nm,amt,a) in items_vis:
        off=int(60*(1-a))
        if yy>y+490: break
        T(d,(SW-54+off,yy+30),nm,fnt(30,"Bold"),col(TXT,a),"rm")
        T(d,(150,yy+30),f"{fmt(amt)} د.إ",fnt(28),col(TXT,a),"lm")
        rr(d,[54,yy+10,150,yy+50],19,fill=col(mix(BGS,GRN,0.2),a)); T(d,(102,yy+30),"مدفوع",fnt(22),col(GRN,a),"mm")
        d.line([(54,yy+72),(SW-54,yy+72)],fill=BORDER,width=1); yy+=86
    return img

def list_screen():
    img,d=newscr()
    T(d,(SW-34,108),"المناسبات",fnt(46,"ExtraBold"),TXT,"rm"); T(d,(56,108),"+",fnt(54,"Bold"),PUR,"lm")
    evt_card(d,170,ic_hajj,"حج","بعد 90 يوم",0.20,"4,000","20,000","متبقّي 16,000",GLD)
    evt_card(d,360,ic_plane,"سفر الصيف","بعد 20 يوم",0.90,"9,000","10,000","قارب الاكتمال",GRN)
    return img

def picker_sheet(img,sheet_a,sel_a):
    d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,0,SW,SH],fill=(0,0,0,int(140*sheet_a)))
    sy=SH-int(560*sheet_a)
    rr(d,[0,sy,SW,SH],40,fill=CARD)
    rr(d,[SW/2-40,sy+18,SW/2+40,sy+26],4,fill=BORDER)
    T(d,(SW-40,sy+70),"اختر نوع المناسبة",fnt(36,"ExtraBold"),TXT,"rm")
    opts=[("زواج",ic_wedding),("حج / عمرة",ic_hajj),("سفر",ic_plane)]
    for i,(nm,icf) in enumerate(opts):
        oy=sy+120+i*120
        hl = (i==0)
        rr(d,[40,oy,SW-40,oy+100],18,fill=mix(CARD2,PUR,sel_a*0.5) if hl else CARD2,outline=PUR if hl and sel_a>0.5 else None,width=3)
        T(d,(SW-70,oy+50),nm,fnt(34,"Bold"),TXT,"rm")
        rr(d,[60,oy+24,128,oy+76],14,fill=mix(BGS,PUR,0.18)); icf(d,94,oy+50,22)

def budget_screen(val,litkey):
    img,d=newscr()
    T(d,(SW-34,108),"مناسبة جديدة · زواج",fnt(36,"ExtraBold"),TXT,"rm")
    T(d,(SW-34,180),"ميزانية المناسبة",fnt(28),MUT,"rm")
    rr(d,[34,210,SW-34,320],16,fill=CARD2,outline=PUR,width=2)
    T(d,(SW/2,265),f"{fmt(val)} د.إ",fnt(54,"Black"),TXT,"mm")
    keypad(d,360,litkey)
    rr(d,[34,790,SW-34,866],16,fill=PUR); T(d,(SW/2,828),"إنشاء المناسبة",fnt(32,"Bold"),(255,255,255),"mm")
    return img

def additem_sheet(img,sheet_a,val,litkey,save_press):
    d=ImageDraw.Draw(img,"RGBA")
    d.rectangle([0,0,SW,SH],fill=(0,0,0,int(140*sheet_a)))
    sy=SH-int(770*sheet_a); rr(d,[0,sy,SW,SH],40,fill=CARD)
    rr(d,[SW/2-40,sy+18,SW/2+40,sy+26],4,fill=BORDER)
    T(d,(SW-40,sy+70),"إضافة بند",fnt(36,"ExtraBold"),TXT,"rm")
    chips=[("المهر",1),("الذهب",0),("الفرقة",0),("الطعام",0)]; cx=SW-40; cy=sy+110
    for t,on in chips:
        w=fnt(26).getlength(t)+44
        rr(d,[cx-w,cy,cx,cy+54],27,fill=PUR if on else CARD2,outline=None if on else BORDER,width=1)
        T(d,(cx-w/2,cy+27),t,fnt(26),(255,255,255) if on else TXT,"mm"); cx-=w+12
    rr(d,[40,sy+190,SW-40,sy+290],16,fill=CARD2,outline=PUR,width=2)
    T(d,(SW/2,sy+240),f"{fmt(val)} د.إ",fnt(48,"Black"),TXT,"mm")
    keypad(d,sy+300,litkey,kh=62)
    bw=SW-80; by=sy+658; sc=1-0.05*save_press
    rr(d,[40,by,SW-40,by+72],16,fill=mix(PUR,(90,68,200),save_press)); T(d,(SW/2,by+36),"حفظ البند",fnt(32,"Bold"),(255,255,255),"mm")

def pointer(d,x,y,tapr,press=0):
    d.ellipse([x-28,y-28,x+28,y+28],fill=(255,255,255,45))
    rsz=15-press*3
    d.ellipse([x-rsz,y-rsz,x+rsz,y+rsz],fill=(255,255,255,200))
    if tapr>0:
        R=int(18+tapr*46); a=int(150*(1-tapr)); d.ellipse([x-R,y-R,x+R,y+R],outline=(124,92,255,a),width=5)

def phone(img,scr):
    d=ImageDraw.Draw(img)
    rr(d,[PX-2,PY-2,PX+SW+PAD*2+2,PY+SH+PAD*2+2],72,fill=(8,8,12),outline=(40,42,52),width=2)
    img.paste(scr,(SX,SY),mask)
    rr(d,[SX+SW/2-58,SY+14,SX+SW/2+58,SY+38],14,fill=(0,0,0))

def caption(img,txt,a):
    d=ImageDraw.Draw(img,"RGBA"); off=int(40*(1-a))
    cw=fnt(40,"Bold").getlength(txt)+70
    rr(d,[W/2-cw/2,300-off,W/2+cw/2,378-off],39,fill=col(mix(BGS,PUR,0.25),a)+(int(255*a),),outline=col(PUR,a),width=2)
    T(d,(W/2,339-off),txt,fnt(40,"Bold"),col(TXT,a))

def eqbars(img,t,alpha):
    d=ImageDraw.Draw(img,"RGBA"); n=26; gap=6; bw=(W-40-gap*(n-1))/n; x=20; baseY=1885
    for i in range(n):
        hh=36+abs(math.sin(t*3+i*0.5))*80*(0.5+0.5*math.sin(i*0.7))
        c=mix(mix(PUR,RED,i/n),BLU,0.3); d.rounded_rectangle([x,baseY-hh,x+bw,baseY],bw/2,fill=col(c,1)+(int(110*alpha),)); x+=bw+gap

# ---------- COMBINED (tour + interactive demo), slower ----------
def wrap(txt,f,maxw):
    words=txt.split(" "); lines=[]; cur=""
    for w in words:
        test=(cur+" "+w).strip()
        if f.getlength(test)>maxw and cur: lines.append(cur); cur=w
        else: cur=test
    if cur: lines.append(cur)
    return lines

def caption_tour(img,name,head,a):
    d=ImageDraw.Draw(img,"RGBA"); off=int(45*(1-a))
    cw=fnt(32,"Bold").getlength(name)+60
    rr(d,[W/2-cw/2,250-off,W/2+cw/2,318-off],34,fill=col(mix(BGS,PUR,0.3),a)+(int(255*a),),outline=col(PUR,a),width=2)
    T(d,(W/2,284-off),name,fnt(32,"Bold"),col((255,255,255),a))
    for i,ln in enumerate(wrap(head,fnt(42,"Bold"),940)):
        T(d,(W/2,365-off+i*54),ln,fnt(42,"Bold"),col(TXT,a))

P=[("list",0.0,3.0),("picker",3.0,3.0),("budget",6.0,4.0),("detailadd",10.0,3.0),
   ("item",13.0,4.0),("rows",17.0,4.0),("finish",21.0,3.0)]
DEMODUR=sum(p[2] for p in P)
TAPS=[2.0,5.0,7.0,7.6,8.2,8.8,9.5,12.0,14.0,14.6,15.2,16.2]
POPS=[17.2,18.4,19.6]
WP=[(0.5,60,108),(2.0,60,108),
    (3.0,SW-110,(SH-560)+170),(5.0,SW-110,(SH-560)+170),
    (6.2,SW/2-120,470),(7.0,SW/2-120,470),(7.6,SW/2,540),(8.2,SW/2+120,610),(8.8,SW/2,540),(9.5,SW/2,828),
    (10.4,SW/2,1018),(12.0,SW/2,1018),
    (13.2,SW/2-120,(SH-770)+380),(14.0,SW/2-120,(SH-770)+380),(14.6,SW/2,(SH-770)+440),(15.2,SW/2+120,(SH-770)+500),(16.2,SW/2,(SH-770)+694),
    (17.2,SW/2,650),(24.0,SW/2,650)]
def ptr_pos(dl):
    for i in range(len(WP)-1):
        t0,x0,y0=WP[i]; t1,x1,y1=WP[i+1]
        if t0<=dl<=t1:
            f=eio((dl-t0)/max(0.001,t1-t0)); return x0+(x1-x0)*f, y0+(y1-y0)*f
    return WP[-1][1],WP[-1][2]
def tap_ripple(dl):
    for tt in TAPS:
        if 0<=dl-tt<0.4: return (dl-tt)/0.4,(1 if dl-tt<0.16 else 0)
    return 0,0
def litkey_for(dl,phase):
    seq=[(7.0,0),(7.6,4),(8.2,8),(8.8,7)] if phase=="budget" else [(14.0,0),(14.6,4),(15.2,8)] if phase=="item" else []
    for tt,k in seq:
        if 0<=dl-tt<0.28: return k
    return None
def demo_frame(dl):
    phase=P[-1][0]; ps=P[-1][1]; pdur=P[-1][2]
    for nm,st,du in P:
        if st<=dl<st+du: phase,ps,pdur=nm,st,du; break
    lp=dl-ps
    if phase=="list": scr=list_screen()
    elif phase=="picker":
        scr=list_screen(); sa=eio(min(1,lp/0.5)); sel=ease(max(0,(lp-1.6)/0.4)); picker_sheet(scr,sa,sel)
    elif phase=="budget":
        val=75000*ease(min(1,(lp-0.8)/1.8)); scr=budget_screen(val,litkey_for(dl,"budget"))
    elif phase=="detailadd":
        scr=detail_screen(75000,0,[]); d=ImageDraw.Draw(scr)
        bp=1 if (12.0<=dl<12.2) else 0
        rr(d,[34,980,SW-34,1056],16,fill=mix(PUR,(90,68,200),bp)); T(d,(SW/2,1018),"إضافة بند +",fnt(32,"Bold"),(255,255,255),"mm")
    elif phase=="item":
        scr=detail_screen(75000,0,[]); sa=eio(min(1,lp/0.5))
        if lp>3.2: sa=eio(max(0,1-(lp-3.2)/0.4))
        val=20000*ease(min(1,(lp-0.8)/1.6)); sp=1 if (16.2<=dl<16.4) else 0
        additem_sheet(scr,sa,val,litkey_for(dl,"item"),sp)
    elif phase=="rows":
        items=[]
        for nm,amt,at in [("المهر",20000,17.1),("الفرقة",4000,18.4),("الطعام والعشاء",17000,19.6)]:
            if dl>=at: items.append((nm,amt,ease(min(1,(dl-at)/0.4))))
        scr=detail_screen(75000,sum(a for _,a,_ in items),items)
    else:
        items=[("المهر",20000,1),("الفرقة",4000,1),("الطعام والعشاء",17000,1)]
        scr=detail_screen(75000,41000,items); d=ImageDraw.Draw(scr,"RGBA"); ca=eio(min(1,lp/0.6))
        if ca>0: S.check(d,SW/2,1010,int(64*ca))
        if ca>0.5: T(d,(SW/2,1110),"تم بسهولة",fnt(40,"ExtraBold"),GRN,"mm")
    return scr,phase,lp,pdur
CAPS={"list":"اضغط + لإضافة مناسبة","picker":"اختر نوع المناسبة: زواج","budget":"حدّد ميزانية المناسبة",
      "detailadd":"ابدأ بإضافة البنود","item":"أضف المهر — 20,000","rows":"الفرقة · الطعام · والباقي","finish":"وهكذا تطلع — بسهولة"}

def sc_intro(t,dur):
    img=BGIMG.copy(); eqbars(img,t,0.6); d=ImageDraw.Draw(img,"RGBA")
    p=eio(t/0.7); logo(d,W/2,740,int(360*(0.6+0.4*p)),p)
    T(d,(W/2,1010),"مَصروف.",fnt(150,"Black"),col(TXT,ease((t-0.3)/0.6)))
    T(d,(W/2,1140),"جولة كاملة داخل التطبيق",fnt(54,"Bold"),col(GLD,ease((t-0.55)/0.6)))
    return img
def sc_offer(t,dur):
    img=BGIMG.copy(); eqbars(img,t,0.6); d=ImageDraw.Draw(img,"RGBA")
    T(d,(W/2,640),"جرّبه",fnt(64,"Bold"),col(MUT,ease(t/0.5)))
    p=eio(min(1,(t-0.2)/0.6)); T(d,(W/2,800),"أسبوع مجاني",fnt(int(150*(0.7+0.3*p))),col(mix(PUR,BLU,0.4),p))
    p2=ease((t-0.5)/0.6); rr(d,[W/2-400,970,W/2+400,1105],32,fill=col(mix(BGS,PUR,0.22),p2)+(int(255*p2),),outline=col(PUR,p2),width=3)
    T(d,(W/2,1038),"ثم 45 د.إ مدى الحياة",fnt(62,"ExtraBold"),col(TXT,p2))
    T(d,(W/2,1210),"دفعة واحدة · بدون إعلانات · خصوصية كاملة",fnt(38,"Bold"),col(MUT,ease((t-0.8)/0.6)))
    return img
def store(d,x,y,w,h,top,big):
    rr(d,[x,y,x+w,y+h],18,fill=(0,0,0),outline=(70,70,82),width=2)
    d.text((x+w-36,y+h*0.32),top,font=fnt(24,"Regular"),fill=(200,200,210),anchor="rm")
    d.text((x+w-36,y+h*0.68),big,font=fnt(40,"Bold"),fill=(255,255,255),anchor="rm")
    d.ellipse([x+32,y+h/2-22,x+32+44,y+h/2+22],outline=(255,255,255),width=4)
def sc_cta(t,dur):
    img=BGIMG.copy(); eqbars(img,t,0.5); d=ImageDraw.Draw(img,"RGBA")
    p=eio(t/0.6); logo(d,W/2,620,int(300*(0.7+0.3*p)),p)
    T(d,(W/2,880),"حمّل مَصروف الحين",fnt(92,"Black"),col(TXT,ease((t-0.3)/0.6)))
    bw,bh,gap=440,140,28; p3=ease((t-0.55)/0.6); p4=ease((t-0.72)/0.6)
    if p3>0: store(d,W/2-bw/2,1030,bw,bh,"Download on the","App Store")
    if p4>0: store(d,W/2-bw/2,1030+bh+gap,bw,bh,"GET IT ON","Google Play")
    if p4>0: T(d,(W/2,1030+2*bh+2*gap+30),"iOS و Android",fnt(38,"Bold"),col(MUT,p4))
    return img
def fade(img,a):
    if a>=0.999: return img.convert("RGB")
    return Image.blend(Image.new("RGB",(W,H),(0,0,0)),img.convert("RGB"),max(0,a))

SCR_TOUR={k:S.RENDER[k]().convert("RGBA") for k in ["home","add","subs","reports","settings"]}
K=1.4  # slow the interactive wedding demo a bit more
TIMELINE=[("intro",3.0,None),
 ("tour",3.6,("home","الرئيسية","كل مصاريفك في شاشة وحدة")),
 ("tour",3.8,("add","الإضافة","أضف عملية بثواني — أو تلقائياً من إشعارات بنكك")),
 ("tour",3.6,("subs","الاشتراكات","يكتشف اشتراكاتك ويذكّرك قبل التجديد")),
 ("demo",DEMODUR*K,None),
 ("tour",3.6,("reports","التقارير","تقارير ورؤى + تصدير PDF و Excel")),
 ("tour",3.8,("settings","الإعدادات والخصوصية","لغتك وعملتك وبصمتك — بياناتك على جهازك فقط")),
 ("offer",3.4,None),("cta",3.6,None)]
TOTAL=sum(x[1] for x in TIMELINE); print("TOTAL",round(TOTAL,2),"demo",DEMODUR)

ff="/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
proc=subprocess.Popen([ff,"-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),
 "-i","-","-an","-c:v","libx264","-pix_fmt","yuv420p","-crf","20","-preset","medium","/tmp/promo4b_silent.mp4"],stdin=subprocess.PIPE)
for kind,du,payload in TIMELINE:
    nf=int(du*FPS)
    for i in range(nf):
        lt=i/FPS
        if kind=="intro": img=sc_intro(lt,du)
        elif kind=="offer": img=sc_offer(lt,du)
        elif kind=="cta": img=sc_cta(lt,du)
        elif kind=="tour":
            key,nm,hd=payload; img=BGIMG.copy(); phone(img,SCR_TOUR[key])
            caption_tour(img,nm,hd,min(ease(lt/0.4),ease((du-lt)/0.3))); eqbars(img,lt,0.26)
        else:
            scr,phase,lp,pdur=demo_frame(lt/K); img=BGIMG.copy(); phone(img,scr)
            caption(img,CAPS[phase],max(0.18,min(ease(lp/0.3),ease((pdur-lp)/0.3))))
            px,py=ptr_pos(lt/K); tr,pr=tap_ripple(lt/K); dd=ImageDraw.Draw(img,"RGBA"); pointer(dd,SX+px,SY+py,tr,pr)
            eqbars(img,lt,0.26)
        proc.stdin.write(fade(img,min(min(1,lt/0.3),min(1,(du-lt)/0.3))).tobytes())
proc.stdin.close(); proc.wait(); print("video4 done")
