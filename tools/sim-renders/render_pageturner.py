import numpy as np, os, sys
sys.path.insert(0,'/tmp/w/sim'); from style import encode, poster
from PIL import Image, ImageDraw, ImageFont
I='/tmp/w/img/'
slides=[('i-011.png','Concept 2 · crank-and-gear sweep (SolidWorks)'),
        ('i-013.png','Developed concept · servo-driven articulated arm'),
        ('i-000.png','Final assembly · wheel pre-bend + servo sweep arm'),
        ('i-003.png','Pivot-arm subassembly · rubber wheel on 12 V DC motor'),
        ('i-021.png','ANSYS · servo arm, von Mises (PLA, 0.1 N page load)'),
        ('i-022.png','ANSYS · subassembly under 5 N user load'),
        ('i-020.png','ANSYS · pivot arm — FOS 5.33 vs. 60 MPa yield')]
BGc=(14,17,23); Wd,Hd=1280,720
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
def frame(img,z,cap,alpha=1):
    c=Image.new('RGB',(Wd,Hd),BGc)
    maxw,maxh=1160,520; s=min(maxw/img.width,maxh/img.height)*z
    im=img.resize((int(img.width*s),int(img.height*s)),Image.LANCZOS)
    box=Image.new('RGB',(maxw,maxh),BGc); box.paste(im,((maxw-im.width)//2,(maxh-im.height)//2))
    c.paste(box,(60,120)); d=ImageDraw.Draw(c)
    d.text((60,36),'Assistive page-turner — CAD → hand calc → FEA',font=fb,fill=(230,237,243))
    d.text((60,660),cap,font=fs,fill=(139,148,158))
    return c
fd='/tmp/w/fr_pt'; os.makedirs(fd,exist_ok=True)
imgs=[Image.open(I+f).convert('RGB') for f,_ in slides]
per=60; fade=12; n=0
for k,(img,(f,cap)) in enumerate(zip(imgs,slides)):
    for j in range(per):
        z=1+0.06*j/per
        fr=frame(img,z,cap)
        if j>=per-fade and k<len(slides)-1:
            a=(j-(per-fade))/fade; nx=frame(imgs[k+1],1.0,slides[k+1][1]); fr=Image.blend(fr,nx,a)
        fr.save(f'{fd}/f{n:04d}.png'); n+=1
encode(fd,'pageturner'); poster(f'{fd}/f0150.png','pageturner'); print('done',n)
