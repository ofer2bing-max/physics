const canvas = document.getElementById('opticsCanvas');
const ctx = canvas.getContext('2d');
const n1Select = document.getElementById('n1');
const n2Select = document.getElementById('n2');
const music = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');

canvas.width = 600;
canvas.height = 400;

let mX = 150;
let mY = 100;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mX = e.clientX - rect.left;
    mY = e.clientY - rect.top;
    draw();
});

n1Select.onchange = draw;
n2Select.onchange = draw;

function draw() {
    const n1 = parseFloat(n1Select.value);
    const n2 = parseFloat(n2Select.value);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // רקע חומרים
    ctx.fillStyle = "#e0f7fa"; ctx.fillRect(0, 0, canvas.width, centerY);
    ctx.fillStyle = "#b2ebf2"; ctx.fillRect(0, centerY, canvas.width, centerY);

    // קו הפרדה ואנך
    ctx.strokeStyle = "black"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(canvas.width, centerY); ctx.stroke();
    
    ctx.setLineDash([5, 5]); ctx.strokeStyle = "#666";
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height); ctx.stroke();
    ctx.setLineDash([]);

    if (mY >= centerY) return;

    // חישוב וקטור הכניסה
    let dx = mX - centerX;
    let dy = centerY - mY;
    
    // זווית פגיעה (theta1)
    let theta1 = Math.atan2(dx, dy);

    // 1. קרן פוגעת (אדומה)
    ctx.strokeStyle = "red"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mX, mY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // 2. חישוב חוק סנל
    let sinTheta2 = (n1 * Math.sin(theta1)) / n2;
    
    if (Math.abs(sinTheta2) <= 1) {
        let theta2 = Math.asin(sinTheta2);
        
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        // --- התיקון הקריטי כאן ---
        // אנחנו הופכים את סימן ה-Sin כדי שהקרן תחצה את האנך לצד השני!
        // אם באנו מימין (dx חיובי), הקרן תצא לשמאל (מינוס).
        ctx.lineTo(centerX - Math.sin(theta2) * 500, centerY + Math.cos(theta2) * 500);
        ctx.stroke();
        
        document.getElementById('angle-in').innerText = Math.abs(theta1 * 180 / Math.PI).toFixed(1);
        document.getElementById('angle-out').innerText = Math.abs(theta2 * 180 / Math.PI).toFixed(1);
    } else {
        // החזרה גמורה
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - dx, centerY - dy); // החזרה לצד השני למעלה
        ctx.stroke();
        document.getElementById('angle-out').innerText = "החזרה גמורה!";
    }
}

// פונקציות מוזיקה
function toggleMusic() {
    if (music.paused) { music.play(); playBtn.innerText = "עצור מוזיקה ⏸️"; }
    else { music.pause(); playBtn.innerText = "נגן מוזיקה 🎵"; }
}
function restartMusic() { music.currentTime = 0; music.play(); }
function changeVolume(val) { music.volume = val; }

draw();