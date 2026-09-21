import numpy as np
c=0.63; rho=7.575e6; T0=300.; A=0.6; Tm=1723.15
def T_field(x,y,z,P,v,k,r,n=4000):
    a=k/(rho*c)
    # substitution tau = s^2 to remove singularity; s in (0, smax]
    s=np.concatenate([[0.0],np.geomspace(1e-6, 1.0, n)])  # tau up to 1 s
    tau=s**2
    X=np.asarray(x)[...,None]; Y=np.asarray(y)[...,None]; Z=np.asarray(z)[...,None]
    sig2=r**2/2  # r = 1/e^2 radius? use sigma=r/sqrt(2)
    f= 2/(2*a*tau+sig2) * np.exp(-((X+v*tau)**2+Y**2)/(4*a*tau+2*sig2) - Z**2/(4*a*tau+1e-30))
    I=np.trapezoid(f,s,axis=-1)
    return T0 + A*P/(np.pi*rho*c*np.sqrt(4*np.pi*a))*I
def metrics(P,v,k,r):
    x=np.linspace(-600e-6,200e-6,1601)
    T=T_field(x,0*x,0*x,P,v,k,r)
    i=np.where(T>=Tm)[0]
    if len(i)==0: return None
    ib=i[0]  # back of pool (most negative x)
    dTdx=(T[ib+1]-T[ib-1])/(x[ib+1]-x[ib-1])
    G=v*dTdx
    # depth: along z at x of max depth; approximate scanning x
    xs=np.linspace(x[i[0]],x[i[-1]],40); zs=np.linspace(0,300e-6,301)
    XX,ZZ=np.meshgrid(xs,zs); TT=T_field(XX,0*XX,ZZ+1e-9,P,v,k,r)
    d=max(zs[np.where(TT[:,j]>=Tm)[0]].max() if (TT[:,j]>=Tm).any() else 0 for j in range(len(xs)))
    ys=np.linspace(0,300e-6,301); XX,YY=np.meshgrid(xs,ys); TT=T_field(XX,YY,0*XX,P,v,k,r)
    w=2*max(ys[np.where(TT[:,j]>=Tm)[0]].max() if (TT[:,j]>=Tm).any() else 0 for j in range(len(xs)))
    return G,d,w,T.max()
if __name__=='__main__':
    for k in [14,26.37]:
        for r in [50e-6,100e-6]:
            out=[metrics(400,v,k,r) for v in (0.2,1.0)]+[metrics(100,1.0,k,r)]
            print(k,r,[(f'{m[0]:.2e}',f'{m[1]*1e6:.0f}',f'{m[2]*1e6:.0f}',f'{m[3]:.0f}') for m in out])
