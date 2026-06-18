# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
SW,SH=600,1240
BGS=(15,17,23); CARD=(26,29,39); CARD2=(34,38,52); BRAND=(29,27,51)
TXT=(232,234,240); MUT=(154,160,176); BORDER=(44,49,64)
PUR=(124,92,255); BLU=(77,139,255); RED=(255,93,108); GLD=(255,180,84); GRN=(39,194,129)
F="/tmp/fonts/Tajawal-%s.ttf"
def fnt(sz,w="Bold"): return ImageFont.truetype(F%w,sz)
def mix(c1,c2,t): return tuple(int(c1[i]+(c2[i]-c1[i])*t) for i in range(3))
def T(d,xy,t,f,fill,anchor="rm"): d.text(xy,t,font=f,fill=fill,anchor=anchor)
def rr(d,b,r,fill=None,outline=None,width=2): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)

def logo(d,cx,cy,s):
    h=s/2; rr(d,[cx-h,cy-h,cx+h,cy+h],s*0.30,fill=PUR)
    cw=s*0.55; ch=s*0.40
    rr(d,[cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2],s*0.09,fill=(255,255,255))
    d.rectangle([cx-cw/2,cy-ch/2+ch*0.28,cx+cw/2,cy-ch/2+ch*0.28+s*0.07],fill=(226,222,247))
    dr=s*0.10; d.ellipse([cx+cw/2-dr*2.4,cy+ch*0.05,cx+cw/2-dr*0.4,cy+ch*0.05+dr*2],fill=GLD)

def check(d,cx,cy,r,c=GRN):
    d.ellipse([cx-r,cy-r,cx+r,cy+r],fill=mix(BGS,c,0.25),outline=c,width=3)
    d.line([(cx-r*0.4,cy),(cx-r*0.1,cy+r*0.35),(cx+r*0.45,cy-r*0.35)],fill=c,width=max(3,int(r*0.22)))

def base():
    img=Image.new("RGBA",(SW,SH),BGS+(255,)); d=ImageDraw.Draw(img)
    T(d,(SW-30,40),"9:41",fnt(28),TXT,"rm")
    d.ellipse([34,30,54,50],outline=MUT,width=3)  # dummy
    d.rectangle([60,32,90,48],fill=MUT); 
    return img,d

def head(d,title,extra=None):
    T(d,(SW-34,110),title,fnt(46,"ExtraBold"),TXT,"rm")
    d.line([(34,150),(40,144)],fill=MUT,width=4)  # chevron-ish
    d.polygon([(40,135),(40,165),(22,150)],fill=MUT)
    if extra: T(d,(50,110),extra,fnt(28),MUT,"lm")

def seg(d,x,y,w,opts,on=0,h=56):
    rr(d,[x,y,x+w,y+h],14,fill=CARD2)
    sw=w/len(opts)
    for i,o in enumerate(opts):
        sx=x+sw*i
        if i==on: rr(d,[sx+4,y+4,sx+sw-4,y+h-4],11,fill=PUR)
        T(d,(sx+sw/2,y+h/2),o,fnt(28),(255,255,255) if i==on else MUT,"mm")

def swt(d,x,y,on=True,w=64,h=36):
    rr(d,[x,y,x+w,y+h],h/2,fill=PUR if on else CARD2)
    r=h/2-4; cx=x+w-h/2 if on else x+h/2
    d.ellipse([cx-r,y+4,cx+r,y+h-4],fill=(255,255,255) if on else MUT)

def home():
    img,d=base()
    rr(d,[34,90,SW-34,200],20,fill=BRAND,outline=BORDER,width=1)
    T(d,(SW-50,145),"مَصروف.",fnt(40,"ExtraBold"),TXT,"rm"); logo(d,80,145,70)
    rr(d,[34,220,SW-34,330],18,fill=CARD); d.rectangle([SW-41,238,SW-34,312],fill=GRN)
    T(d,(SW-50,260),"دخل هذا الشهر",fnt(26),MUT,"rm"); T(d,(SW-50,300),"12,000 د.إ",fnt(46,"Black"),GRN,"rm")
    rr(d,[34,348,SW-34,468],18,fill=CARD); d.rectangle([SW-41,366,SW-34,450],fill=RED)
    T(d,(SW-50,388),"إجمالي المصروف هذا الشهر",fnt(26),MUT,"rm"); T(d,(SW-50,432),"994.23 د.إ",fnt(56,"Black"),RED,"rm")
    mw=(SW-68-16)/2
    for k,(lb,vl,c) in enumerate([("العمليات","10",BLU),("اشتراكات","2",GLD)]):
        mx=34+(mw+16)*k; rr(d,[mx,486,mx+mw,596],16,fill=CARD); d.rectangle([mx+mw-7,500,mx+mw,582],fill=c)
        T(d,(mx+mw-22,518),lb,fnt(24),MUT,"rm"); T(d,(mx+mw-22,562),vl,fnt(46,"Black"),c if k==1 else TXT,"rm")
    rr(d,[34,614,SW-34,884],18,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-50,650),"الاشتراكات المتكررة",fnt(32),TXT,"rm")
    for k,(nm,m,amt) in enumerate([("NETFLIX","ظهر مرتين","45.00 د.إ"),("SPOTIFY","ظهر مرتين","21.99 د.إ")]):
        ry=688+k*92; rr(d,[54,ry,SW-54,ry+78],14,fill=CARD2)
        T(d,(SW-72,ry+28),nm,fnt(28),TXT,"rm"); T(d,(SW-72,ry+56),m,fnt(22),MUT,"rm"); T(d,(74,ry+39),amt,fnt(28),RED,"lm")
    rr(d,[34,902,SW-34,1130],18,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-50,938),"حسب الفئة",fnt(32),TXT,"rm")
    segs=[(0.352,RED),(0.252,BLU),(0.153,GRN),(0.135,PUR),(0.108,GLD)]; bx=54; bw=SW-108
    x=SW-54
    for w,c in segs:
        rr(d,[x-bw*w,980,x,1004],8,fill=c); x-=bw*w
    labs=[("فواتير 350",RED),("تسوق 251",BLU),("مواصلات 152",GRN),("اشتراكات 134",PUR),("مطاعم 108",GLD)]
    lx=SW-54; ly=1040
    for i,(t,c) in enumerate(labs):
        if i==3: lx=SW-54; ly=1085
        d.ellipse([lx-16,ly-8,lx-2,ly+6],fill=c); T(d,(lx-26,ly),t,fnt(22),MUT,"rm"); lx-=190
    return img

def add():
    img,d=base(); head(d,"إضافة عملية")
    seg(d,34,180,SW-68,["مصروف","دخل"],0)
    rr(d,[34,260,SW-34,380],16,fill=CARD2); T(d,(SW/2,320),"120.00 د.إ",fnt(60,"Black"),TXT,"mm")
    T(d,(SW-34,430),"الفئة",fnt(26),MUT,"rm")
    chips=[("مطاعم",1),("تسوق",0),("فواتير",0),("مواصلات",0),("اشتراكات",0),("أخرى +",0)]
    cx=SW-34; cy=470
    for t,on in chips:
        w=fnt(26).getlength(t)+44
        if cx-w<34: cx=SW-34; cy+=70
        rr(d,[cx-w,cy,cx,cy+54],27,fill=PUR if on else CARD2,outline=None if on else BORDER,width=1)
        T(d,(cx-w/2,cy+27),t,fnt(26),(255,255,255) if on else TXT,"mm"); cx-=w+14
    yy=cy+90
    T(d,(SW-34,yy),"المتجر / الوصف",fnt(24),MUT,"rm"); rr(d,[34,yy+20,SW-34,yy+86],12,fill=CARD2,outline=BORDER,width=1)
    T(d,(SW-50,yy+53),"كارفور",fnt(26),MUT,"rm")
    by=yy+120; rr(d,[34,by,SW-34,by+76],14,fill=PUR); T(d,(SW/2,by+38),"حفظ العملية",fnt(32,"Bold"),(255,255,255),"mm")
    T(d,(SW/2,by+120),"— أو —",fnt(24),MUT,"mm")
    ry=by+150; rr(d,[34,ry,SW-34,ry+96],16,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-54,ry+38),"الإضافة التلقائية",fnt(28),TXT,"rm"); T(d,(SW-54,ry+70),"من إشعارات بنكك · مفعّل",fnt(22),MUT,"rm"); swt(d,54,ry+30,True)
    return img

def subs():
    img,d=base(); head(d,"الاشتراكات")
    mw=(SW-68-16)/2
    for k,(lb,vl) in enumerate([("شهرياً","66.99"),("سنوياً","803.88")]):
        mx=34+(mw+16)*k; rr(d,[mx,180,mx+mw,300],16,fill=CARD); d.rectangle([mx+mw-7,196,mx+mw,284],fill=GLD if k==0 else BLU)
        T(d,(mx+mw-22,212),lb,fnt(24),MUT,"rm"); T(d,(mx+mw-22,258),vl,fnt(42,"Black"),GLD if k==0 else BLU,"rm")
    rr(d,[34,320,SW-34,510],18,fill=CARD,outline=BORDER,width=1)
    for k,(nm,m,amt) in enumerate([("NETFLIX","يتجدد 20 يونيو","45.00 د.إ"),("SPOTIFY","يتجدد 1 يوليو","21.99 د.إ")]):
        ry=344+k*82; rr(d,[54,ry,SW-54,ry+70],14,fill=CARD2)
        T(d,(SW-72,ry+26),nm,fnt(28),TXT,"rm"); T(d,(SW-72,ry+52),m,fnt(20),MUT,"rm"); T(d,(74,ry+35),amt,fnt(28),RED,"lm")
    rr(d,[34,534,SW-34,640],14,fill=mix(BGS,GLD,0.12),outline=GLD,width=2)
    T(d,(SW-50,587),"⚠ ما استخدمت Spotify من 30 يوم",fnt(26),TXT,"rm") if False else T(d,(SW-50,575),"ما استخدمت Spotify من 30 يوم",fnt(26),TXT,"rm")
    T(d,(SW-50,610),"تبي تلغيه؟",fnt(24),GLD,"rm")
    rr(d,[34,660,SW-34,766],14,fill=mix(BGS,GRN,0.12),outline=GRN,width=2)
    T(d,(SW-50,700),"لو ألغيت اشتراك واحد",fnt(26),TXT,"rm"); T(d,(SW-50,734),"توفّر 540 د.إ سنوياً",fnt(28,"Bold"),GRN,"rm")
    rr(d,[34,800,SW-34,876],14,fill=CARD2,outline=BORDER,width=1); T(d,(SW/2,838),"+ إضافة اشتراك يدوي",fnt(28),TXT,"mm")
    return img

def evt_card(d,y,icon,name,due,prog,spent,bud,rem,rc):
    rr(d,[34,y,SW-34,y+170],18,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-54,y+44),name,fnt(34,"Bold"),TXT,"rm"); 
    rr(d,[SW-150,y+22,SW-90,y+82],14,fill=mix(BGS,PUR,0.2)); T(d,(SW-120,y+52),icon,fnt(30),PUR,"mm")
    T(d,(54,y+44),due,fnt(22),MUT,"lm")
    rr(d,[54,y+96,SW-54,y+118],11,fill=CARD2)
    if prog>0: rr(d,[SW-54-(SW-108)*prog,y+96,SW-54,y+118],11,fill=PUR)
    T(d,(SW-54,y+148),f"{spent} / {bud} د.إ",fnt(24),MUT,"rm"); T(d,(54,y+148),rem,fnt(24,"Bold"),rc,"lm")

def events():
    img,d=base(); 
    T(d,(SW-34,110),"المناسبات",fnt(46,"ExtraBold"),TXT,"rm"); T(d,(50,110),"+",fnt(50,"Bold"),PUR,"lm")
    evt_card(d,180,"حب","زواج","بعد 45 يوم",0.60,"45,000","75,000","متبقّي 30,000",GLD)
    evt_card(d,370,"حج","حج","بعد 90 يوم",0.20,"4,000","20,000","متبقّي 16,000",GLD)
    evt_card(d,560,"سفر","سفر الصيف","بعد 20 يوم",0.90,"9,000","10,000","قارب الاكتمال",GRN)
    T(d,(SW-34,790),"إضافة مناسبة",fnt(26),MUT,"rm")
    chips=["زواج","ملكة","مولود","حج/عمرة","سفر","عيد ميلاد","أخرى +"]; cx=SW-34; cy=830
    for t in chips:
        w=fnt(24).getlength(t)+40
        if cx-w<34: cx=SW-34; cy+=66
        rr(d,[cx-w,cy,cx,cy+52],26,fill=CARD2,outline=BORDER,width=1); T(d,(cx-w/2,cy+26),t,fnt(24),TXT,"mm"); cx-=w+12
    return img

def evdetail():
    img,d=base(); head(d,"زواج","بعد 45 يوم")
    rr(d,[34,180,SW-34,372],18,fill=CARD)
    cols=[("الميزانية","75,000",TXT),("المدفوع","45,000",GRN),("المتبقّي","30,000",RED)]; cw=(SW-68)/3
    for k,(lb,vl,c) in enumerate(cols):
        cx=34+cw*(k+0.5); T(d,(cx,225),lb,fnt(24),MUT,"mm"); T(d,(cx,275),vl,fnt(40,"ExtraBold"),c,"mm")
    rr(d,[64,320,SW-64,344],12,fill=CARD2); rr(d,[SW-64-(SW-128)*0.6,320,SW-64,344],12,fill=PUR)
    T(d,(SW/2,360),"60% مكتمل",fnt(24),MUT,"mm")
    items=[("المهر","20,000 د.إ",1),("الذهب / الشبكة","15,000 د.إ",1),("القاعة","12,000 د.إ",1),
           ("الفرقة / الزفّة","4,000 د.إ",0),("عشاء الرجال","8,000 د.إ",1),("عشاء الحريم","9,000 د.إ",0),
           ("الكوفي والتوزيعات","5,500 د.إ",0)]
    y=400; rr(d,[34,y,SW-34,y+len(items)*86+20],18,fill=CARD,outline=BORDER,width=1)
    for k,(nm,amt,done) in enumerate(items):
        ry=y+20+k*86; 
        if k: d.line([(54,ry),(SW-54,ry)],fill=BORDER,width=1)
        T(d,(SW-54,ry+44),nm,fnt(30,"Bold"),TXT,"rm"); T(d,(150,ry+44),amt,fnt(28),TXT,"lm")
        tag=GRN if done else GLD; txt="مدفوع" if done else "متبقّي"
        rr(d,[54,ry+24,150,ry+62],19,fill=mix(BGS,tag,0.2)); T(d,(102,ry+43),txt,fnt(22),tag,"mm")
    return img

def reports():
    img,d=base(); 
    T(d,(SW-34,110),"التقارير",fnt(46,"ExtraBold"),TXT,"rm")
    rr(d,[34,180,SW-34,470],18,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-54,222),"مقارنة شهرية",fnt(30),TXT,"rm")
    bx=SW/2
    for k,(lb,h,c) in enumerate([("مايو 842",110,CARD2),("يونيو 994",170,PUR)]):
        cx=bx+(120 if k==0 else -120)*1
        cx = SW/2 - 100 + k*200
        rr(d,[cx-50,420-h,cx+50,420],10,fill=c if isinstance(c,tuple) else PUR)
        T(d,(cx,448),lb,fnt(22),MUT,"mm")
    rr(d,[54,250,250,300],12,fill=mix(BGS,GRN,0.15),outline=GRN,width=1); T(d,(152,275),"+18%",fnt(28,"Bold"),GRN,"mm")
    rr(d,[34,490,SW-34,720],18,fill=CARD,outline=BORDER,width=1)
    T(d,(SW-54,532),"رؤى ذكية",fnt(30),TXT,"rm")
    rows=[("أكثر فئة","فواتير"),("أغلى يوم","الجمعة"),("متوسط يومي","33 د.إ")]
    for k,(a,b) in enumerate(rows):
        ry=580+k*44; T(d,(SW-54,ry),a,fnt(26),MUT,"rm"); T(d,(54,ry),b,fnt(26,"Bold"),TXT,"lm")
    mw=(SW-68-16)/2
    for k,(t,c) in enumerate([("تصدير PDF",PUR),("تصدير Excel",CARD2)]):
        mx=34+(mw+16)*k; rr(d,[mx,750,mx+mw,826],14,fill=c); T(d,(mx+mw/2,788),t,fnt(28,"Bold"),(255,255,255) if k==0 else TXT,"mm")
    return img

def settings():
    img,d=base(); T(d,(SW-34,110),"الإعدادات",fnt(46,"ExtraBold"),TXT,"rm")
    rr(d,[34,170,SW-34,560],18,fill=CARD,outline=BORDER,width=1)
    def row(y,label,kind,val=None,on=True):
        T(d,(SW-54,y),label,fnt(28),TXT,"rm")
        if kind=="seg": seg(d,54,y-28,210,val,0,h=52)
        elif kind=="sw": swt(d,54,y-18,on)
        else: T(d,(54,y),val,fnt(26),MUT,"lm")
        d.line([(54,y+38),(SW-54,y+38)],fill=BORDER,width=1)
    row(210,"اللغة","seg",["عربي","EN"]); row(285,"العملة","val","د.إ")
    row(360,"المظهر","seg",["داكن","فاتح"]); row(435,"قفل بالبصمة","sw",on=True)
    row(510,"الزكاة والتبرعات","sw",on=True)
    rr(d,[34,585,SW-34,720],18,fill=PUR)
    T(d,(SW-54,628),"مَصروف الكامل",fnt(30,"Bold"),(255,255,255),"rm")
    T(d,(SW-54,672),"أسبوع مجاني ثم 45 د.إ مدى الحياة",fnt(26),(235,230,255),"rm")
    rr(d,[34,742,SW-34,812],14,fill=CARD2,outline=BORDER,width=1)
    T(d,(SW/2,777),"بياناتك على جهازك فقط — لا تطلع أبداً",fnt(24),MUT,"mm")
    return img

RENDER={"home":home,"add":add,"subs":subs,"events":events,"evdetail":evdetail,"reports":reports,"settings":settings}
if __name__=="__main__":
    for k,fn in RENDER.items():
        fn().convert("RGB").save(f"/tmp/scr_{k}.png")
    print("screens ok")
