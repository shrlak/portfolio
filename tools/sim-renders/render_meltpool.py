import numpy as np, os, sys
sys.path.insert(0,'/tmp/w/sim')
from style import *; import eagar as E
from matplotlib.colors import LinearSegmentedColormap
fd='/tmp/w/fr_melt'; os.makedirs(fd,exist_ok=True)
P=400; k=26.37; r=50e-6
x=np.linspace(-1.6e-3,0.3e-3,190); y=np.linspace(-0.35e-3,0.35e-3,71); z=np.linspace(0,0.3e-3,46)
vs=np.concatenate([np.linspace(0.2,1.0,70),np.full(15,1.0),np.linspace(1.0,0.2,70),np.full(15,0.2)])
# precompute unique v fields
cache={}
def fields(v):
    key=round(v,4)
    if key not in cache:
        X,Y=np.meshgrid(x,y); Ttop=E.T_field(X,Y,0*X,P,v,k,r,n=500)
        X2,Z2=np.meshgrid(x,z); Tside=E.T_field(X2,0*X2,Z2+1e-9,P,v,k,r,n=500)
        cache[key]=(Ttop,Tside)
    return cache[key]
hist=[]
for fi,v in enumerate(vs):
    Ttop,Tside=fields(v)
    fig=plt.figure(figsize=(W,H),dpi=DPI)
    fig.text(0.04,0.93,'LPBF melt pool — Eagar–Tsai conduction model, 316L SS',fontsize=19,weight='bold')
    fig.text(0.04,0.885,f'P = {P} W   ·   k = {k} W/m·K (fit to data)   ·   r = 50 µm',color=MUTED,fontsize=13)
    ax1=fig.add_axes([0.075,0.47,0.6,0.36]); ax2=fig.add_axes([0.075,0.09,0.6,0.30])
    ext1=[x[0]*1e3,x[-1]*1e3,y[0]*1e3,y[-1]*1e3]; ext2=[x[0]*1e3,x[-1]*1e3,-z[-1]*1e3,0]
    kw=dict(cmap='inferno',vmin=300,vmax=3500,aspect='auto',interpolation='bicubic')
    im=ax1.imshow(np.clip(Ttop,300,3500),extent=ext1,origin='lower',**kw)
    ax1.contour(x*1e3,y*1e3,Ttop,[E.Tm],colors='w',linewidths=1.6)
    ax2.imshow(np.clip(Tside,300,3500)[::-1],extent=ext2,origin='lower',**kw)
    ax2.contour(x*1e3,-z*1e3,Tside,[E.Tm],colors='w',linewidths=1.6)
    ax1.set_title('Top surface (z = 0)',loc='left',fontsize=13); ax2.set_title('Centerline section (y = 0)',loc='left',fontsize=13)
    ax1.set_ylabel('y (mm)'); ax2.set_ylabel('z (mm)'); ax2.set_xlabel('x relative to laser spot (mm)      laser travels toward +x →')
    ax1.set_xticklabels([])
    cax=fig.add_axes([0.685,0.08,0.012,0.75]); cb=fig.colorbar(im,cax=cax); cb.set_label('T (K), clipped at 3500'); cb.outline.set_edgecolor(GRID)
    # metrics
    xm=x[(Ttop>=E.Tm).any(axis=0)]; L=(xm.max()-xm.min())*1e6 if len(xm) else 0
    zm=z[(Tside>=E.Tm).any(axis=1)]; D=zm.max()*1e6 if len(zm) else 0
    ym=y[(Ttop>=E.Tm).any(axis=1)]; Wd=(ym.max()-ym.min())*1e6 if len(ym) else 0
    Tc=Ttop[35]; ib=np.where(Tc>=E.Tm)[0][0]
    G=v*(Tc[ib]-Tc[ib-1])/(x[ib]-x[ib-1])
    ax3=fig.add_axes([0.77,0.08,0.2,0.75]); ax3.axis('off')
    ax3.text(0,1.0,'scan speed',color=MUTED,fontsize=13); ax3.text(0,0.91,f'{v:.2f} m/s',fontsize=30,weight='bold',color=WARN)
    for j,(lab,val) in enumerate([('melt pool depth',f'{D:.0f} µm'),('melt pool width',f'{Wd:.0f} µm'),('melt pool length',f'{L:.0f} µm'),('cooling rate G = v·dT/dx',f'{G/1e6:.2f}×10⁶ K/s')]):
        ax3.text(0,0.74-j*0.17,lab,color=MUTED,fontsize=12); ax3.text(0,0.66-j*0.17,val,fontsize=21,weight='bold')
    fig.savefig(f'{fd}/f{fi:04d}.png'); plt.close(fig)
    if fi==60: fig_poster=f'{fd}/f{fi:04d}.png'
encode(fd,'meltpool'); poster(f'{fd}/f0060.png','meltpool'); print('done')
