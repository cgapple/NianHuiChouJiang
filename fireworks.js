class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.fireworks = [];
        this.maxParticles = 100;
        this.colors = [
            '#FF0000',  // 大红
            '#FF4D00',  // 朱红
            '#FFD700',  // 金色
            '#FFA500',  // 橙色
            '#FF6B6B',  // 粉红
            '#FFB61E'   // 金黄
        ];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createParticles(x, y, color) {
        const particleCount = 50 + Math.random() * 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 3;
            const particle = {
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color,
                alpha: 1,
                life: 0.8 + Math.random() * 0.4
            };
            this.particles.push(particle);
        }
    }

    createFirework() {
        const x = Math.random() * this.width;
        const y = this.height;
        const targetY = Math.random() * (this.height * 0.6); // 提高爆炸高度
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        const firework = {
            x,
            y,
            targetY,
            color,
            velocity: -12 - Math.random() * 4, // 随机上升速度
            smoke: []
        };
        this.fireworks.push(firework);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= 0.01;
            p.alpha = p.life;
            p.vy += 0.05; // 重力
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    updateFireworks() {
        if (Math.random() < 0.03) { // 降低发射频率
            this.createFirework();
        }

        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const f = this.fireworks[i];
            f.y += f.velocity;

            // 创建金色烟雾轨迹
            f.smoke.push({
                x: f.x + (Math.random() * 2 - 1),
                y: f.y,
                alpha: 1,
                color: 'rgba(255, 215, 0, ' // 金色烟雾
            });

            if (f.y <= f.targetY) {
                this.createParticles(f.x, f.y, f.color);
                this.fireworks.splice(i, 1);
                continue;
            }

            // 更新烟雾
            for (let j = f.smoke.length - 1; j >= 0; j--) {
                const s = f.smoke[j];
                s.alpha -= 0.02;
                if (s.alpha <= 0) {
                    f.smoke.splice(j, 1);
                }
            }
        }
    }

    render() {
        // 使用半透明的深红色背景，创造层叠效果
        this.ctx.fillStyle = 'rgba(139, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 渲染金色烟雾轨迹
        this.fireworks.forEach(f => {
            f.smoke.forEach(s => {
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
                this.ctx.fillStyle = s.color + s.alpha + ')';
                this.ctx.fill();
            });
        });

        // 渲染上升的烟花
        this.fireworks.forEach(f => {
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = f.color;
            this.ctx.fill();

            // 添加发光效果
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(f.color)}, 0.3)`;
            this.ctx.fill();
        });

        // 渲染爆炸粒子
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`;
            this.ctx.fill();

            // 添加发光效果
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha * 0.3})`;
            this.ctx.fill();
        });

        this.updateFireworks();
        this.updateParticles();
        requestAnimationFrame(() => this.render());
    }

    hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }
}

// 初始化烟花效果
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireworks');
    new Firework(canvas);
}); 