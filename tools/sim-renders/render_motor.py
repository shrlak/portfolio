import numpy as np, os, sys
sys.path.insert(0,'/tmp/w/sim'); from style import *
from scipy.signal import step, TransferFunction
d=np.load('/tmp/w/sim/motor.npz'); S,P=d['S'],d['P']
ts=np.linspace(0,1.5,600); _,ys=step(TransferFunction([109],[1,20,109]),T=ts); ys*=5
_,yp=step(TransferFunction([256],[1,9.6,256]),T=ts); yp*=0.1
os_meas=(P[:,1].max()-0.1)/0.1*100; os_th=(yp.max()-0.1)/0.1*100
fd='/tmp/w/fr_motor'; os.makedirs(fd,exist_ok=True); nf=210
for i in range(nf+45):
    tt=1.5*min(i,nf)/nf
    fig=plt.figure(figsize=(W,H),dpi=DPI)
    fig.text(0.04,0.93,'DC motor PI/PD control — Arduino hardware vs. designed closed loop',fontsize=19,weight='bold')
    fig.text(0.04,0.885,'Gains from pole placement · logged hardware data overlaid on the designed closed-loop step() response',color=MUTED,fontsize=13)
    for j,(ax_rect,T0,Y0,tm,ym,cm,lab,unit,ref) in enumerate([
        ([0.07,0.12,0.4,0.66],ts,ys,S[:,0],S[:,1],C1,'Speed loop (PI) — 5 rad/s step','speed (rad/s)',5),
        ([0.57,0.12,0.4,0.66],ts,yp,P[:,0],P[:,1],C2,'Position loop (PD) — 0.1 rad step','position (rad)',0.1)]):
        ax=fig.add_axes(ax_rect); ax.set_title(lab,loc='left')
        ax.axhline(ref,color=MUTED,ls=':',lw=1)
        ax.plot(T0[T0<=tt],Y0[T0<=tt],'--',color=FG,lw=2,label='designed (theory)')
        mm=tm<=tt; ax.plot(tm[mm],ym[mm],color=cm,lw=2.8,label='measured (Arduino)')
        ax.set_xlim(0,1.5); ax.set_ylim(0,ref*1.5); ax.set_xlabel('time (s)'); ax.set_ylabel(unit); ax.grid(alpha=.4); ax.legend(loc='lower right',fontsize=11)
        if i>=nf:
            txt=(f'steady state {S[-11:,1].mean():.3f} rad/s\nerror {5-S[-11:,1].mean():+.3f} rad/s' if j==0 else f'designed overshoot {os_th:.0f}%\nhardware: fast rise +\n±0.015 rad chatter')
            ax.text(0.04,0.96,txt,transform=ax.transAxes,va='top',fontsize=13,family='DejaVu Sans Mono',color=WARN)
    fig.savefig(f'{fd}/f{i:04d}.png'); plt.close(fig)
encode(fd,'motor'); poster(f'{fd}/f{nf+10:04d}.png','motor'); print('done',os_meas,os_th)
