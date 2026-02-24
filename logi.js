const canvas = document.getElementById('opticsCanvas');
const ctx = canvas.getContext('2d');
const n1Select = document.getElementById('n1');
const n2Select = document.getElementById('n2');

canvas.width = 600;
canvas.height = 400;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    draw();
});

function draw() {
    const n1 = parseFloat(n1Select.value);
    const n2 = parseFloat(n2Select.value);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור חומרים
    ctx.fillStyle = "#e0f7fa";
    ctx.fillRect(0, 0, canvas.width, centerY);
    ctx.fillStyle = "#b2ebf2";
    ctx.fillRect(0, centerY, canvas.width, centerY);

    // 1. אנך מקווקו
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#666";
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. קו ממשק
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    if (mouseY >= centerY) return;

    // 3. חישוב וקטור הכניסה
    // dx הוא המרחק האופקי מהמרכז. אם העכבר משמאל, dx שלילי.
    let dx = mouseX - centerX;
    let dy = centerY - mouseY;
    
    // זווית הפגיעה ביחס לאנך
    let theta1 = Math.atan2(dx, dy);

    // 4. קרן פוגעת (אדומה) - מהעכבר לנקודת הפגיעה
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // 5. חוק סנל (Snell's Law)
    let sinTheta2 = (n1 * Math.sin(theta1)) / n2;
    
    if (Math.abs(sinTheta2) <= 1) {
        let theta2 = Math.asin(sinTheta2);
        
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        // התיקון כאן: 
        // הקרן צריכה להמשיך באותו כיוון אופקי (אם באנו משמאל, נמשיך לימין ולהפך)
        // לכן אנחנו הופכים את הסימן של sin בציור (כי הקרן "חוצה" את האנך)
        ctx.lineTo(centerX - Math.sin(theta2) * 200, centerY + Math.cos(theta2) * 200);
        ctx.stroke();
        
        document.getElementById('angle-in').innerText = Math.abs(theta1 * 180 / Math.PI).toFixed(1);
        document.getElementById('angle-out').innerText = Math.abs(theta2 * 180 / Math.PI).toFixed(1);
    } else {
        // החזרה גמורה
        ctx.strokeStyle = "purple";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - dx, centerY - dy); // החזרה סימטרית
        ctx.stroke();
        document.getElementById('angle-out').innerText = "החזרה גמורה!";
    }
}

draw();