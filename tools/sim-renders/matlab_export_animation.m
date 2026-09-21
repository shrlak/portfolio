%% Template: export any MATLAB sweep as a portfolio-ready MP4 (and optional GIF)
% Drop your own plotting code into the loop. Example below re-uses the melt-pool
% sweep idea: loop over scan speed and redraw the centerline temperature.
v_list = linspace(0.2, 1.0, 60);        % parameter to animate
vw = VideoWriter('meltpool_matlab.mp4','MPEG-4'); vw.FrameRate = 30; vw.Quality = 90; open(vw);
fig = figure('Color','w','Position',[100 100 1280 720]);
for i = 1:numel(v_list)
    clf; v = v_list(i);
    % ---- your plot here, e.g. T = gaussian_EagarTsai(t, x, 0*x, 0*x, c, rho, a, T0, v, P, abs, r);
    % plot(x*1e6, T, 'LineWidth', 2); yline(1723,'--','T_m');
    title(sprintf('v = %.2f m/s', v)); xlabel('x (\mum)'); ylabel('T (K)'); grid on
    drawnow; writeVideo(vw, getframe(fig));
    % GIF alternative (README use only): exportgraphics(fig,'anim.gif','Append',i>1);
end
close(vw);
% Then compress for the web (Terminal):
% ffmpeg -i meltpool_matlab.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 -an -movflags +faststart meltpool.mp4
