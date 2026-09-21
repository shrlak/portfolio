# Nonlinear Segway simulation with LQR (constants and Q/R from HW9_segway_setup.m). Writes seg_lqr.npz used by render_segway.py
import numpy as np, scipy.linalg as la
from scipy.integrate import solve_ivp
mw,Iw,r,ma,Ia,L,g=42,0.81,0.2,72.33,10.61,1.08,9.81
A_=(mw+ma)*r**2+Iw; B_=ma*L*r/2; C_=Ia+ma*L**2/4; G_=ma*g*L/2
Mi=np.linalg.inv(np.array([[A_,B_],[B_,C_]])); gc=Mi@[0,G_]; tc=Mi@[1,-1]
A=np.array([[0,0,1,0],[0,0,0,1],[gc[1],0,0,0],[gc[0],0,0,0]]); B=np.array([[0],[0],[tc[1]],[tc[0]]])
K=(B.T@la.solve_continuous_are(A,B,np.diag([1,2,.01,.001]),np.eye(1))).ravel()
def f(t,s):
    phi,th,phd,thd=s; tau=-K@[phi-np.pi/2,th,phd,thd]
    Mm=np.array([[A_,B_*np.sin(phi)],[B_*np.sin(phi),C_]])
    thdd,phdd=np.linalg.solve(Mm,[tau-B_*np.cos(phi)*phd**2,-tau-G_*np.cos(phi)])
    return [phd,thd,phdd,thdd]
sol=solve_ivp(f,[0,15],[75*np.pi/180,3*np.pi,0,0],max_step=0.002,rtol=1e-8)
tau=-(K@np.vstack([sol.y[0]-np.pi/2,sol.y[1:]]))
print('K =',K,' max|tau| =',abs(tau).max()); np.savez('seg_lqr.npz',t=sol.t,y=sol.y,tau=tau)
