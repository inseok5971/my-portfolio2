// ========================================================
// 내 집 마련 시뮬레이션: Modern Game Edition Engine (game.js)
// 기획서(월급 250 · 승진 시스템 · 8단계 턴 · 4대 엔딩) 완전 구현
// 모던 비주얼 & 대형 게임 카드 & 인터랙티브 애니메이션 탑재
// ========================================================

const JOB_RANKS = [
    { title: "사원", emoji: "💻", baseSalary: 250, taxDodgeSpeed: 2.2, taxFreq: 38, stars: "★" },
    { title: "대리", emoji: "📋", baseSalary: 300, taxDodgeSpeed: 2.8, taxFreq: 30, stars: "★★" },
    { title: "과장", emoji: "☕", baseSalary: 360, taxDodgeSpeed: 3.5, taxFreq: 24, stars: "★★★" },
    { title: "차장", emoji: "👔", baseSalary: 420, taxDodgeSpeed: 4.2, taxFreq: 18, stars: "★★★★" },
    { title: "부장", emoji: "👑", baseSalary: 500, taxDodgeSpeed: 5.0, taxFreq: 14, stars: "★★★★★" }
];

const HOUSING_STAGES = [
    { id: 0, name: "월세 원룸", desc: "보증금 1,000 / 월세 70만", rent: 70, targetDeposit: 0, icon: "🚪" },
    { id: 1, name: "역세권 오피스텔", desc: "보증금 3,000 / 월세 50만", rent: 50, targetDeposit: 3000, icon: "🏢" },
    { id: 2, name: "24평 전세 아파트", desc: "전세 1억 5천만 / 월세 0원!", rent: 0, targetDeposit: 15000, icon: "🏙️" },
    { id: 3, name: "34평 한강뷰 자가", desc: "🎉 자가 마련 성공! (3억원 이상)", rent: 0, targetDeposit: 30000, icon: "🏰" }
];

const LIFE_EVENTS = [
    { text: "친한 대학 동기의 결혼식 청첩장을 받았습니다.", icon: "💌", cash: -15, mental: -5, rep: +5 },
    { text: "사내 칭찬 릴레이에서 이달의 성실 직원으로 뽑혔습니다!", icon: "🎖️", cash: +10, mental: +10, rep: +15 },
    { text: "보유한 주식에서 쏠쏠한 분기 주식 배당금이 입금되었습니다!", icon: "📈", cash: +12, mental: +12, rep: 0 },
    { text: "사용하던 스마트폰 액정이 깨져 수리 센터에 다녀왔습니다.", icon: "📱", cash: -25, mental: -10, rep: 0 },
    { text: "심심풀이로 산 스피또 복권이 4등에 당첨되었습니다!", icon: "🎰", cash: +10, mental: +15, rep: 0 },
    { text: "회사 분기 목표 달성으로 깜짝 특별 성과급 보너스가 입금되었습니다!", icon: "🎁", cash: +20, mental: +15, rep: +5 },
    { text: "주말에 부모님이 직접 담근 김치와 깜짝 반찬을 보내주셨습니다.", icon: "🍱", cash: +20, mental: +20, rep: 0 },
    { text: "환절기 독감에 걸려 링거를 맞고 병원비를 지출했습니다.", icon: "💊", cash: -12, mental: -15, rep: 0 },
    { text: "직장 동기의 결혼식에 참석하여 축의금을 전달하고 축하했습니다.", icon: "💌", cash: -10, mental: 0, rep: +10 },
    { text: "사내 볼링 동호회에서 활약하며 동료들과 친해졌습니다.", icon: "🎳", cash: -5, mental: +15, rep: +12 },
    { text: "중고거래 앱에 안 쓰는 물건들을 팔아 쏠쏠한 용돈을 챙겼습니다.", icon: "📦", cash: +18, mental: +5, rep: 0 },
    { text: "국민연금/건강보험 정산 차액이 깜짝 환급되었습니다.", icon: "💸", cash: +25, mental: +10, rep: 0 },
    { text: "이번 주 로또 5등에 당첨되어 소소한 행운을 만끽했습니다!", icon: "🎟️", cash: +5, mental: +10, rep: 0 },
    { text: "치과 정기검진에서 충치가 발견되어 레진 치료를 받았습니다.", icon: "🦷", cash: -35, mental: -12, rep: 0 },
    { text: "퇴근길 우연히 들른 서점에서 인생 책을 발견하고 영감을 얻었습니다.", icon: "📚", cash: -3, mental: +20, rep: 0 },
    { text: "팀 회식에서 센스 있는 건배사로 팀장님의 흡족한 미소를 샀습니다.", icon: "🍻", cash: 0, mental: +5, rep: +10 }
];

class GameEngine {
    constructor() {
        this.resetGame();
        this.initFxCanvas();
    }

    resetGame() {
        this.state = {
            month: 1,
            age: 27,
            rankIndex: 0,
            salary: 250,
            
            // 자산 (단위: 만 원)
            cash: 500,
            savings: 0,
            stocks: 0,
            
            // 3대 스탯 (0~100)
            mental: 85,
            performance: 25,
            reputation: 50,
            
            // 주거 상태
            housingLevel: 0,
            
            // 이번 턴 임시 데이터
            currentPhase: 1,
            lastBonus: 0,
            lifestyleMode: 'normal',
            workChoice: 'normal',
            allocatedSavings: 0,
            allocatedStockSeed: 0,
            allocatedConsume: 0,
            freeCash: 100,
            taxFine: 0,
            luckyBonus: 0,
            taxDodged: 0,
            stockProfit: 0,
            
            // 누적 통계
            stats: {
                totalOvertime: 0,
                totalClockout: 0,
                totalStockProfit: 0,
                totalStockLoss: 0,
                promotionsCount: 0,
                salaryNegotiationsWon: 0,
                totalEarnedSalary: 0
            }
        };

        this.renderAll();
    }

    // ==========================================
    // 유틸리티 & 화폐 포맷
    // ==========================================
    getTotalAssets() {
        return this.state.cash + this.state.savings + this.state.stocks;
    }

    formatMoney(val) {
        val = Math.round(val);
        if (Math.abs(val) >= 10000) {
            const eok = Math.floor(val / 10000);
            const man = Math.abs(val % 10000);
            return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
        }
        return `${val.toLocaleString()}만원`;
    }

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    // ==========================================
    // FX 파티클 / 컨페티 효과 캔버스
    // ==========================================
    initFxCanvas() {
        this.fxCanvas = document.getElementById('fxCanvas');
        if (!this.fxCanvas) return;
        this.fxCtx = this.fxCanvas.getContext('2d');
        this.particles = [];

        const resize = () => {
            this.fxCanvas.width = window.innerWidth;
            this.fxCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const renderFx = () => {
            this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity || 0.15;
                p.alpha -= p.fade || 0.015;
                p.rotation += p.vRot || 0.05;

                this.fxCtx.save();
                this.fxCtx.globalAlpha = Math.max(0, p.alpha);
                this.fxCtx.translate(p.x, p.y);
                this.fxCtx.rotate(p.rotation);
                this.fxCtx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    this.fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else {
                    this.fxCtx.beginPath();
                    this.fxCtx.arc(0, 0, p.size, 0, Math.PI * 2);
                    this.fxCtx.fill();
                }
                this.fxCtx.restore();

                if (p.alpha <= 0 || p.y > this.fxCanvas.height + 20) {
                    this.particles.splice(i, 1);
                }
            }
            requestAnimationFrame(renderFx);
        };
        requestAnimationFrame(renderFx);
    }

    triggerConfetti(count = 70) {
        if (!this.fxCanvas) return;
        const colors = ['#00f2fe', '#38bdf8', '#10b981', '#fbbf24', '#f43f5e', '#c084fc'];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.fxCanvas.width / 2 + (Math.random() - 0.5) * 300,
                y: this.fxCanvas.height * 0.35,
                vx: (Math.random() - 0.5) * 14,
                vy: -Math.random() * 12 - 4,
                gravity: 0.3,
                size: Math.random() * 8 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.4 ? 'rect' : 'circle',
                alpha: 1,
                fade: 0.008 + Math.random() * 0.008,
                rotation: Math.random() * Math.PI,
                vRot: (Math.random() - 0.5) * 0.2
            });
        }
    }

    // ==========================================
    // UI 전체 렌더링
    // ==========================================
    renderAll() {
        this.renderStatusDashboard();
        this.renderPhaseStepper();
        this.renderActionCard();
    }

    renderStatusDashboard() {
        const s = this.state;
        const total = this.getTotalAssets();
        const curRank = JOB_RANKS[s.rankIndex];
        const curHousing = HOUSING_STAGES[s.housingLevel];

        // 1. 헤더 날짜
        const year = Math.floor((s.month - 1) / 12) + 1;
        const m = ((s.month - 1) % 12) + 1;
        const curAge = s.age + Math.floor((s.month - 1) / 12);
        
        const dateTextEl = document.getElementById('dateText');
        if (dateTextEl) dateTextEl.innerText = `${s.month}월`;

        // 2. 직급 & 레벨 스타 & 급여 & 주거
        document.getElementById('jobBadge').innerText = `${curRank.title} ${curRank.emoji}`;
        const rankLevelEl = document.getElementById('jobRankLevel');
        if (rankLevelEl) rankLevelEl.innerText = curRank.stars;

        document.getElementById('salaryText').innerText = `월 ${s.salary}만원`;
        document.getElementById('housingBadge').innerText = `${curHousing.icon} ${curHousing.name}`;

        const housingCostEl = document.getElementById('housingCostLabel');
        if (housingCostEl) {
            housingCostEl.innerHTML = curHousing.rent > 0 
                ? `월세: <b>${curHousing.rent}만원</b> (고정 지출)` 
                : `<span style="color: #10b981; font-weight: 800;">🎉 월세 0원 (고정 지출 완벽 절감!)</span>`;
        }

        // 주거 일러스트 그래픽 SVG 동적 렌더링
        this.renderHousingGraphic(s.housingLevel);

        // 3. 자산 3분할
        document.getElementById('cashVal').innerText = this.formatMoney(s.cash);
        document.getElementById('savingsVal').innerText = this.formatMoney(s.savings);
        document.getElementById('stocksVal').innerText = this.formatMoney(s.stocks);

        // 4. 최종 3억원 목표 게이지
        const targetGoal = 30000;
        const pct = Math.min(100, Math.max(0, (total / targetGoal) * 100));
        document.getElementById('totalAssetVal').innerText = this.formatMoney(total);
        document.getElementById('goalPercent').innerText = `${pct.toFixed(1)}%`;
        document.getElementById('goalProgressBar').style.width = `${pct}%`;

        // 마일스톤 노드 상태
        document.getElementById('node1').classList.toggle('reached', total >= 3000);
        document.getElementById('node2').classList.toggle('reached', total >= 15000);
        document.getElementById('node3').classList.toggle('reached', total >= 30000);

        // 5. 3대 스탯 게이지
        document.getElementById('mentalVal').innerText = `${Math.round(s.mental)} / 100`;
        document.getElementById('mentalBar').style.width = `${Math.round(s.mental)}%`;

        const mentalBox = document.getElementById('mentalBox');
        if (s.mental <= 30) {
            mentalBox.classList.add('warning-pulse');
        } else {
            mentalBox.classList.remove('warning-pulse');
        }

        document.getElementById('perfVal').innerText = `${Math.round(s.performance)} / 100`;
        document.getElementById('perfBar').style.width = `${Math.round(s.performance)}%`;

        document.getElementById('repVal').innerText = `${Math.round(s.reputation)} / 100`;
        document.getElementById('repBar').style.width = `${Math.round(s.reputation)}%`;
    }

    // 주거 단계별 모던 벡터 일러스트 SVG
    renderHousingGraphic(level) {
        const container = document.getElementById("housingGraphic");
        if (!container) return;

        if (level === 0) {
            // 0단계: 월세 자취방 (따뜻한 파스텔 원룸)
            container.innerHTML = `
                <svg viewBox="0 0 280 110" width="100%" height="100%">
                    <rect width="280" height="110" fill="#fefce8" rx="12"/>
                    <!-- 창문과 따뜻한 햇살 -->
                    <rect x="25" y="15" width="48" height="42" rx="6" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
                    <circle cx="58" cy="28" r="8" fill="#fde047" opacity="0.95"/>
                    <line x1="49" y1="15" x2="49" y2="57" stroke="#38bdf8" stroke-width="1.5"/>
                    <line x1="25" y1="36" x2="73" y2="36" stroke="#38bdf8" stroke-width="1.5"/>
                    <!-- 포근한 싱글 침대 -->
                    <rect x="140" y="55" width="95" height="34" rx="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
                    <rect x="146" y="52" width="30" height="16" rx="4" fill="#93c5fd"/>
                    <rect x="175" y="62" width="55" height="25" rx="3" fill="#bfdbfe"/>
                    <!-- 자취 책상과 노트북 -->
                    <rect x="35" y="64" width="55" height="26" rx="4" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>
                    <rect x="50" y="56" width="24" height="15" rx="2" fill="#0284c7"/>
                    <!-- 초록 화분 -->
                    <circle cx="85" cy="62" r="5" fill="#10b981"/>
                    <polygon points="82,68 88,68 86,74 84,74" fill="#b45309"/>
                    <text x="140" y="30" font-family="Jua, sans-serif" font-size="14" fill="#0369a1">🚪 월세 70만원 자취방</text>
                    <text x="140" y="46" font-family="Pretendard, sans-serif" font-size="11" fill="#64748b">내 집 마련을 향한 첫 출발</text>
                </svg>
            `;
        } else if (level === 1) {
            // 1단계: 역세권 오피스텔 (산뜻한 민트/스카이 모던룸)
            container.innerHTML = `
                <svg viewBox="0 0 280 110" width="100%" height="100%">
                    <rect width="280" height="110" fill="#f0fdf4" rx="12"/>
                    <!-- 시원한 통창 뷰 -->
                    <rect x="20" y="12" width="115" height="74" rx="6" fill="#e0f2fe" stroke="#34d399" stroke-width="2"/>
                    <rect x="32" y="32" width="18" height="54" fill="#bae6fd"/>
                    <rect x="56" y="22" width="22" height="64" fill="#7dd3fc"/>
                    <rect x="84" y="36" width="18" height="50" fill="#bae6fd"/>
                    <rect x="108" y="26" width="20" height="60" fill="#7dd3fc"/>
                    <!-- 푹신한 민트 소파 -->
                    <rect x="148" y="54" width="95" height="34" rx="8" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
                    <circle cx="165" cy="68" r="7" fill="#6ee7b7"/>
                    <circle cx="195" cy="68" r="7" fill="#6ee7b7"/>
                    <text x="148" y="28" font-family="Jua, sans-serif" font-size="14" fill="#059669">🏢 역세권 오피스텔</text>
                    <text x="148" y="44" font-family="Pretendard, sans-serif" font-size="11" fill="#0284c7">월세 50만으로 20만 절감!</text>
                </svg>
            `;
        } else if (level === 2) {
            // 2단계: 24평 전세 아파트 (넓은 베란다와 정원 뷰)
            container.innerHTML = `
                <svg viewBox="0 0 280 110" width="100%" height="100%">
                    <rect width="280" height="110" fill="#eff6ff" rx="12"/>
                    <!-- 공원 뷰 발코니 -->
                    <rect x="18" y="12" width="115" height="78" rx="6" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2"/>
                    <circle cx="45" cy="70" r="16" fill="#86efac"/>
                    <circle cx="80" cy="65" r="20" fill="#4ade80"/>
                    <circle cx="110" cy="72" r="14" fill="#86efac"/>
                    <!-- 거실 카페 테이블과 식물 -->
                    <rect x="145" y="58" width="96" height="30" rx="6" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>
                    <circle cx="160" cy="46" r="6" fill="#f43f5e"/>
                    <circle cx="175" cy="48" r="5" fill="#fbbf24"/>
                    <text x="145" y="26" font-family="Jua, sans-serif" font-size="14" fill="#1d4ed8">🏡 24평 전세 아파트</text>
                    <text x="145" y="42" font-family="Pretendard, sans-serif" font-size="11" fill="#059669">🎉 매달 월세 지출 0원 달성!</text>
                </svg>
            `;
        } else {
            // 3단계: 핀터레스트 레퍼런스 스타일 절벽 위 꿈의 단독주택 + GOAL 팻말!
            container.innerHTML = `
                <svg viewBox="0 0 280 110" width="100%" height="100%">
                    <rect width="280" height="110" fill="#e0f7ff" rx="12"/>
                    <!-- 핀터레스트 오렌지 절벽 & 민트 잔디 -->
                    <rect x="0" y="70" width="280" height="40" fill="#f69d4d"/>
                    <rect x="15" y="80" width="10" height="18" rx="2" fill="#e48232"/>
                    <rect x="95" y="82" width="12" height="16" rx="2" fill="#e48232"/>
                    <rect x="180" y="80" width="10" height="20" rx="2" fill="#e48232"/>
                    <!-- 물결 잔디 -->
                    <path d="M 0 70 Q 20 62 40 70 Q 60 62 80 70 Q 100 62 120 70 Q 140 62 160 70 Q 180 62 200 70 Q 220 62 240 70 Q 260 62 280 70 L 280 75 L 0 75 Z" fill="#38d6b7"/>
                    <!-- 빨간 지붕의 예쁜 단독주택 -->
                    <polygon points="65,22 25,48 105,48" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
                    <rect x="35" y="48" width="60" height="24" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
                    <rect x="58" y="54" width="14" height="18" fill="#d97706" rx="2"/>
                    <rect x="42" y="52" width="10" height="10" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>
                    <rect x="78" y="52" width="10" height="10" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>
                    <!-- 굴뚝 & 뽀글 연기 -->
                    <rect x="82" y="24" width="8" height="14" fill="#e11d48"/>
                    <circle cx="86" cy="18" r="3" fill="#cbd5e1" opacity="0.8"/>
                    <circle cx="89" cy="12" r="4.5" fill="#cbd5e1" opacity="0.6"/>
                    <!-- 핀터레스트 시그니처 GOAL 팻말! -->
                    <rect x="135" y="48" width="5" height="24" fill="#92400e"/>
                    <rect x="120" y="34" width="35" height="18" rx="4" fill="#fed7aa" stroke="#78350f" stroke-width="2"/>
                    <text x="137.5" y="47" font-family="Jua, sans-serif" font-size="10.5" font-weight="bold" fill="#78350f" text-anchor="middle">GOAL</text>
                    <text x="165" y="28" font-family="Jua, sans-serif" font-size="14" fill="#b91c1c">🏰 3억원 내 집 마련!</text>
                    <text x="165" y="45" font-family="Pretendard, sans-serif" font-size="11" fill="#059669">🎉 대한민국 상위 10% 갓생</text>
                </svg>
            `;
        }
    }

    renderPhaseStepper() {
        const steps = document.querySelectorAll('.phase-stepper .step-pill');
        steps.forEach((el, idx) => {
            const p = idx + 1;
            el.classList.remove('active', 'completed');
            if (p === this.state.currentPhase) {
                el.classList.add('active');
            } else if (p < this.state.currentPhase) {
                el.classList.add('completed');
            }
        });
    }

    // ==========================================
    // 8단계 액션 카드 렌더러
    // ==========================================
    renderActionCard() {
        const card = document.getElementById('actionCard');
        card.innerHTML = '';

        switch (this.state.currentPhase) {
            case 1: this.renderPhase1_Salary(card); break;
            case 2: this.renderPhase2_TaxDefense(card); break;
            case 3: this.renderPhase3_Expenses(card); break;
            case 4: this.renderPhase4_Career(card); break;
            case 5: this.renderPhase5_Allocation(card); break;
            case 6: this.renderPhase6_StockMomentum(card); break;
            case 7: this.renderPhase7_MonthlyEvent(card); break;
            case 8: this.renderPhase8_Settlement(card); break;
        }
    }

    // ------------------------------------------
    // [1단계] 월급 입금일 (Payday)
    // ------------------------------------------
    renderPhase1_Salary(container) {
        const s = this.state;
        const curRank = JOB_RANKS[s.rankIndex];

        let monthlyInterest = 0;
        if (s.savings > 0) {
            monthlyInterest = Math.round(s.savings * (0.04 / 12));
            s.savings += monthlyInterest;
        }

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 1 / 8 : 월급 입금일</span>
                <h2 class="card-title">띵동! 이번 달 월급이 도착했습니다 💳</h2>
                <p class="card-subtitle">성실하게 일한 한 달의 결실, 통장에 세후 실 수령액이 입금됩니다.</p>
            </div>

            <div class="paystub-card">
                <div class="paystub-header">
                    <div class="paystub-title">급여 지급 명세서</div>
                    <small style="color: #64748b;">${s.month}회차 급여 / 직급: [${curRank.title} ${curRank.stars}]</small>
                </div>
                <div class="paystub-rows">
                    <div class="paystub-row">
                        <span>기본 급여 (세전)</span>
                        <strong>${s.salary + 35}만원</strong>
                    </div>
                    <div class="paystub-row" style="color: #64748b;">
                        <span>4대 보험 및 근로소득세 원천징수</span>
                        <span>-35만원</span>
                    </div>
                    ${monthlyInterest > 0 ? `
                    <div class="paystub-row" style="color: #10b981;">
                        <span>정기 적금 이자 수익 (연 4.0% 복리)</span>
                        <strong>+${monthlyInterest}만원</strong>
                    </div>` : ''}
                    <div class="paystub-row total">
                        <span>실수령 입금액</span>
                        <span>+${s.salary}만원</span>
                    </div>
                </div>
            </div>

            <button id="btnDepositConfirm" class="game-btn btn-primary-large" style="width: 100%; margin-top: 10px;">
                💰 월급 입금 확인하고 다음 단계로 👉
            </button>
        `;

        document.getElementById('btnDepositConfirm').onclick = () => {
            window.sounds.playSalary();
            this.triggerConfetti(25);
            s.cash += s.salary;
            s.stats.totalEarnedSalary += s.salary;
            this.goToPhase(2);
        };
    }

    // ==========================================
    // 모던 치비 게임 캐릭터 렌더러
    // ==========================================
        drawGameHero(ctx, x, y, isFacingLeft, isRunning, frameCount, shieldActive) {
        ctx.save();
        ctx.translate(x, y);

        if (isFacingLeft) {
            ctx.scale(-1, 1);
        }

        const bob = isRunning ? Math.sin(frameCount * 0.35) * 3.5 : 0;
        const legSwing = isRunning ? Math.sin(frameCount * 0.35) * 7.5 : 0;

        // 1. 발 아래 부드러운 타원 그림자
        ctx.fillStyle = "rgba(40, 80, 110, 0.25)";
        ctx.beginPath();
        ctx.ellipse(0, 24, 20, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. 쉴드 보호막 (활성화 시 - 산뜻한 민트 반투명 구체)
        if (shieldActive > 0) {
            ctx.save();
            ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 36, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
            ctx.fill();

            const orbitAngle = frameCount * 0.12;
            const ox = Math.cos(orbitAngle) * 36;
            const oy = Math.sin(orbitAngle) * 36;
            ctx.fillStyle = "#fef08a";
            ctx.beginPath();
            ctx.arc(ox, oy, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 3. 다리 & 슬레이트 네이비 바지
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(-8, 9 + bob, 5, 12 + legSwing);
        ctx.fillRect(3, 9 + bob, 5, 12 - legSwing);

        // 4. 귀여운 화이트 스니커즈 (핀터레스트 레퍼런스 스타일)
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1.5;
        // 왼쪽 신발
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-10, 21 + bob + legSwing, 9, 6, 2.5);
        else ctx.rect(-10, 21 + bob + legSwing, 9, 6);
        ctx.fill();
        ctx.stroke();
        // 오른쪽 신발
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(2, 21 + bob - legSwing, 9, 6, 2.5);
        else ctx.rect(2, 21 + bob - legSwing, 9, 6);
        ctx.fill();
        ctx.stroke();
        // 민트색 밑창 포인트
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(-10, 25 + bob + legSwing, 9, 2);
        ctx.fillRect(2, 25 + bob - legSwing, 9, 2);

        // 5. 오버사이즈 화이트 셔츠/맨투맨
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(-13, -8 + bob, 26, 20, 6);
        else ctx.rect(-13, -8 + bob, 26, 20);
        ctx.fill();
        ctx.stroke();

        // 셔츠 깃 & 목 음영
        ctx.fillStyle = "#dbeafe";
        ctx.beginPath();
        ctx.arc(0, -6 + bob, 5, 0, Math.PI);
        ctx.fill();

        // 6. 둥근 안경 쓴 치비 소년 얼굴
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, -20 + bob, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 발그레한 볼터치
        ctx.fillStyle = "#ff8da1";
        ctx.beginPath();
        ctx.arc(-7, -16 + bob, 3.5, 0, Math.PI * 2);
        ctx.arc(7, -16 + bob, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 7. 초롱초롱 눈동자
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(-5, -20 + bob, 2.5, 0, Math.PI * 2);
        ctx.arc(5, -20 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-4.2, -21 + bob, 1, 0, Math.PI * 2);
        ctx.arc(5.8, -21 + bob, 1, 0, Math.PI * 2);
        ctx.fill();

        // 8. 핀터레스트 원형 뿔테 안경 (시그니처)
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(-5, -20 + bob, 5.8, 0, Math.PI * 2);
        ctx.arc(5, -20 + bob, 5.8, 0, Math.PI * 2);
        ctx.stroke();
        // 안경 코받침 연결선
        ctx.beginPath();
        ctx.moveTo(-0.5, -20 + bob);
        ctx.lineTo(0.5, -20 + bob);
        ctx.stroke();

        // 안경 알 빛 반사
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-7.5, -23 + bob);
        ctx.lineTo(-5.5, -21 + bob);
        ctx.moveTo(2.5, -23 + bob);
        ctx.lineTo(4.5, -21 + bob);
        ctx.stroke();

        // 귀여운 미소
        ctx.strokeStyle = "#e11d48";
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, -15 + bob, 2.5, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // 9. 다크 네이비 머리카락 & 핀터레스트 특유의 솟은 꽁지머리
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        // 뒷머리 & 옆머리
        ctx.beginPath();
        ctx.arc(0, -22 + bob, 15, Math.PI, 0);
        ctx.fill();
        // 앞머리 뱅 스타일
        ctx.beginPath();
        ctx.moveTo(-15, -22 + bob);
        ctx.lineTo(-6, -14 + bob);
        ctx.lineTo(-1, -19 + bob);
        ctx.lineTo(5, -15 + bob);
        ctx.lineTo(12, -19 + bob);
        ctx.lineTo(15, -22 + bob);
        ctx.lineTo(12, -30 + bob);
        ctx.lineTo(-12, -30 + bob);
        ctx.closePath();
        ctx.fill();
        // 머리 위 쫑긋 솟은 꽁지머리 (Pinterest 시그니처 턱)
        ctx.beginPath();
        ctx.moveTo(0, -32 + bob);
        ctx.quadraticCurveTo(-4, -38 + bob, -7, -35 + bob);
        ctx.quadraticCurveTo(-3, -33 + bob, 2, -32 + bob);
        ctx.fill();

        ctx.restore();
    }

    renderPhase2_TaxDefense(container) {
        const s = this.state;
        const curRank = JOB_RANKS[s.rankIndex];

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 2 / 8 : 방어 & 득템 라운드 (30초)</span>
                <h2 class="card-title">축의금·세금은 피하고, 복권·배당금은 낚아채라! 🏃‍♂️💰</h2>
                <p class="card-subtitle">
                    ${curRank.title} 직급의 일상! <b>빨간 지출 카드(결혼 축의금, 세금 고지서, 과태료)</b>는 요리조리 피하고, 
                    <b>초록/황금 득템 카드(복권 소액 당첨, 주식 배당금, 깜짝 보너스, 쉴드)</b>는 몸으로 받으세요! (비율 득템2 : 지출3)
                </p>
            </div>

            <div class="canvas-wrapper">
                <canvas id="taxCanvas" width="800" height="420"></canvas>
                <div class="canvas-overlay-ui">
                    <span class="dodge-timer">⏱️ <b id="taxTimer">30</b>초</span>
                    <span class="dodge-hits" style="background: rgba(244, 63, 94, 0.25); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.5);">
                        💥 지출 피해: -<b id="taxFineText">0</b>만 (<b id="taxHits">0</b>회)
                    </span>
                    <span class="dodge-lucky" style="background: rgba(16, 185, 129, 0.25); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.5); padding: 6px 16px; border-radius: 9999px; font-weight: 800;">
                        ✨ 득템 수익: +<b id="taxLuckyText">0</b>만
                    </span>
                </div>
            </div>

            <div class="control-guide-badge" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px auto 8px auto; background: #e0f2fe; border: 2.5px solid #7dd3fc; border-radius: 9999px; padding: 8px 24px; font-family: 'Jua', sans-serif; font-size: 1.05rem; color: #0369a1; box-shadow: 0 4px 10px rgba(3, 105, 161, 0.08);">
                <span>🎮 <b>조작 방법</b>: 키보드 방향키(←, →) 또는 마우스 좌우 이동 (화면 버튼 클릭도 가능)</span>
            </div>

            <div class="mobile-dodge-controls">
                <button id="btnTaxLeft" class="btn-ctrl">◀ 방향키(←) / 마우스 좌</button>
                <button id="btnTaxRight" class="btn-ctrl">방향키(→) / 마우스 우 ▶</button>
            </div>

            <div style="display: flex; justify-content: center; gap: 16px; font-size: 0.88rem; font-weight: 700; flex-wrap: wrap; text-align: center; margin-top: 4px;">
                <span style="color: #f43f5e;">💥 피하세요 (3비율): 💌 결혼 축의금(-10만~-15만), 📄 건보료, 🚗 과태료, 📱 액정수리비</span>
                <span style="color: #10b981;">✨ 낚아채세요 (2비율): 🎰 복권 당첨(+5만~+10만), 📈 주식 배당금(+8만~+12만), 🎁 특별보너스(+15만), 🛡️ 쉴드</span>
            </div>
        `;

        this.initTaxMiniGame(curRank);
    }

    initTaxMiniGame(curRank) {
        const canvas = document.getElementById("taxCanvas");
        const ctx = canvas.getContext("2d");
        const timerEl = document.getElementById("taxTimer");
        const hitsEl = document.getElementById("taxHits");
        const fineEl = document.getElementById("taxFineText");
        const luckyEl = document.getElementById("taxLuckyText");

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 800;
        canvas.height = rect.height || 420;

        const groundY = canvas.height - 48;

        let player = {
            x: canvas.width / 2,
            y: groundY - 24,
            w: 48,
            h: 48,
            speed: 7.8,
            shieldTime: 0,
            isFacingLeft: false
        };

        let keys = { left: false, right: false };
        let items = [];
        let hits = 0;
        let totalFine = 0;
        let totalLucky = 0;
        let timeLeft = 30; // 30초 타이머
        let isRunning = true;
        let frameCount = 0;

        // 1. 피해야 하는 지출/폭탄 아이템 (3비율 = 60%)
        const expenseItems = [
            { text: "동기 청첩장", color: "#f43f5e", amount: 15, emoji: "💌", type: "expense" },
            { text: "건보료 폭탄", color: "#f43f5e", amount: 8, emoji: "📄", type: "expense" },
            { text: "지방소득세", color: "#f59e0b", amount: 6, emoji: "🧾", type: "expense" },
            { text: "주정차과태료", color: "#ec4899", amount: 5, emoji: "🚗", type: "expense" },
            { text: "액정 수리비", color: "#f43f5e", amount: 7, emoji: "📱", type: "expense" },
            { text: "깜짝세 고지서", color: "#a855f7", amount: 12, emoji: "⚠️", type: "expense" }
        ];

        // 2. 반드시 몸으로 먹어야 하는 득템/보너스 아이템 (2비율 = 40%)
        const luckyItems = [
            { text: "결혼 축의금", color: "#fb7185", amount: 10, emoji: "💌", type: "lucky" },
            { text: "복권 4등당첨", color: "#fbbf24", amount: 5, emoji: "🎰", type: "lucky" },
            { text: "로또 당첨!", color: "#fbbf24", amount: 10, emoji: "🎟️", type: "lucky" },
            { text: "주식 배당금", color: "#10b981", amount: 8, emoji: "📈", type: "lucky" },
            { text: "특별 보너스", color: "#0284c7", amount: 15, emoji: "🎁", type: "lucky" },
            { text: "부모님 용돈", color: "#10b981", amount: 8, emoji: "🍱", type: "lucky" },
            { text: "절세 쉴드!", color: "#00f2fe", amount: 0, emoji: "🛡️", type: "shield" }
        ];

        const onKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                keys.left = true;
                player.isFacingLeft = true;
            }
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                keys.right = true;
                player.isFacingLeft = false;
            }
        };
        const onKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
        };

        const onTouchMove = (e) => {
            const r = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const scaleX = canvas.width / (r.width || canvas.width);
            const newX = (clientX - r.left) * scaleX;
            if (newX < player.x - 2) player.isFacingLeft = true;
            else if (newX > player.x + 2) player.isFacingLeft = false;
            player.x = Math.max(player.w / 2, Math.min(canvas.width - player.w / 2, newX));
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        canvas.addEventListener("touchmove", onTouchMove, { passive: true });
        canvas.addEventListener("mousemove", onTouchMove);

        // 방향키 / 마우스 / 화면 터치 버튼 바인딩
        const bindButton = (id, isLeft) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const start = (e) => {
                if (e.cancelable) e.preventDefault();
                if (isLeft) {
                    keys.left = true;
                    player.isFacingLeft = true;
                } else {
                    keys.right = true;
                    player.isFacingLeft = false;
                }
            };
            const stop = () => {
                if (isLeft) keys.left = false;
                else keys.right = false;
            };
            btn.onmousedown = btn.ontouchstart = start;
            btn.onmouseup = btn.ontouchend = btn.onmouseleave = stop;
            btn.onclick = () => {
                if (isLeft) player.x = Math.max(player.w / 2, player.x - 30);
                else player.x = Math.min(canvas.width - player.w / 2, player.x + 30);
            };
        };

        bindButton("btnTaxLeft", true);
        bindButton("btnTaxRight", false);
        bindButton("btnMoveLeft", true);
        bindButton("btnMoveRight", false);

        const timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        const endGame = () => {
            isRunning = false;
            clearInterval(timerInterval);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);

            this.state.taxFine = Math.max(0, totalFine);
            this.state.luckyBonus = Math.max(0, totalLucky);
            this.state.cash += this.state.luckyBonus;
            const netResult = this.state.luckyBonus - this.state.taxFine;

            const card = document.getElementById("actionCard");
            const resultBox = document.createElement("div");
            resultBox.style.marginTop = "16px";
            resultBox.style.padding = "20px";
            resultBox.style.borderRadius = "20px";
            resultBox.style.background = netResult >= 0 ? "#f0fdf4" : "#fff1f2";
            resultBox.style.border = `3px solid ${netResult >= 0 ? "#86efac" : "#fecdd3"}`;
            resultBox.style.textAlign = "center";
            resultBox.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";

            resultBox.innerHTML = `
                <h3 style="font-family: Jua, sans-serif; font-size: 1.45rem; color: ${netResult >= 0 ? "#166534" : "#991b1b"}; margin-bottom: 6px;">
                    ${netResult >= 0 ? `🎉 30초 득템 성공! 순수익 +${netResult}만원 달성!` : `⚠️ 30초 방어 종료! 순지출 ${netResult}만원 발생`}
                </h3>
                <p style="font-size: 1rem; color: #475569; margin-bottom: 14px;">
                    🎁 득템 보너스 합계: <b style="color: #059669;">+${totalLucky}만원</b> | 📜 지출 청구서: <b style="color: #e11d48;">-${totalFine}만원</b>
                </p>
                <button id="btnFinishTax" class="game-btn btn-primary-large" style="width: 100%; max-width: 380px;">
                    다음 단계(고정 지출 결제)로 ➔
                </button>
            `;

            const canvasWrap = card.querySelector(".canvas-wrapper");
            if (canvasWrap) {
                canvasWrap.after(resultBox);
            } else {
                card.appendChild(resultBox);
            }

            document.getElementById("btnFinishTax").onclick = () => {
                window.sounds.playClick();
                this.goToPhase(3);
            };
        };

        const loop = () => {
            if (!isRunning) return;
            frameCount++;

            if (player.shieldTime > 0) player.shieldTime--;

            // 이동
            const isMoving = keys.left || keys.right;
            if (keys.left) player.x -= player.speed;
            if (keys.right) player.x += player.speed;
            player.x = Math.max(player.w / 2, Math.min(canvas.width - player.w / 2, player.x));

            // 아이템 스폰 (2:3 비율 = 40% 득템 : 60% 지출)
            if (frameCount % curRank.taxFreq === 0) {
                const isLucky = Math.random() < 0.40;
                const chosen = isLucky
                    ? luckyItems[Math.floor(Math.random() * luckyItems.length)]
                    : expenseItems[Math.floor(Math.random() * expenseItems.length)];

                items.push({
                    x: Math.random() * (canvas.width - 120) + 60,
                    y: -50,
                    speed: curRank.taxDodgeSpeed + Math.random() * 1.3,
                    text: chosen.text,
                    color: chosen.color,
                    amount: chosen.amount,
                    emoji: chosen.emoji,
                    type: chosen.type,
                    w: 82,
                    h: 88,
                    rot: (Math.random() - 0.5) * 0.12,
                    seed: Math.random() * 10
                });
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ==========================================
            // [핀터레스트 레퍼런스 스타일 배경 렌더링]
            // ==========================================

            // 1. 산뜻한 파스텔 하늘 그라데이션
            const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
            skyGrad.addColorStop(0, "#9ae2fb");
            skyGrad.addColorStop(0.5, "#cbf1ff");
            skyGrad.addColorStop(1, "#ebf9ff");
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. 원경의 부드러운 스카이블루 도시 실루엣 (Pinterest 빌딩 룩)
            const cityY = groundY - 140;
            ctx.fillStyle = "rgba(179, 229, 252, 0.75)";
            ctx.fillRect(30, cityY + 25, 45, 115);
            ctx.fillRect(90, cityY - 15, 60, 155);
            ctx.fillRect(165, cityY + 35, 45, 105);
            ctx.fillRect(225, cityY - 25, 75, 165);
            ctx.fillRect(320, cityY + 20, 55, 120);
            ctx.fillRect(395, cityY - 40, 80, 180);
            ctx.fillRect(495, cityY + 10, 55, 130);
            ctx.fillRect(565, cityY - 20, 70, 160);
            ctx.fillRect(650, cityY + 25, 75, 115);

            // 빌딩 첨탑
            ctx.beginPath();
            ctx.moveTo(435, cityY - 60);
            ctx.lineTo(430, cityY - 40);
            ctx.lineTo(440, cityY - 40);
            ctx.fill();

            // 3. 둥글둥글한 뭉게구름 드리프트
            const drawCloud = (cx, cy, s) => {
                ctx.save();
                ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                ctx.beginPath();
                ctx.arc(cx, cy, 20 * s, 0, Math.PI * 2);
                ctx.arc(cx + 18 * s, cy - 9 * s, 24 * s, 0, Math.PI * 2);
                ctx.arc(cx + 42 * s, cy - 5 * s, 18 * s, 0, Math.PI * 2);
                ctx.arc(cx + 56 * s, cy + 4 * s, 15 * s, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };
            const c1 = (frameCount * 0.35) % (canvas.width + 120) - 60;
            const c2 = ((frameCount * 0.22) + 400) % (canvas.width + 120) - 60;
            drawCloud(c1, 50, 1);
            drawCloud(c2, 85, 0.75);

            // 4. 핀터레스트 스타일 오렌지/살구빛 절벽 바위 (Canyon Cliff)
            ctx.fillStyle = "#f69d4d";
            ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

            // 절벽 바위 세로 무늬 (Pinterest 암벽 커팅)
            ctx.fillStyle = "#e48232";
            for (let rx = 30; rx < canvas.width; rx += 75) {
                const rh = 18 + ((rx * 7) % 18);
                if (ctx.roundRect) ctx.roundRect(rx, groundY + 12, 12, rh, 3.5);
                else ctx.fillRect(rx, groundY + 12, 12, rh);
                ctx.fill();
            }
            ctx.fillStyle = "#fbc27b";
            for (let rx = 70; rx < canvas.width; rx += 75) {
                if (ctx.roundRect) ctx.roundRect(rx, groundY + 15, 8, 14, 2.5);
                else ctx.fillRect(rx, groundY + 15, 8, 14);
                ctx.fill();
            }

            // 5. 민트-터콰이즈 물결 잔디 (Scalloped Grass Rim)
            ctx.fillStyle = "#38d6b7";
            ctx.beginPath();
            ctx.moveTo(0, groundY + 12);
            for (let gx = 0; gx <= canvas.width + 24; gx += 24) {
                ctx.quadraticCurveTo(gx - 12, groundY - 6, gx, groundY + 10);
            }
            ctx.lineTo(canvas.width, groundY + 12);
            ctx.lineTo(0, groundY + 12);
            ctx.closePath();
            ctx.fill();

            // 앙증맞은 풀잎들
            ctx.fillStyle = "#0d9488";
            for (let tx = 45; tx < canvas.width; tx += 90) {
                ctx.beginPath();
                ctx.moveTo(tx, groundY - 1);
                ctx.quadraticCurveTo(tx - 3, groundY - 8, tx - 5, groundY - 10);
                ctx.quadraticCurveTo(tx - 1, groundY - 7, tx + 1, groundY - 1);
                ctx.moveTo(tx + 2, groundY - 1);
                ctx.quadraticCurveTo(tx + 4, groundY - 9, tx + 7, groundY - 11);
                ctx.quadraticCurveTo(tx + 5, groundY - 6, tx + 4, groundY - 1);
                ctx.fill();
            }

            // 6. 핀터레스트 시그니처 [ GOAL ] 나무 팻말!
            const goalX = canvas.width - 85;
            const goalY = groundY - 44;
            // 나무 기둥
            ctx.fillStyle = "#92400e";
            ctx.fillRect(goalX + 16, goalY + 18, 7, 28);
            // 팻말 보드
            ctx.fillStyle = "#fed7aa";
            ctx.strokeStyle = "#78350f";
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(goalX - 10, goalY, 58, 26, 6);
            else ctx.rect(goalX - 10, goalY, 58, 26);
            ctx.fill();
            ctx.stroke();
            // GOAL 글자
            ctx.fillStyle = "#78350f";
            ctx.font = "bold 13px Jua, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GOAL", goalX + 19, goalY + 13);

            // ==========================================
            // [캐릭터 & 아이템 렌더링]
            // ==========================================

            // 핀터레스트 원형 안경 소년 렌더링
            this.drawGameHero(
                ctx, 
                player.x, 
                player.y, 
                player.isFacingLeft, 
                isMoving, 
                frameCount, 
                player.shieldTime
            );

            // 낙하 아이템 렌더링
            for (let i = items.length - 1; i >= 0; i--) {
                const it = items[i];
                it.y += it.speed;
                const sway = Math.sin(frameCount * 0.06 + it.seed) * 0.08;

                ctx.save();
                ctx.translate(it.x, it.y);
                ctx.rotate(it.rot + sway);

                // 3D 캐주얼 카드 배경 (밝은 크림 화이트 + 산뜻한 컬러 테두리)
                ctx.shadowColor = "rgba(30, 80, 120, 0.18)";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 4;

                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = it.color;
                ctx.lineWidth = 3;

                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 14);
                else ctx.rect(-it.w / 2, -it.h / 2, it.w, it.h);
                ctx.fill();
                ctx.stroke();

                // 상단 라벨 띠
                ctx.shadowColor = "transparent";
                ctx.fillStyle = it.color;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(-it.w / 2 + 5, -it.h / 2 + 5, it.w - 10, 18, 8);
                else ctx.rect(-it.w / 2 + 5, -it.h / 2 + 5, it.w - 10, 18);
                ctx.fill();

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 11px Jua, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(it.text, 0, -it.h / 2 + 14);

                // 중앙 커다란 이모지 아이콘 (34px)
                ctx.font = "34px sans-serif";
                ctx.fillText(it.emoji, 0, 5);

                // 하단 금액 태그
                ctx.font = "bold 12px Jua, sans-serif";
                if (it.type === "expense") {
                    ctx.fillStyle = "#e11d48";
                    ctx.fillText(`-${it.amount}만원`, 0, it.h / 2 - 12);
                } else if (it.type === "lucky") {
                    ctx.fillStyle = "#059669";
                    ctx.fillText(`+${it.amount}만원`, 0, it.h / 2 - 12);
                } else {
                    ctx.fillStyle = "#0284c7";
                    ctx.fillText(`무적 3초`, 0, it.h / 2 - 12);
                }

                ctx.restore();

                // 충돌 검사
                const dist = Math.hypot(it.x - player.x, it.y - player.y);
                if (dist < 46) {
                    if (it.type === "shield") {
                        player.shieldTime = 180;
                        window.sounds.playCoin();
                        this.triggerConfetti(15);
                    } else if (it.type === "lucky") {
                        totalLucky += it.amount;
                        window.sounds.playCoin();
                        this.triggerConfetti(20);
                        if (luckyEl) luckyEl.innerText = totalLucky;
                    } else {
                        if (player.shieldTime <= 0) {
                            hits++;
                            totalFine += it.amount;
                            window.sounds.playTaxHit();
                            if (hitsEl) hitsEl.innerText = hits;
                            if (fineEl) fineEl.innerText = totalFine;
                        } else {
                            window.sounds.playDodge();
                        }
                    }
                    items.splice(i, 1);
                    continue;
                }

                if (it.y > canvas.height + 60) {
                    items.splice(i, 1);
                }
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    renderPhase3_Expenses(container) {
        const s = this.state;
        const curHousing = HOUSING_STAGES[s.housingLevel];
        
        let foodCost = 60;
        if (s.lifestyleMode === 'cheap') foodCost = 40;
        else if (s.lifestyleMode === 'flex') foodCost = 80;

        const loanInsurance = 20;
        const rentCost = curHousing.rent;
        const totalExpenses = rentCost + foodCost + loanInsurance + s.taxFine;
        const freeCashCalc = Math.max(0, s.salary - totalExpenses);

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 3 / 8 : 고정 지출 결제</span>
                <h2 class="card-title">월세와 생활비 지출일 💸</h2>
                <p class="card-subtitle">숨만 쉬어도 나가는 필수 고정비가 자동 차감됩니다.</p>
            </div>

            <!-- 소비 모드 선택 -->
            <div class="lifestyle-selector">
                <span style="font-size: 0.9rem; font-weight: 800; color: #94a3b8;">이번 달 나의 식비 & 생활 모드</span>
                <div class="lifestyle-cards" style="margin-top: 8px;">
                    <div class="lifestyle-card ${s.lifestyleMode === 'cheap' ? 'selected' : ''}" data-mode="cheap">
                        <h4>🍙 초절약 모드</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8;">식비 40만원<br><span style="color: #f43f5e; font-weight: 700;">멘탈 -5</span></p>
                    </div>
                    <div class="lifestyle-card ${s.lifestyleMode === 'normal' ? 'selected' : ''}" data-mode="normal">
                        <h4>🍱 표준 모드</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8;">식비 60만원<br><span style="color: #38bdf8; font-weight: 700;">멘탈 유지</span></p>
                    </div>
                    <div class="lifestyle-card ${s.lifestyleMode === 'flex' ? 'selected' : ''}" data-mode="flex">
                        <h4>🥩 힐링 플렉스</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8;">식비 80만원<br><span style="color: #10b981; font-weight: 700;">멘탈 +10</span></p>
                    </div>
                </div>
            </div>

            <!-- 지출 내역서 -->
            <div class="expense-list">
                <div class="expense-item">
                    <span>🏠 주거비 (${curHousing.name})</span>
                    <strong class="expense-val">-${rentCost}만원</strong>
                </div>
                <div class="expense-item">
                    <span>🍱 식비·교통·통신비</span>
                    <strong class="expense-val">-${foodCost}만원</strong>
                </div>
                <div class="expense-item">
                    <span>📑 대출이자·기본 보험료</span>
                    <strong class="expense-val">-${loanInsurance}만원</strong>
                </div>
                ${s.luckyBonus > 0 ? `
                <div class="expense-item" style="color: #10b981;">
                    <span>✨ 복권·배당금·보너스 득템 수익</span>
                    <strong style="color: #10b981; font-weight: 800;">+${s.luckyBonus}만원 (통장 즉시 입금)</strong>
                </div>` : ''}
                ${s.taxFine > 0 ? `
                <div class="expense-item" style="color: #f43f5e;">
                    <span>⚠️ 미회피 축의금·세금 딱지 지출</span>
                    <strong class="expense-val">-${s.taxFine}만원</strong>
                </div>` : ''}
                <div class="expense-item" style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px; margin-top: 4px;">
                    <span style="font-weight: 800; color: #ffffff;">총 고정 지출 합계</span>
                    <strong style="color: #f43f5e; font-size: 1.2rem;">-${totalExpenses}만원</strong>
                </div>
                <div class="expense-item" style="background: rgba(56, 189, 248, 0.12); padding: 12px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    <span style="font-weight: 800; color: #38bdf8;">✨ 남은 자유 운용 자금 (Free Cash)</span>
                    <strong style="color: #00f2fe; font-size: 1.3rem;">+${freeCashCalc}만원</strong>
                </div>
            </div>

            <button id="btnPayExpenses" class="game-btn btn-primary-large" style="width: 100%;">
                💳 고정지출 납부하고 커리어 선택하기 👉
            </button>
        `;

        container.querySelectorAll('.lifestyle-card').forEach(card => {
            card.onclick = () => {
                s.lifestyleMode = card.getAttribute('data-mode');
                window.sounds.playClick();
                this.renderPhase3_Expenses(container);
            };
        });

        document.getElementById('btnPayExpenses').onclick = () => {
            window.sounds.playClick();
            s.cash -= totalExpenses;
            if (s.cash < 0) {
                if (s.savings >= Math.abs(s.cash)) {
                    s.savings += s.cash;
                    s.cash = 0;
                }
            }

            if (s.lifestyleMode === 'cheap') s.mental = this.clamp(s.mental - 5, 0, 100);
            if (s.lifestyleMode === 'flex') s.mental = this.clamp(s.mental + 10, 0, 100);

            s.freeCash = freeCashCalc;
            this.goToPhase(4);
        };
    }

    // ------------------------------------------
    // [4단계] 커리어 선택 - 나의 한 달 업무 태도
    // ------------------------------------------
    renderPhase4_Career(container) {
        const s = this.state;
        if (!s.workChoice) s.workChoice = 'normal';

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 4 / 8 : 커리어 선택</span>
                <h2 class="card-title">이번 달 나의 업무 에너지를 선택하세요 💼</h2>
                <p class="card-subtitle">승진을 위해 몸을 불태울지, 건강과 멘탈을 지킬지 선택의 기로입니다.</p>
            </div>

            <div class="career-options">
                <div class="career-card ${s.workChoice === 'overwork' ? 'selected' : ''}" data-choice="overwork">
                    <div class="career-icon">🌙</div>
                    <div class="career-details">
                        <span class="career-name">매일 불타는 야근</span>
                        <span class="career-desc">"남들보다 2배 일해서 초고속 승진과 연봉 인상을 쟁취한다!"</span>
                        <div class="career-effects">
                            <span class="effect-tag pos">성과점수 +22</span>
                            <span class="effect-tag neg">멘탈 -20</span>
                            <span class="effect-tag neg">투자집중력 하락</span>
                        </div>
                    </div>
                </div>

                <div class="career-card ${s.workChoice === 'normal' ? 'selected' : ''}" data-choice="normal">
                    <div class="career-icon">💼</div>
                    <div class="career-details">
                        <span class="career-name">묵묵한 보통 근무</span>
                        <span class="career-desc">"무리하지 않고 주어진 일에 집중하며 평균 페이스를 유지한다."</span>
                        <div class="career-effects">
                            <span class="effect-tag pos">성과점수 +10</span>
                            <span class="effect-tag neg">멘탈 -5</span>
                            <span class="effect-tag" style="color: #94a3b8;">투자집중력 보통</span>
                        </div>
                    </div>
                </div>

                <div class="career-card ${s.workChoice === 'clockout' ? 'selected' : ''}" data-choice="clockout">
                    <div class="career-icon">🏃</div>
                    <div class="career-details">
                        <span class="career-name">뒤도 안 돌아보고 칼퇴</span>
                        <span class="career-desc">"내 몸과 마음이 1순위! 퇴근 후 멘탈 회복과 동료 친목을 다진다."</span>
                        <div class="career-effects">
                            <span class="effect-tag pos">멘탈 +18 회복</span>
                            <span class="effect-tag pos">동료평판 +6</span>
                            <span class="effect-tag neg">성과점수 +3 (승진 지연)</span>
                        </div>
                    </div>
                </div>
            </div>

            <button id="btnConfirmCareer" class="game-btn btn-primary-large" style="width: 100%; margin-top: 8px;">
                선택 완료하고 자금 배분하기 👉
            </button>
        `;

        container.querySelectorAll('.career-card').forEach(card => {
            card.onclick = () => {
                container.querySelectorAll('.career-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                s.workChoice = card.getAttribute('data-choice');
                window.sounds.playClick();
            };
        });

        document.getElementById('btnConfirmCareer').onclick = () => {
            window.sounds.playClick();

            if (s.workChoice === 'overwork') {
                s.performance = this.clamp(s.performance + 22, 0, 100);
                s.mental = this.clamp(s.mental - 20, 0, 100);
                s.stats.totalOvertime++;
            } else if (s.workChoice === 'normal') {
                s.performance = this.clamp(s.performance + 10, 0, 100);
                s.mental = this.clamp(s.mental - 5, 0, 100);
            } else if (s.workChoice === 'clockout') {
                s.performance = this.clamp(s.performance + 3, 0, 100);
                s.mental = this.clamp(s.mental + 18, 0, 100);
                s.reputation = this.clamp(s.reputation + 6, 0, 100);
                s.stats.totalClockout++;
            }

            if (s.mental <= 25) {
                window.sounds.playHeartbeat();
            }

            this.goToPhase(5);
        };
    }

    // ------------------------------------------
    // [5단계] 자금 배분 - 저축 vs 투자 vs 소비
    // ------------------------------------------
    renderPhase5_Allocation(container) {
        const s = this.state;
        const totalFree = s.freeCash;

        if (s.allocatedSavings + s.allocatedStockSeed + s.allocatedConsume !== totalFree) {
            s.allocatedSavings = Math.round(totalFree * 0.4);
            s.allocatedStockSeed = Math.round(totalFree * 0.4);
            s.allocatedConsume = totalFree - s.allocatedSavings - s.allocatedStockSeed;
        }

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 5 / 8 : 자금 배분</span>
                <h2 class="card-title">남은 자유 자금 배분하기 💰</h2>
                <p class="card-subtitle">
                    이번 달 남은 <b>${totalFree}만원</b>을 어디에 쓸지 슬라이더로 조절하세요.
                </p>
            </div>

            <div class="allocation-controls">
                <div class="alloc-row">
                    <div class="alloc-header">
                        <span>🏦 확정 정기 적금 (연 4.0% 복리)</span>
                        <span id="savingsAllocVal" class="alloc-amount">${s.allocatedSavings}만원</span>
                    </div>
                    <input type="range" id="savingsSlider" class="alloc-slider" min="0" max="${totalFree}" value="${s.allocatedSavings}">
                    <small style="color: #94a3b8;">원금이 100% 보장되며 매달 이자가 복리로 늘어납니다.</small>
                </div>

                <div class="alloc-row">
                    <div class="alloc-header">
                        <span>📈 주식/가상자산 공격 시드머니</span>
                        <span id="stockAllocVal" class="alloc-amount">${s.allocatedStockSeed}만원</span>
                    </div>
                    <input type="range" id="stockSlider" class="alloc-slider" min="0" max="${totalFree}" value="${s.allocatedStockSeed}">
                    <small style="color: #94a3b8;">다음 6단계 실시간 트레이딩 아레나에 실탄으로 투입됩니다.</small>
                </div>

                <div class="alloc-row">
                    <div class="alloc-header">
                        <span>☕ 소비 & 멘탈 케어</span>
                        <span id="consumeAllocVal" class="alloc-amount">${s.allocatedConsume}만원</span>
                    </div>
                    <small style="color: #10b981;">자동 계산 (잔여 자금): 소비 시 멘탈이 소폭 충전됩니다.</small>
                </div>
            </div>

            <button id="btnConfirmAlloc" class="game-btn btn-primary-large" style="width: 100%; margin-top: 10px;">
                🚀 주식 공격 라운드로 출격! 👉
            </button>
        `;

        const savingsSlider = document.getElementById('savingsSlider');
        const stockSlider = document.getElementById('stockSlider');
        const sVal = document.getElementById('savingsAllocVal');
        const stVal = document.getElementById('stockAllocVal');
        const cVal = document.getElementById('consumeAllocVal');

        const updateSliders = () => {
            let sav = parseInt(savingsSlider.value);
            let stk = parseInt(stockSlider.value);
            if (sav + stk > totalFree) {
                stk = totalFree - sav;
                stockSlider.value = stk;
            }
            const cons = totalFree - sav - stk;

            s.allocatedSavings = sav;
            s.allocatedStockSeed = stk;
            s.allocatedConsume = cons;

            sVal.innerText = `${sav}만원`;
            stVal.innerText = `${stk}만원`;
            cVal.innerText = `${cons}만원`;
        };

        savingsSlider.oninput = updateSliders;
        stockSlider.oninput = updateSliders;

        document.getElementById('btnConfirmAlloc').onclick = () => {
            window.sounds.playCoin();
            s.savings += s.allocatedSavings;
            if (s.allocatedConsume > 0) {
                const bonusMental = Math.min(15, Math.floor(s.allocatedConsume / 10));
                s.mental = this.clamp(s.mental + bonusMental, 0, 100);
            }
            this.goToPhase(6);
        };
    }

    // ------------------------------------------
    // [6단계] 공격 라운드 - 오르는 주식에 올라타기 (Cyber Trading)
    // ------------------------------------------
    renderPhase6_StockMomentum(container) {
        const s = this.state;
        const seedMoney = s.allocatedStockSeed;

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 6 / 8 : 공격 라운드 (30초 실시간 차트)</span>
                <h2 class="card-title">오르는 주식에 올라타라! 📈</h2>
                <p class="card-subtitle">
                    투자 시드: <b>${seedMoney}만원</b> | 30초 동안 가격이 빠르게 <b>플러스(+)와 마이너스(-)</b>를 오갑니다! 저점에서 [매수] ➔ 고점에서 [매도]로 수익을 확정하세요!
                </p>
            </div>

            <div class="stock-selector">
                <button class="stock-btn active" data-stock="bluechip">
                    🏢 삼전전자 (대형주)<br><small style="color: #64748b; font-family: 'Pretendard', sans-serif;">안정형 복불복 (-30% ~ +60%)</small>
                </button>
                <button class="stock-btn" data-stock="theme">
                    ⚡ 초전도AI (테마주)<br><small style="color: #64748b; font-family: 'Pretendard', sans-serif;">광기의 작전주 (-65% ~ +150%)</small>
                </button>
                <button class="stock-btn" data-stock="coin">
                    🚀 도지멍멍 (코인)<br><small style="color: #64748b; font-family: 'Pretendard', sans-serif;">인생역전 롤러코스터 (-85% ~ +280%)</small>
                </button>
            </div>

            <div class="canvas-wrapper stock-chart-wrapper">
                <canvas id="stockCanvas" width="800" height="320"></canvas>
                <div class="canvas-overlay-ui">
                    <span id="stockTimerBadge" class="stock-timer-badge">
                        ⏱️ 장 마감: <b id="stockTimer">30</b>초
                    </span>
                    <span id="stockRateBadge" class="current-price-badge pos">
                        +0.0%
                    </span>
                </div>
            </div>

            <div class="stock-actions">
                <button id="btnStockBuy" class="game-btn btn-success-modern">
                    🔥 지금 매수 (진입 탑승)!
                </button>
                <button id="btnStockSell" class="game-btn btn-danger-modern" disabled>
                    💰 지금 매도 (익절/손절 청산)!
                </button>
            </div>

            <div id="stockNoticeText" style="font-size: 0.9rem; color: #94a3b8; text-align: center;">
                ${s.workChoice === 'overwork' ? '⚠️ 야근 피로로 차트에 안개(노이즈)가 낍니다!' : '플러스와 마이너스를 빠르게 오갈 때 고점을 노려 매도하세요!'}
            </div>
        `;

        this.initStockMiniGame(seedMoney, s.workChoice === 'overwork');
    }

    initStockMiniGame(seedMoney, isOverworked) {
        const canvas = document.getElementById("stockCanvas");
        const ctx = canvas.getContext("2d");
        const timerEl = document.getElementById("stockTimer");
        const rateEl = document.getElementById("stockRateBadge");
        const buyBtn = document.getElementById("btnStockBuy");
        const sellBtn = document.getElementById("btnStockSell");
        const noticeTextEl = document.getElementById("stockNoticeText");
        const card = document.getElementById("actionCard");

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width || 800;
        canvas.height = rect.height || 320;

        let selectedStock = "bluechip";
        const stockConfigs = {
            bluechip: {
                name: "삼전전자",
                volatility: 5.5,
                jitter: 6.5,
                shockChance: 0.12,
                maxGain: 65,
                maxLoss: -32,
                pumpPower: 28,
                dumpPower: 20
            },
            theme: {
                name: "초전도AI",
                volatility: 12.0,
                jitter: 18.0,
                shockChance: 0.20,
                maxGain: 160,
                maxLoss: -68,
                pumpPower: 70,
                dumpPower: 55
            },
            coin: {
                name: "도지멍멍",
                volatility: 22.0,
                jitter: 32.0,
                shockChance: 0.32,
                maxGain: 290,
                maxLoss: -88,
                pumpPower: 135,
                dumpPower: 90
            }
        };

        let priceHistory = [100];
        let currentRate = 0;
        let velocity = 0;
        let trendMomentum = (Math.random() - 0.48) * 6;
        let shockCooldown = 0;

        let hasBought = false;
        let buyRate = 0;
        let hasSold = false;
        let finalProfit = 0;
        let timeLeft = 30; // 30초
        let isRunning = true;

        document.querySelectorAll(".stock-btn").forEach(btn => {
            btn.onclick = () => {
                if (hasBought) return;
                document.querySelectorAll(".stock-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedStock = btn.getAttribute("data-stock");
                window.sounds.playClick();
                // 종목 교체 시 모멘텀 리셋
                currentRate = 0;
                velocity = (Math.random() - 0.5) * stockConfigs[selectedStock].volatility;
                trendMomentum = (Math.random() - 0.48) * 8;
                priceHistory = [100];
            };
        });

        const timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;
            if (timeLeft <= 0) {
                if (hasBought && !hasSold) {
                    executeSell(true);
                } else {
                    finishGame();
                }
            }
        }, 1000);

        buyBtn.onclick = () => {
            if (hasBought) return;
            hasBought = true;
            buyRate = currentRate;
            window.sounds.playStockBuy();
            buyBtn.disabled = true;
            buyBtn.innerText = `매수가: ${buyRate >= 0 ? "+" : ""}${buyRate.toFixed(1)}%`;
            sellBtn.disabled = false;
        };

        const executeSell = (isForced = false) => {
            if (hasSold) return;
            hasSold = true;
            clearInterval(timerInterval);

            const gainRate = currentRate - buyRate;
            finalProfit = Math.round(seedMoney * (gainRate / 100));

            if (finalProfit >= 0) {
                window.sounds.playStockProfit();
                this.triggerConfetti(40);
            } else {
                window.sounds.playStockLoss();
            }

            sellBtn.disabled = true;
            sellBtn.innerText = isForced ? "장 마감 강제 청산" : "매도 완료";
            finishGame();
        };

        sellBtn.onclick = () => executeSell(false);

        const finishGame = () => {
            isRunning = false;
            clearInterval(timerInterval);

            if (seedMoney === 0) finalProfit = 0;

            this.state.stockProfit = finalProfit;
            if (finalProfit >= 0) {
                this.state.stats.totalStockProfit += finalProfit;
            } else {
                this.state.stats.totalStockLoss += Math.abs(finalProfit);
            }

            this.state.stocks += (seedMoney + finalProfit);

            const resultBox = document.createElement("div");
            resultBox.style.marginTop = "16px";
            resultBox.style.padding = "20px";
            resultBox.style.borderRadius = "20px";
            resultBox.style.background = finalProfit >= 0 ? "#f0fdf4" : "#fff1f2";
            resultBox.style.border = `3px solid ${finalProfit >= 0 ? "#86efac" : "#fecdd3"}`;
            resultBox.style.textAlign = "center";
            resultBox.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";

            resultBox.innerHTML = `
                <h3 style="font-family: Jua, sans-serif; font-size: 1.45rem; color: ${finalProfit >= 0 ? "#166534" : "#991b1b"}; margin-bottom: 6px;">
                    ${!hasBought ? "투자를 관망했습니다 (변동 없음)" : (finalProfit >= 0 ? `🎉 복불복 익절 대성공! 수익금 +${finalProfit}만원` : `📉 눈물의 손절! 손실금 ${finalProfit}만원`)}
                </h3>
                <p style="font-size: 1.05rem; color: #475569; margin: 6px 0 16px 0;">
                    ${!hasBought ? "원금을 안전하게 보전했습니다." : `투자 원금 ${seedMoney}만원 ➔ 최종 평가액 <b>${seedMoney + finalProfit}만원</b>`}
                </p>
                <button id="btnStockDone" class="game-btn btn-primary-large" style="width: 100%; max-width: 380px;">
                    다음 단계(월말 이벤트)로 넘어가기 👉
                </button>
            `;
            card.appendChild(resultBox);

            document.getElementById("btnStockDone").onclick = () => {
                window.sounds.playClick();
                this.goToPhase(7);
            };
        };

        let frame = 0;
        const chartLoop = () => {
            if (!isRunning) return;
            frame++;

            // 매 3프레임(약 50ms)마다 실제 주식/코인처럼 불규칙 랜덤워크 + 복불복 빔 갱신!
            if (frame % 3 === 0) {
                const cfg = stockConfigs[selectedStock];
                shockCooldown++;

                // 1. 추세 모멘텀의 부드러운 방황 (Trend Drift)
                trendMomentum += (Math.random() - 0.5) * 2.2;
                trendMomentum = Math.max(-10, Math.min(10, trendMomentum));

                // 2. 물리 관성 속도 갱신 (관성 + 추세)
                velocity += (Math.random() - 0.49) * cfg.volatility + (trendMomentum * 0.35);
                velocity *= 0.83; // 감쇠 마찰력

                // 3. [진짜 복불복 Shock Jump!] 떡상 빔 vs 벼락 덤핑 폭락!
                if (shockCooldown > 14 && Math.random() < cfg.shockChance) {
                    shockCooldown = 0;
                    const isPump = Math.random() < 0.52; // 52% 확률로 떡상 빔
                    const shockPower = isPump 
                        ? (cfg.pumpPower * (0.65 + Math.random() * 0.95))
                        : (-cfg.dumpPower * (0.65 + Math.random() * 0.95));

                    velocity += shockPower;

                    if (noticeTextEl) {
                        if (isPump) {
                            noticeTextEl.innerHTML = `<span style="color: #dc2626; font-weight: bold; font-size: 1.05rem; animation: pulseWarn 0.8s infinite;">🚀 [${cfg.name}] 세력 폭풍 매수세 유입! 떡상 빔 발사!! (+${Math.round(shockPower)}%)</span>`;
                        } else {
                            noticeTextEl.innerHTML = `<span style="color: #2563eb; font-weight: bold; font-size: 1.05rem; animation: pulseWarn 0.8s infinite;">📉 [${cfg.name}] 고래 대규모 투매 발생! 벼락 덤핑 폭락!! (${Math.round(shockPower)}%)</span>`;
                        }
                    }
                }

                // 4. 노이즈 및 야근 피로 효과
                const jitter = (Math.random() - 0.5) * cfg.jitter;
                let overworkNoise = isOverworked ? (Math.random() - 0.5) * 24 : 0;

                // 5. 실시간 수익률 누적
                currentRate += velocity + jitter + overworkNoise;

                // 극단값 도달 시 튕겨 나오는 탄성 반작용 (Elastic Bounce)
                if (currentRate > cfg.maxGain) {
                    currentRate = cfg.maxGain;
                    velocity = -Math.abs(velocity) * 0.7;
                    trendMomentum = -Math.abs(trendMomentum);
                } else if (currentRate < cfg.maxLoss) {
                    currentRate = cfg.maxLoss;
                    velocity = Math.abs(velocity) * 0.7;
                    trendMomentum = Math.abs(trendMomentum);
                }

                const nextVal = 100 + currentRate;
                priceHistory.push(nextVal);
                if (priceHistory.length > 70) priceHistory.shift();

                const isPos = currentRate >= 0;
                rateEl.innerText = `${isPos ? "+" : ""}${currentRate.toFixed(1)}%`;
                rateEl.className = `current-price-badge ${isPos ? "pos" : "neg"}`;

                if (hasBought && !hasSold) {
                    const diff = currentRate - buyRate;
                    const liveProfit = Math.round(seedMoney * (diff / 100));
                    buyBtn.innerText = `매수가: ${buyRate >= 0 ? "+" : ""}${buyRate.toFixed(1)}% | 손익: ${diff >= 0 ? "+" : ""}${diff.toFixed(1)}% (${liveProfit >= 0 ? "+" : ""}${liveProfit}만)`;
                    buyBtn.style.color = diff >= 0 ? "#dc2626" : "#2563eb";
                    buyBtn.style.borderColor = diff >= 0 ? "#ef4444" : "#3b82f6";
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 파스텔 모던 차트 배경
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "#f1f5f9";
            ctx.lineWidth = 1;
            for (let y = 30; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // 야근 안개 효과
            if (isOverworked) {
                ctx.fillStyle = "rgba(100, 116, 139, 0.08)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            const cfg = stockConfigs[selectedStock];
            const maxAbs = Math.max(Math.abs(cfg.maxGain), Math.abs(cfg.maxLoss));
            const scaleY = (canvas.height * 0.40) / maxAbs;
            const midY = canvas.height / 2;

            // 기준선 0% 본전 라인
            ctx.strokeStyle = "#94a3b8";
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(0, midY);
            ctx.lineTo(canvas.width, midY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#64748b";
            ctx.font = "bold 11px Jua, sans-serif";
            ctx.fillText("0% 본전", 14, midY - 6);

            // 매수가 고정 가이드 라인
            if (hasBought) {
                const buyY = midY - (buyRate * scaleY);
                ctx.strokeStyle = "#f59e0b";
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 6]);
                ctx.beginPath();
                ctx.moveTo(0, buyY);
                ctx.lineTo(canvas.width, buyY);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = "#b45309";
                ctx.font = "bold 12px Jua, sans-serif";
                ctx.fillText(`📍 내 매수가: ${buyRate >= 0 ? "+" : ""}${buyRate.toFixed(1)}%`, 14, Math.max(16, buyY - 8));
            }

            // 레이저 차트 라인 그리기
            if (priceHistory.length > 1) {
                const stepX = canvas.width / (priceHistory.length - 1);
                const isPos = currentRate >= 0;
                // 한국 주식/코인: 빨강=상승/불기둥, 파랑=하락/파란나라
                const lineColor = isPos ? "#dc2626" : "#2563eb";

                ctx.save();
                ctx.shadowColor = lineColor;
                ctx.shadowBlur = 12;
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 3.5;

                ctx.beginPath();
                priceHistory.forEach((p, idx) => {
                    const x = idx * stepX;
                    const diffRate = p - 100;
                    const y = midY - (diffRate * scaleY);
                    if (idx === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();

                // 차트 그라디언트 음영 채우기
                const lastX = canvas.width;
                ctx.lineTo(lastX, isPos ? canvas.height : 0);
                ctx.lineTo(0, isPos ? canvas.height : 0);
                ctx.closePath();
                const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                if (isPos) {
                    grad.addColorStop(0, "rgba(220, 38, 38, 0.22)");
                    grad.addColorStop(1, "rgba(220, 38, 38, 0.02)");
                } else {
                    grad.addColorStop(0, "rgba(37, 99, 235, 0.02)");
                    grad.addColorStop(1, "rgba(37, 99, 235, 0.22)");
                }
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
            }

            requestAnimationFrame(chartLoop);
        };

        requestAnimationFrame(chartLoop);
    }

    renderPhase7_MonthlyEvent(container) {
        const s = this.state;
        const isQuarterEnd = (s.month % 3 === 0);

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 7 / 8 : 월말 이벤트</span>
                <h2 class="card-title">${isQuarterEnd ? '🏢 분기 결산 & 인사 평가 시즌!' : '💌 이번 달의 인생 이벤트'}</h2>
                <p class="card-subtitle">
                    ${isQuarterEnd ? '분기(3·6·9·12월)에는 성과에 따른 연봉 협상과 승진 심사가 진행됩니다.' : '예상치 못한 기쁨과 지출이 인생을 다채롭게 만듭니다.'}
                </p>
            </div>
            <div id="eventCardBody" class="event-card-body"></div>
        `;

        const body = document.getElementById('eventCardBody');

        if (isQuarterEnd) {
            this.handleQuarterlyEvent(body);
        } else {
            this.handleNormalLifeEvent(body);
        }
    }

    handleNormalLifeEvent(container) {
        const ev = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];
        const s = this.state;

        container.innerHTML = `
            <div class="event-icon-large">${ev.icon}</div>
            <h3 class="event-headline">${ev.text}</h3>
            <div class="event-story" style="display: flex; justify-content: center; gap: 16px; font-weight: 800; font-size: 1.05rem;">
                ${ev.cash !== 0 ? `<span style="color: ${ev.cash > 0 ? '#10b981' : '#f43f5e'};">통장 잔고: ${ev.cash > 0 ? '+' : ''}${ev.cash}만원</span>` : ''}
                ${ev.mental !== 0 ? `<span style="color: ${ev.mental > 0 ? '#a855f7' : '#f43f5e'};">멘탈: ${ev.mental > 0 ? '+' : ''}${ev.mental}</span>` : ''}
                ${ev.rep !== 0 ? `<span style="color: #38bdf8;">동료 평판: +${ev.rep}</span>` : ''}
            </div>
            <button id="btnEventConfirm" class="game-btn btn-primary-large" style="width: 100%; margin-top: 14px;">
                확인하고 최종 정산으로 👉
            </button>
        `;

        document.getElementById('btnEventConfirm').onclick = () => {
            window.sounds.playClick();
            s.cash += ev.cash;
            s.mental = this.clamp(s.mental + ev.mental, 0, 100);
            s.reputation = this.clamp(s.reputation + ev.rep, 0, 100);
            this.goToPhase(8);
        };
    }

    handleQuarterlyEvent(container) {
        const s = this.state;
        const curRank = JOB_RANKS[s.rankIndex];

        if (s.performance >= 60) {
            container.innerHTML = `
                <div class="dialogue-box">
                    <strong style="color: #38bdf8; font-size: 1.05rem;">👔 김부장 (인사 평가권자)</strong><br>
                    "이 대리(사원), 이번 분기 자네 업무 성과 점수가 <b>${Math.round(s.performance)}점</b>으로 꽤 우수하더군. 
                    연봉 협상 테이블을 열어줄 테니, 자네의 기여도에 대해 어디 한번 말해보게나."
                </div>

                <div class="dialogue-choices">
                    <button class="choice-btn" data-choice="confident">
                        🔥 <b>[자신감 어필]</b> "제가 주도한 핵심 프로젝트 성과로 회사 매출이 올랐습니다! 20만원 인상을 요구합니다."
                    </button>
                    <button class="choice-btn" data-choice="data">
                        📊 <b>[논리적 근거 제시]</b> "분기 KPI 달성률 130%와 비용 절감 데이터를 준비했습니다. 객관적 수치로 증명합니다."
                    </button>
                    <button class="choice-btn" data-choice="humble">
                        🙏 <b>[눈치 보기 & 공손함]</b> "부장님의 지도 덕분입니다. 회사 사정에 맞춰 주시면 감사히 따르겠습니다."
                    </button>
                </div>
            `;

            container.querySelectorAll('.choice-btn').forEach(btn => {
                btn.onclick = () => {
                    const ch = btn.getAttribute('data-choice');
                    window.sounds.playClick();
                    this.resolveSalaryNegotiation(container, ch);
                };
            });
        } else if (s.performance >= 40) {
            container.innerHTML = `
                <div class="event-icon-large">📋</div>
                <h3 class="event-headline">분기 무난한 성과 평가 완료</h3>
                <p class="event-story">
                    성과 점수 ${Math.round(s.performance)}점. 큰 실수 없이 무난하게 분기를 마감했습니다. 
                    소폭의 격려 보너스(+10만원)가 지급됩니다.
                </p>
                <button id="btnQuarterDone" class="game-btn btn-primary-large" style="width: 100%; margin-top: 14px;">
                    보너스 수령하고 최종 정산으로 👉
                </button>
            `;
            document.getElementById('btnQuarterDone').onclick = () => {
                window.sounds.playSalary();
                this.triggerConfetti(20);
                s.cash += 10;
                this.goToPhase(8);
            };
        } else {
            container.innerHTML = `
                <div class="event-icon-large">⚠️</div>
                <h3 class="event-headline">인사 평가 경고장</h3>
                <p class="event-story">
                    이번 분기 성과 점수가 ${Math.round(s.performance)}점에 불과합니다. 
                    부장님의 잔소리와 함께 멘탈이 깎입니다 (-15).
                </p>
                <button id="btnQuarterDone" class="game-btn btn-secondary-modern" style="width: 100%; margin-top: 14px;">
                    다음 분기를 기약하며 정산하기 👉
                </button>
            `;
            document.getElementById('btnQuarterDone').onclick = () => {
                window.sounds.playClick();
                s.mental = this.clamp(s.mental - 15, 0, 100);
                this.goToPhase(8);
            };
        }
    }

    resolveSalaryNegotiation(container, choice) {
        const s = this.state;
        let raise = 0;
        let outcomeMsg = "";
        let isSuccess = false;

        if (choice === 'data') {
            raise = 15;
            isSuccess = true;
            outcomeMsg = `"객관적인 지표가 확실하군! 회사도 자네의 공로를 인정해 월급을 <b>+15만원</b> 인상해주겠네."`;
        } else if (choice === 'confident') {
            if (s.performance >= 75) {
                raise = 20;
                isSuccess = true;
                outcomeMsg = `"허허, 패기가 아주 마음에 드는군! 요구대로 파격적으로 <b>+20만원</b> 올려주지!"`;
            } else {
                raise = 10;
                outcomeMsg = `"자신감은 좋으나 기대치보단 약간 부족했네. <b>+10만원</b> 인상으로 타협하세."`;
            }
        } else {
            raise = 5;
            outcomeMsg = `"겸손한 자세가 보기 좋네. 소폭이지만 <b>+5만원</b> 인상안에 서명하세."`;
        }

        s.salary += raise;
        s.stats.salaryNegotiationsWon++;

        const canPromote = (s.performance >= 75 && s.rankIndex < JOB_RANKS.length - 1);

        container.innerHTML = `
            <div class="event-icon-large">${isSuccess ? '🎉' : '🤝'}</div>
            <h3 class="event-headline">연봉 협상 결과: 월급 +${raise}만원 인상 확정!</h3>
            <div class="dialogue-box" style="margin-top: 10px;">
                <strong>👔 김부장의 최종 답변</strong><br>
                ${outcomeMsg}
            </div>
            <p style="text-align: center; font-size: 1.1rem; margin-top: 12px; color: #10b981; font-weight: 800;">
                현재 월급: 월 ${s.salary}만원
            </p>

            ${canPromote ? `
            <div style="background: rgba(56, 189, 248, 0.15); border: 2px solid #38bdf8; border-radius: 14px; padding: 16px; margin-top: 14px; text-align: center;">
                <h4 style="color: #38bdf8; font-size: 1.15rem;">🎖️ 특별 승진 심사 대상자 선정!</h4>
                <p style="font-size: 0.9rem; color: #94a3b8; margin: 6px 0 12px 0;">
                    뛰어난 성과로 [${JOB_RANKS[s.rankIndex + 1].title}] 승진 심사위원회에 추천되었습니다!
                </p>
                <button id="btnRollPromotion" class="game-btn btn-success-modern" style="width: 100%;">
                    🎲 승진 심사 주사위 굴리기!
                </button>
            </div>
            ` : `
            <button id="btnFinishNegotiation" class="game-btn btn-primary-large" style="margin-top: 14px; width: 100%;">
                협상 완료하고 최종 정산으로 👉
            </button>
            `}
        `;

        if (canPromote) {
            document.getElementById('btnRollPromotion').onclick = () => {
                this.executePromotionTest(container);
            };
        } else {
            document.getElementById('btnFinishNegotiation').onclick = () => {
                window.sounds.playCoin();
                this.goToPhase(8);
            };
        }
    }

    executePromotionTest(container) {
        const s = this.state;
        const nextRank = JOB_RANKS[s.rankIndex + 1];

        const chance = 0.6 + (s.reputation - 50) * 0.005;
        const success = Math.random() < chance;

        if (success) {
            s.rankIndex++;
            s.salary = Math.max(s.salary, nextRank.baseSalary);
            s.stats.promotionsCount++;
            window.sounds.playPromotion();
            this.triggerConfetti(60);

            container.innerHTML = `
                <div class="event-icon-large">🎊</div>
                <h3 class="event-headline" style="color: #00f2fe;">
                    [축하합니다!] ${nextRank.title} (${nextRank.stars}) 승진 확정!
                </h3>
                <p class="event-story">
                    동료들의 뜨거운 박수와 함께 승진 발령이 났습니다! <br>
                    명함이 바뀌고 기본급이 <b>월 ${s.salary}만원</b>으로 대폭 상향되었습니다.
                </p>
                <button id="btnPromoNext" class="game-btn btn-primary-large" style="margin-top: 14px; width: 100%;">
                    축하 받으며 최종 정산으로 👉
                </button>
            `;
            document.getElementById('btnPromoNext').onclick = () => {
                this.goToPhase(8);
            };
        } else {
            container.innerHTML = `
                <div class="event-icon-large">😢</div>
                <h3 class="event-headline">아쉬운 승진 보류</h3>
                <p class="event-story">
                    인사위원회의 TO 부족으로 이번 분기 승진은 아쉽게 보류되었습니다. <br>
                    하지만 다음 분기에는 더욱 유리한 위치를 점하게 됩니다.
                </p>
                <button id="btnPromoNext" class="game-btn btn-secondary-modern" style="margin-top: 14px; width: 100%;">
                    최종 정산으로 넘어가기 👉
                </button>
            `;
            document.getElementById('btnPromoNext').onclick = () => {
                this.goToPhase(8);
            };
        }
    }

    // ------------------------------------------
    // [8단계] 정산 및 주거 목표 게이지 갱신
    // ------------------------------------------
    renderPhase8_Settlement(container) {
        const s = this.state;
        const total = this.getTotalAssets();

        container.innerHTML = `
            <div class="card-title-group">
                <span class="card-step-badge">Phase 8 / 8 : 월말 정산 리포트</span>
                <h2 class="card-title">한 달 결산 및 집 목표 갱신 📊</h2>
                <p class="card-subtitle">이번 달의 재무 성과와 내 집 마련 목표 진행도입니다.</p>
            </div>

            <div class="settlement-table">
                <div class="settle-row">
                    <span>월급 실수령 입금액</span>
                    <strong style="color: #10b981;">+${s.salary}만원</strong>
                </div>
                ${s.luckyBonus > 0 ? `
                <div class="settle-row">
                    <span>인생 라운드 득템 (복권·배당·보너스)</span>
                    <strong style="color: #10b981;">+${s.luckyBonus}만원</strong>
                </div>` : ''}
                ${s.taxFine > 0 ? `
                <div class="settle-row">
                    <span>방어 실패 축의금·세금 지출</span>
                    <strong style="color: #f43f5e;">-${s.taxFine}만원</strong>
                </div>` : ''}
                <div class="settle-row">
                    <span>투자 순손익 (공격 라운드)</span>
                    <strong style="color: ${s.stockProfit >= 0 ? '#10b981' : '#f43f5e'};">
                        ${s.stockProfit >= 0 ? '+' : ''}${s.stockProfit}만원
                    </strong>
                </div>
                <div class="settle-row highlight">
                    <span>현재 총 순자산</span>
                    <span>${this.formatMoney(total)}</span>
                </div>
            </div>

            <div id="housingUpgradeSlot"></div>

            <button id="btnNextMonth" class="game-btn btn-primary-large" style="width: 100%; margin-top: 12px;">
                🗓️ 다음 달(1턴) 시작하기 👉
            </button>
        `;

        if (total >= 30000) {
            this.triggerEndingSequence();
            return;
        }

        if (s.mental <= 0) {
            this.triggerBurnoutGameOver();
            return;
        }

        const upgradeSlot = document.getElementById('housingUpgradeSlot');
        if (s.housingLevel === 0 && total >= 3000) {
            upgradeSlot.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 14px; padding: 18px; margin-top: 14px; text-align: center;">
                    <h3 style="color: #10b981; font-size: 1.2rem; font-weight: 900;">🎉 [1단계 달성] 월세 보증금 3,000만원 돌파!</h3>
                    <p style="font-size: 0.92rem; color: #94a3b8; margin: 6px 0 12px 0;">
                        낡은 원룸을 탈출하여 쾌적한 <b>역세권 오피스텔</b>로 이사할 수 있습니다!<br>
                        (이사 시 월세가 70만원 ➔ <b>50만원</b>으로 대폭 절감됩니다!)
                    </p>
                    <button id="btnUpgradeHousing1" class="game-btn btn-success-modern" style="width: 100%;">
                        🏢 역세권 오피스텔로 즉시 이사하기!
                    </button>
                </div>
            `;
            document.getElementById('btnUpgradeHousing1').onclick = () => {
                s.housingLevel = 1;
                window.sounds.playPromotion();
                this.triggerConfetti(50);
                this.renderAll();
            };
        } else if (s.housingLevel === 1 && total >= 15000) {
            upgradeSlot.innerHTML = `
                <div style="background: rgba(56, 189, 248, 0.15); border: 2px solid #38bdf8; border-radius: 14px; padding: 18px; margin-top: 14px; text-align: center;">
                    <h3 style="color: #00f2fe; font-size: 1.2rem; font-weight: 900;">🎊 [2단계 달성] 전세 자금 1억 5천만원 돌파!</h3>
                    <p style="font-size: 0.92rem; color: #94a3b8; margin: 6px 0 12px 0;">
                        꿈에 그리던 <b>24평 아파트 전세 입주</b>가 가능합니다!<br>
                        (전세 입주 시 매달 나가는 <b>월세가 0원</b>이 되어 자산 모으는 속도가 급상승합니다!)
                    </p>
                    <button id="btnUpgradeHousing2" class="game-btn btn-success-modern" style="width: 100%;">
                        🏙️ 24평 전세 아파트로 입주하기!
                    </button>
                </div>
            `;
            document.getElementById('btnUpgradeHousing2').onclick = () => {
                s.housingLevel = 2;
                window.sounds.playVictory();
                this.triggerConfetti(70);
                this.renderAll();
            };
        }

        document.getElementById('btnNextMonth').onclick = () => {
            window.sounds.playClick();
            this.startNextMonth();
        };
    }

    startNextMonth() {
        this.state.month++;
        this.state.currentPhase = 1;
        this.state.taxFine = 0;
        this.state.luckyBonus = 0;
        this.state.stockProfit = 0;

        if (this.state.month % 3 === 1) {
            this.state.performance = Math.round(this.state.performance * 0.4);
        }

        this.renderAll();
    }

    nextPhase() {
        if (this.state.currentPhase < 8) {
            this.goToPhase(this.state.currentPhase + 1);
        } else {
            this.nextMonth();
        }
    }

    goToPhase(phaseNum) {
        this.state.currentPhase = phaseNum;
        this.renderAll();
    }

    // ==========================================
    // 4대 멀티 엔딩 판정
    // ==========================================
    triggerEndingSequence() {
        const s = this.state;
        const modal = document.getElementById('endingModal');
        const badge = document.getElementById('endingBadge');
        const icon = document.getElementById('endingIcon');
        const title = document.getElementById('endingTitle');
        const story = document.getElementById('endingStory');

        const statMonths = document.getElementById('statMonths');
        const statJob = document.getElementById('statJob');
        const statAssets = document.getElementById('statAssets');
        const statMental = document.getElementById('statMental');

        const curRank = JOB_RANKS[s.rankIndex];
        const total = this.getTotalAssets();
        const years = Math.floor((s.month - 1) / 12);
        const remMonths = ((s.month - 1) % 12) + 1;

        statMonths.innerText = `${s.month}개월 (${years > 0 ? `${years}년 ` : ''}${remMonths}개월)`;
        statJob.innerText = `${curRank.title} (월 ${s.salary}만)`;
        statAssets.innerText = this.formatMoney(total);
        statMental.innerText = `${Math.round(s.mental)} / 100`;

        let endingType = "balance";

        if (s.mental <= 30 || (s.stats.totalOvertime / s.month) >= 0.5) {
            endingType = "burnout";
        } else if (s.rankIndex >= 2 && s.stats.totalEarnedSalary > (s.stats.totalStockProfit * 2)) {
            endingType = "career";
        } else if (s.rankIndex <= 1 && s.stats.totalStockProfit >= (total * 0.45)) {
            endingType = "investment";
        } else {
            endingType = "balance";
        }

        if (endingType === 'career') {
            badge.innerText = "🏆 커리어 성공 엔딩";
            icon.innerText = "👔";
            title.innerText = "성실한 직장인 신화! 당당한 내 집 마련";
            story.innerHTML = `
                월급 250만원 사원으로 시작해 치열한 야근과 업무 성과로 <b>${curRank.title}</b>까지 초고속 승진!<br>
                무리한 주식 도박 대신 안정적인 저축과 연봉 상승으로 마침내 서울에 번듯한 내 집 열쇠를 거머쥐었습니다.<br>
                회사에서도 인정받는 핵심 인재로 거듭났으며, 앞으로 임원의 자리도 머지않았습니다!
            `;
            window.sounds.playPromotion();
            this.triggerConfetti(100);
        } else if (endingType === 'investment') {
            badge.innerText = "🚀 슈퍼개미 투자 엔딩";
            icon.innerText = "📈";
            title.innerText = "월급은 거들 뿐! 투자의 귀재 파이어족";
            story.innerHTML = `
                "직장은 대출을 받기 위한 거처였을 뿐..."<br>
                급등 테마주와 롤러코스터 코인 판에서 날카로운 동물적 감각으로 매수와 매도 타이밍을 낚아채며<br>
                월급쟁이 신분을 벗어나 <b>3억원의 자산</b>을 일구었습니다! 오늘부로 부장님 책상에 사직서를 던지고 한강뷰 아파트에 입주합니다!
            `;
            window.sounds.playVictory();
            this.triggerConfetti(100);
        } else if (endingType === 'balance') {
            badge.innerText = "👑 갓생 밸런스 엔딩 (최고 난이도)";
            icon.innerText = "🏰";
            title.innerText = "워라밸과 재테크의 완벽한 조화";
            story.innerHTML = `
                일할 때는 칼퇴를 지키며 건강과 동료 평판을 챙기고, 현명한 분산 투자와 알뜰한 절약으로<br>
                <b>멘탈(${Math.round(s.mental)}점)</b>도 잃지 않고 당당히 3억원 내 집 마련을 달성했습니다!<br>
                모두가 부러워하는 진정한 어른이자 육각형 인생의 완성입니다.
            `;
            window.sounds.playVictory();
            this.triggerConfetti(120);
        } else if (endingType === 'burnout') {
            badge.innerText = "🥀 번아웃 엔딩";
            icon.innerText = "🏥";
            title.innerText = "영혼을 갈아넣어 산 아파트...";
            story.innerHTML = `
                끊임없는 야근과 쏟아지는 세금 딱지, 피 말리는 주식 차트 스트레스 속에 3억원은 모았지만...<br>
                거울 속에는 퀭한 눈과 잃어버린 건강, 소원해진 친구들의 연락처만 남아있습니다.<br>
                새 집 거실 소파에 누워 링거를 맞으며 공허한 천장을 바라봅니다. "행복이란 무엇이었을까?"
            `;
            window.sounds.playGameOver();
        }

        modal.style.display = 'flex';
        document.getElementById('btnRestartGame').onclick = () => {
            modal.style.display = 'none';
            this.resetGame();
        };
    }

    triggerBurnoutGameOver() {
        const modal = document.getElementById('endingModal');
        const badge = document.getElementById('endingBadge');
        const icon = document.getElementById('endingIcon');
        const title = document.getElementById('endingTitle');
        const story = document.getElementById('endingStory');

        badge.innerText = "⚠️ 멘탈 고갈 (게임 오버)";
        icon.innerText = "🚑";
        title.innerText = "과로와 스트레스로 병원 응급실행";
        story.innerHTML = `
            야근과 극단적인 절약 스트레스를 버티지 못하고 결국 멘탈이 0에 도달했습니다.<br>
            의사의 권고로 눈물의 병가 휴직을 제출하게 되었습니다.<br>
            돈도 중요하지만 무엇보다 소중한 것은 당신의 건강과 마음입니다.
        `;
        window.sounds.playGameOver();

        modal.style.display = 'flex';
        document.getElementById('btnRestartGame').onclick = () => {
            modal.style.display = 'none';
            this.resetGame();
        };
    }
}

// ==========================================
// 애플리케이션 초기화
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();

    const btnSound = document.getElementById('btnSound');
    if (btnSound) {
        btnSound.onclick = () => {
            const isMuted = window.sounds.toggleMute();
            btnSound.querySelector('.btn-icon-text').innerText = isMuted ? '🔇' : '🔊';
            btnSound.querySelector('.btn-label').innerText = isMuted ? '음소거' : '사운드';
        };
    }

    const helpModal = document.getElementById('helpModal');
    const btnHelp = document.getElementById('btnHelp');
    const btnCloseHelp = document.getElementById('btnCloseHelp');
    const btnCloseHelpBottom = document.getElementById('btnCloseHelpBottom');

    if (btnHelp) {
        btnHelp.onclick = () => {
            window.sounds.playClick();
            helpModal.style.display = 'flex';
        };
    }
    if (btnCloseHelp) {
        btnCloseHelp.onclick = () => {
            window.sounds.playClick();
            helpModal.style.display = 'none';
        };
    }
    if (btnCloseHelpBottom) {
        btnCloseHelpBottom.onclick = () => {
            window.sounds.playClick();
            helpModal.style.display = 'none';
        };
    }

    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.onclick = () => {
            if (confirm("정말 처음부터 다시 시작하시겠습니까? (진행 상황이 초기화됩니다)")) {
                window.game.resetGame();
            }
        };
    }
});
