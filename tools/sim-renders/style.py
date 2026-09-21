import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
BG='#0e1117'; PANEL='#161b22'; FG='#e6edf3'; MUTED='#8b949e'; GRID='#30363d'
C1='#58a6ff'; C2='#f78166'; C3='#3fb950'; C4='#d2a8ff'; WARN='#e3b341'
plt.rcParams.update({'figure.facecolor':BG,'axes.facecolor':PANEL,'axes.edgecolor':GRID,
 'axes.labelcolor':FG,'xtick.color':MUTED,'ytick.color':MUTED,'text.color':FG,'grid.color':GRID,
 'font.family':'DejaVu Sans','font.size':13,'axes.titlesize':15,'axes.titleweight':'bold',
 'legend.facecolor':PANEL,'legend.edgecolor':GRID,'savefig.facecolor':BG})
W,H,DPI=12.8,7.2,100
import subprocess, os
def encode(frames_dir, name, fps=30):
    out='/tmp/w/media/'+name
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(fps),'-i',f'{frames_dir}/f%04d.png',
      '-vf','scale=1280:-2,format=yuv420p','-c:v','libx264','-crf','26','-preset','slow','-an','-movflags','+faststart',out+'.mp4'],check=True)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(fps),'-i',f'{frames_dir}/f%04d.png',
      '-vf','scale=1280:-2','-c:v','libvpx-vp9','-b:v','0','-crf','40','-row-mt','1','-an',out+'.webm'],check=True)
def poster(png, name):
    from PIL import Image
    Image.open(png).convert('RGB').resize((1280,720)).save('/tmp/w/media/'+name+'-poster.jpg',quality=82)
