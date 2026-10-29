// ==========================================
// 내 집 마련 시뮬레이션: Web Audio 사운드 엔진
// 외부 파일 없이 브라우저 내장 합성기로 100% 작동
// ==========================================

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmOscillator = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // 1. 월급 입금음 (밝고 경쾌한 딩동댕 멜로디)
    playSalary() {
        if (this.muted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

            gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
        });
    }

    // 2. 동전 / 저축 짤랑 소리
    playCoin() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.06); // E6

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // 3. 버튼 클릭음 (산뜻한 탭)
    playClick() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // 4. 세금 딱지 회피 성공 (쉭! 바람소리)
    playDodge() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    // 5. 세금 고지서 피격 (쾅! 사이렌)
    playTaxHit() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    // 6. 주식 매수 (진입 삑)
    playStockBuy() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // 7. 주식 익절 성공 (환호 팡파르)
    playStockProfit() {
        if (this.muted) return;
        this.init();
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

            gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + i * 0.05);
            osc.stop(this.ctx.currentTime + i * 0.05 + 0.35);
        });
    }

    // 8. 주식 손절/떡락 (삐비빅 추락)
    playStockLoss() {
        if (this.muted) return;
        this.init();
        const notes = [440, 392, 349.23, 261.63];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.12);
        });
    }

    // 9. 승진 팡파르 (위풍당당 행진곡 멜로디)
    playPromotion() {
        if (this.muted) return;
        this.init();
        const melody = [
            { f: 523.25, d: 0.15 },
            { f: 523.25, d: 0.15 },
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.35 },
            { f: 587.33, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.5 }
        ];
        let t = this.ctx.currentTime;
        melody.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, t);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + item.d);
            t += item.d;
        });
    }

    // 10. 번아웃/위험 심장 박동음
    playHeartbeat() {
        if (this.muted) return;
        this.init();
        const playThump = (time, freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);

            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.12);
        };
        const now = this.ctx.currentTime;
        playThump(now, 90);
        playThump(now + 0.15, 80);
    }

    // 11. 게임 클리어 / 내 집 마련 축하 팡파르
    playVictory() {
        if (this.muted) return;
        this.init();
        const victoryNotes = [
            523.25, 659.25, 783.99, 1046.50,
            880.00, 1046.50, 1318.51
        ];
        let t = this.ctx.currentTime;
        victoryNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            const dur = (idx === victoryNotes.length - 1) ? 0.8 : 0.18;
            gain.gain.setValueAtTime(0.28, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + dur);
            t += dur * 0.8;
        });
    }

    // 12. 게임 오버
    playGameOver() {
        if (this.muted) return;
        this.init();
        const notes = [330, 311.13, 293.66, 261.63, 196];
        let t = this.ctx.currentTime;
        notes.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.35);
            t += 0.3;
        });
    }
}

window.sounds = new SoundEngine();
