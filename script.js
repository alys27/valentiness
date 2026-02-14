// --- AYARLAR ---
const puzzleConfig = [
    { id: 1, question: "Bir birimizi gördüyümüz ilk yer", answer: "BAYRAQ MEYDANI", clues: [{ charIndex: 3, targetSlot: 7 }] },
    { id: 2, question: "Tanışlığımızı təsvir edən mahnı", answer: "BENİMLE KAYBOLDUN", clues: [{ charIndex: 12, targetSlot: 6 }] },
    { id: 3, question: "Mənim ən sevdiyim xitab", answer: "HAYATIM", clues: [{ charIndex: 0, targetSlot: 10 }] },
    { id: 4, question: "İlk çay içdiyimiz yer", answer: "CİNNABON", clues: [{ charIndex: 2, targetSlot: 3 }] },
    { id: 5, question: "Mənim ən sevdiyim insanın adı", answer: "ELCAN", clues: [{ charIndex: 0, targetSlot: 11 }] },
    { id: 6, question: "Ən çox getmək istədiyim date", answer: "KARTİNG", clues: [{ charIndex: 0, targetSlot: 4 }] },
    { id: 7, question: "Evimizdə mənə aid olan otağın adı nə olacaq", answer: "ARTSTUDİO", clues: [{ charIndex: 7, targetSlot: 2 }] },
    { id: 8, question: "Mənə alacağın maşın", answer: "CAMARO", clues: [{ charIndex: 0, targetSlot: 9 }] },
    { id: 9, question: "Sizi özləyəndə dinlədiyim mahnı hansı cizgifilmə aiddir", answer: "PEPE", clues: [{ charIndex: 0, targetSlot: 1 }, { charIndex: 2, targetSlot: 5 }] },
    { id: 10, question: "Sizi nə qədər sevirəm", answer: "SONSUZ", clues: [{ charIndex: 0, targetSlot: 8 }] }
];

const TARGET_PASSWORD = "PİNKPORSCHE"; 
const PASSWORD_LENGTH_WORD1 = 4; 

function startGame() {
    const overlay = document.getElementById('intro-overlay');
    // Opaklığı düşür (Fade out efekti için)
    overlay.style.opacity = '0';
    
    // Animasyon bitince tamamen kaldır
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => { initGame(); });

function initGame() { createPasswordInputs(); createQuestions(); }

function createPasswordInputs() {
    const w1 = document.getElementById('word-1');
    const w2 = document.getElementById('word-2');
    for (let i = 0; i < TARGET_PASSWORD.length; i++) {
        const slotNum = i + 1;
        const wrapper = document.createElement('div'); wrapper.className = 'pass-wrapper';
        const input = document.createElement('input'); input.type = "text"; input.maxLength = 1; input.className = 'pass-input';
        input.dataset.index = i; input.dataset.correct = TARGET_PASSWORD[i]; input.id = `pass-input-${slotNum}`;
        input.addEventListener('input', (e) => checkPasswordInput(e.target));
        const label = document.createElement('span'); label.className = 'slot-number-label'; label.innerText = slotNum;
        wrapper.appendChild(input); wrapper.appendChild(label);
        if (slotNum <= PASSWORD_LENGTH_WORD1) w1.appendChild(wrapper); else w2.appendChild(wrapper);
    }
}

function checkPasswordInput(input) {
    let val = input.value.toLocaleUpperCase('tr-TR'); input.value = val;
    if (val === input.dataset.correct) {
        input.classList.add('correct'); input.classList.remove('wrong'); input.blur(); checkWinCondition();
    } else if (val !== '') { input.classList.add('wrong'); input.classList.remove('correct'); } 
    else { input.classList.remove('wrong'); input.classList.remove('correct'); }
}

function createQuestions() {
    const leftCol = document.getElementById('left-column'); const rightCol = document.getElementById('right-column');
    puzzleConfig.forEach((q, index) => {
        const box = document.createElement('div'); box.className = 'question-box';
        const title = document.createElement('div'); title.className = 'q-title'; title.innerText = `${q.id}. ${q.question}`; box.appendChild(title);
        const row = document.createElement('div'); row.className = 'answer-row';
        [...q.answer].forEach((char, charIndex) => {
            if (char === ' ') { const space = document.createElement('div'); space.className = 'space-box'; row.appendChild(space); return; }
            const wrapper = document.createElement('div'); wrapper.className = 'char-wrapper';
            const input = document.createElement('input'); input.type = "text"; input.maxLength = 1; input.className = 'char-input'; input.dataset.correct = char;
            const clue = q.clues.find(c => c.charIndex === charIndex);
            let badge = null;
            if (clue) { badge = document.createElement('div'); badge.className = 'clue-badge'; badge.innerText = clue.targetSlot; wrapper.appendChild(badge); }
            input.addEventListener('input', (e) => handleAnswerInput(e.target, wrapper, badge));
            input.addEventListener('keydown', (e) => { if(e.key === "Backspace" && input.value === "") focusPrev(wrapper); });
            wrapper.appendChild(input); row.appendChild(wrapper);
        });
        box.appendChild(row);
        if (index < 5) leftCol.appendChild(box); else rightCol.appendChild(box);
    });
}

function handleAnswerInput(input, wrapper, badge) {
    let val = input.value.toLocaleUpperCase('tr-TR'); input.value = val;
    if (val === input.dataset.correct) {
        input.classList.add('correct'); input.classList.remove('wrong');
        if (badge) badge.classList.add('visible');
        focusNext(wrapper);
    } else if (val !== '') { input.classList.add('wrong'); input.classList.remove('correct'); } 
    else { input.classList.remove('wrong'); input.classList.remove('correct'); }
}

function focusNext(currentWrapper) {
    let nextEl = currentWrapper.nextElementSibling;
    if (nextEl && nextEl.classList.contains('space-box')) nextEl = nextEl.nextElementSibling;
    if (nextEl) { const input = nextEl.querySelector('input'); if (input) input.focus(); }
}
function focusPrev(currentWrapper) {
    let prevEl = currentWrapper.previousElementSibling;
    if (prevEl && prevEl.classList.contains('space-box')) prevEl = prevEl.previousElementSibling;
    if (prevEl) { const input = prevEl.querySelector('input'); if (input) input.focus(); }
}

function checkWinCondition() {
    const allInputs = document.querySelectorAll('.pass-input');
    let isWin = true; allInputs.forEach(inp => { if (!inp.classList.contains('correct')) isWin = false; });
    if (isWin) triggerWin();
}

function triggerWin() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#9b596a', '#ffffff'] }); // Senin rengin
    setTimeout(() => {
        const gamePhase = document.getElementById('game-phase');
        const letterContainer = document.querySelector('.letter-container');
        gamePhase.style.opacity = '0';
        setTimeout(() => {
            gamePhase.style.display = 'none';
            letterContainer.style.display = 'flex';
            setTimeout(() => {
                letterContainer.classList.add('visible');
                var duration = 3 * 1000; var end = Date.now() + duration;
                (function frame() {
                    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#9b596a', '#ffffff'] });
                    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#9b596a', '#ffffff'] });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            }, 100);
        }, 1000);
    }, 1500);
}

// --- ZARF AÇMA VE ARKA PLAN KALPLERİNİ OLUŞTURMA ---
function openEnvelope() {
    const envelopeWrapper = document.getElementById('envelope');
    
    // Zarf daha önce açılmadıysa çalıştır
    if (!envelopeWrapper.classList.contains('open')) {
        envelopeWrapper.classList.add('open');
        
        // Arka planı kalplerle doldur
        createHeartBackground();
    }
}

function createHeartBackground() {
    // Kalpleri direkt body'ye ekliyoruz ki tüm ekranı kaplasın
    const container = document.body;
    const heartCount = 100; // Ekrana yayılacak kalp sayısı (İsteğe göre artır)
    const colors = ['❤️', '💖', '💗', '💜', '💕']; 

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        
        // Rastgele emoji seç
        heart.innerText = colors[Math.floor(Math.random() * colors.length)];
        
        // --- RASTGELE KONUM (HOMOJEN DAĞILIM) ---
        // Ekranın genişliği (vw) ve yüksekliği (vh) boyunca rastgele yerleş
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        
        // --- RASTGELE BOYUT ---
        // 10px ile 40px arasında değişsin
        const size = Math.floor(Math.random() * 30) + 10;
        heart.style.fontSize = `${size}px`;
        
        // --- RASTGELE ANİMASYON GECİKMESİ ---
        // Hepsi aynı anda "güm güm" atmasın, doğal dursun
        // animation-delay: [görünme süresi], [nabız gecikmesi]
        const delay = Math.random() * 2; 
        heart.style.animationDelay = `0s, ${delay}s`;

        container.appendChild(heart);
    }
}

function readPaper(event) {
    event.stopPropagation();
    const paper = document.querySelector('.letter-paper');
    const envelopeWrapper = document.getElementById('envelope');
    if (envelopeWrapper.classList.contains('open')) {
        if (paper.classList.contains('read')) paper.classList.remove('read');
        else paper.classList.add('read');
    }
}

