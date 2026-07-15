
export function register(runtime) {
    runtime.registerGenerator('timecode', (canvas, params) => {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(canvas.width/2 - 100, canvas.height - 80, 200, 50); ctx.fillStyle = 'white'; ctx.font = '30px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let t = params.time || 0; let f = Math.floor((t % 1) * 30).toString().padStart(2, '0'); let s = Math.floor(t % 60).toString().padStart(2, '0'); let m = Math.floor(t / 60).toString().padStart(2, '0'); ctx.fillText(`00:${m}:${s}:${f}`, canvas.width/2, canvas.height - 55);
    });
}
