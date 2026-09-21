import numpy as np, os, sys
sys.path.insert(0,'/tmp/w/sim'); from style import *
from matplotlib.patches import Circle
d=np.load('/tmp/w/sim/seg_lqr.npz'); t,y,tau=d['t'],d['y'],d['tau']
fd='/tmp/w/fr_seg'; os.makedirs(fd,exist_ok=True)
r,L=0.2,1.08
T=np.arange(0,15,1/30*1.5); nf=len(T)
phi=np.interp(T,t,y[0]); th=np.interp(T,t,y[1]); tq=np.interp(T,t,tau)
for i in range(nf):
    fig=plt.figure(figsize=(W,H),dpi=DPI)
    fig.text(0.04,0.93,'Segway balance — nonlinear sim with LQR state feedback',fontsize=19,weight='bold')
    fig.text(0.04,0.885,'Q = diag(1, 2, 0.01, 0.001), R = 1   ·   start: 15° lean, wheel at θ = 3π   ·   playback 1.5×',color=MUTED,fontsize=13)
    ax=fig.add_axes([0.04,0.08,0.5,0.76]); ax.set_aspect('equal'); ax.set_xlim(-0.6,2.6); ax.set_ylim(-0.1,1.55)
    ax.axhline(0,color=GRID,lw=2); 
    for gx in np.arange(-1,4,0.25): ax.plot([gx,gx-0.06],[0,-0.06],color=GRID,lw=1)
    xw=r*th[i]; ax.add_patch(Circle((xw,r),r,fc='#21262d',ec=C1,lw=3))
    a=-th[i]; ax.plot([xw,xw+r*np.cos(a)],[r,r+r*np.sin(a)],color=C1,lw=2)
    tipx=xw+L*np.cos(phi[i]); tipy=r+L*np.sin(phi[i])
    ax.plot([xw,tipx],[r,tipy],color=C2,lw=9,solid_capstyle='round'); ax.plot(tipx,tipy,'o',ms=16,color=C2)
    ax.plot(0,0,'^',ms=12,color=C3); ax.text(0,-0.09,'target θ = 0',ha='center',va='top',color=C3,fontsize=11)
    ax.set_xticks([]); ax.set_yticks([]); [s.set_visible(False) for s in ax.spines.values()]; ax.set_facecolor(BG)
    ax.text(-0.55,1.45,f't = {T[i]:5.2f} s',fontsize=15,family='DejaVu Sans Mono')
    ax.text(-0.55,1.33,f'lean = {90-np.degrees(phi[i]):+6.2f}°',fontsize=15,family='DejaVu Sans Mono',color=C2)
    ax.text(-0.55,1.21,f'τ = {tq[i]:+7.1f} N·m',fontsize=15,family='DejaVu Sans Mono',color=C4)
    a1=fig.add_axes([0.62,0.52,0.35,0.32]); a2=fig.add_axes([0.62,0.1,0.35,0.32])
    a1.plot(T,90-np.degrees(phi),color=GRID,lw=1.5); a1.plot(T[:i+1],90-np.degrees(phi[:i+1]),color=C2,lw=2.5)
    a1.set_ylabel('lean (deg)'); a1.grid(True,alpha=.5); a1.set_xlim(0,15); a1.set_xticklabels([])
    a2.plot(T,tq,color=GRID,lw=1.5); a2.plot(T[:i+1],tq[:i+1],color=C4,lw=2.5)
    a2.axhline(100,color=WARN,ls='--',lw=1.2); a2.axhline(-100,color=WARN,ls='--',lw=1.2); a2.text(14.8,92,'|τ| limit 100',ha='right',va='top',color=WARN,fontsize=11)
    a2.set_ylabel('motor torque (N·m)'); a2.set_xlabel('time (s)'); a2.grid(True,alpha=.5); a2.set_xlim(0,15); a2.set_ylim(-110,110)
    fig.savefig(f'{fd}/f{i:04d}.png'); plt.close(fig)
encode(fd,'segway'); poster(f'{fd}/f0040.png','segway'); print('done',nf, abs(tau).max())
