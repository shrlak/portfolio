import numpy as np, os, sys
sys.path.insert(0,'/tmp/w/sim'); from style import *
from scipy.integrate import solve_ivp
p=dict(VG=15000,VI=15000,QL=8400,Nu=139000,lam=2470,Mu=7200,theta=2.5,Beta=1430*0.2,phi=0.51,Alpha=7600)
G24=lambda t:15000*(1<=t<=1.5)+10000*(5<=t<=5.75)+14000*(8<=t<=8.167)+12000*(12<=t<=13)
def box(t,a): return a[0]*(1<=t<=1.5)+a[1]*(5<=t<=5.75)+a[2]*(8<=t<=8.167)+a[3]*(12<=t<=13)
pats=[('Constant basal (350 mU/hr)',lambda t:350),
      ('Bolus only (meal-timed pulses)',lambda t:box(t,[3500,2000,3000,2500])),
      ('Basal 100 + bolus',lambda t:100+box(t,[2000,1500,1800,1600]))]
def rhs(t,s,I):
    x,y=s
    dx=(G24(t)+p['QL']-p['Nu']*x*y-p['lam']*x-p['Mu']*max(0,x-p['theta']))/p['VG']
    dy=(p['Beta']*max(0,x-p['phi'])-p['Alpha']*y+I(t))/p['VI']
    return [dx,dy]
tg=np.arange(0,24+1e-9,1/60); res=[]
for name,I in pats:
    s=solve_ivp(rhs,[0,24],[1.28,0.029],args=(I,),t_eval=tg,max_step=0.01)
    BG=s.y[0]; hi=BG>1.8
    runs=np.diff(np.r_[0,hi.astype(int),0]); st=np.where(runs==1)[0]; en=np.where(runs==-1)[0]
    mx=int((en-st).max()) if len(st) else 0
    res.append((name,I,BG,s.y[1],BG.std(),BG.min(),mx))
    print(name,'SD %.3f min %.3f maxHighRun %d min'%(BG.std(),BG.min(),mx))
fd='/tmp/w/fr_gluc'; os.makedirs(fd,exist_ok=True)
nf=300; cols=[C1,C4,C3]
for i in range(nf+30):
    k=min(i,nf); tt=24*k/nf; m=tg<=tt
    fig=plt.figure(figsize=(W,H),dpi=DPI)
    fig.text(0.04,0.93,'Glucose–insulin model — Type-1 diabetic, 24 h insulin-pump designs',fontsize=19,weight='bold')
    fig.text(0.04,0.885,'2-state nonlinear ODE (ode45 in MATLAB; re-run here) · 4 meals · targets: BG ≥ 0.7 mg/mL, ≤ 30 min above 1.8 mg/mL',color=MUTED,fontsize=13)
    ax0=fig.add_axes([0.06,0.70,0.64,0.13])
    ax0.fill_between(tg,[G24(t)/1000 for t in tg],color=WARN,alpha=.5,step='mid'); ax0.set_ylabel('meal\n(g/hr)'); ax0.set_xlim(0,24); ax0.set_xticklabels([]); ax0.grid(alpha=.4)
    ax0.axvline(tt,color=FG,lw=1,alpha=.6)
    ax=fig.add_axes([0.06,0.09,0.64,0.56])
    ax.axhspan(0.7,1.8,color=C3,alpha=0.07); ax.axhline(1.8,color=C2,ls='--',lw=1.2); ax.axhline(0.7,color=C2,ls='--',lw=1.2)
    for j,(name,I,BG,Y,sd,mn,mx) in enumerate(res):
        ax.plot(tg,BG,color=cols[j],alpha=.15,lw=1.5); ax.plot(tg[m],BG[m],color=cols[j],lw=2.6,label=name)
        if m.any(): ax.plot(tg[m][-1],BG[m][-1],'o',color=cols[j],ms=7)
    ax.set_xlim(0,24); ax.set_ylim(0,3.2); ax.set_xlabel('time (hr)'); ax.set_ylabel('blood glucose (mg/mL)'); ax.grid(alpha=.4)
    ax.legend(loc='upper right',fontsize=11); ax.text(0.3,1.83,'1.8 upper limit',color=C2,fontsize=10,va='bottom'); ax.text(0.3,0.67,'0.7 lower limit',color=C2,fontsize=10,va='top')
    a3=fig.add_axes([0.74,0.09,0.24,0.74]); a3.axis('off')
    a3.text(0,1.0,'result after 24 h',color=MUTED,fontsize=13)
    for j,(name,I,BG,Y,sd,mn,mx) in enumerate(res):
        yy=0.9-j*0.3; a3.text(0,yy,name,color=cols[j],fontsize=12,weight='bold')
        if i>=nf:
            ok1=mn>=0.7; ok2=mx<=30
            a3.text(0,yy-0.07,f'SD {sd:.3f} mg/mL',fontsize=12)
            a3.text(0,yy-0.13,f'min {mn:.2f}  '+('✓' if ok1 else '✗'),fontsize=12,color=C3 if ok1 else C2)
            a3.text(0,yy-0.19,f'max run >1.8: {mx} min  '+('✓' if ok2 else '✗'),fontsize=12,color=C3 if ok2 else C2)
        else: a3.text(0,yy-0.07,'simulating…',fontsize=12,color=MUTED)
    fig.savefig(f'{fd}/f{i:04d}.png'); plt.close(fig)
encode(fd,'glucose'); poster(f'{fd}/f{nf+5:04d}.png','glucose'); print('done')
