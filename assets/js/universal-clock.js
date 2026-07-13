function updateClock() {
    const tz = document.getElementById('timezoneSelect').value;
    const now = new Date();
    
    // Get formatted time string for the specific timezone
    const timeString = now.toLocaleTimeString("en-US", { timeZone: tz, hour12: false });
    const dateString = now.toLocaleDateString("en-US", { timeZone: tz });
    
    document.getElementById('digitalClock').innerText = timeString;
    document.getElementById('currentDate').innerText = dateString;

    // Split time for hands
    const [h, m, s] = timeString.split(':');
    
    // Rotate hands (360 degrees / 12 hours = 30 deg, 360/60 min = 6 deg)
    const hourDeg = (h % 12) * 30 + (m / 2);
    const minDeg = m * 6;
    
    document.getElementById('hourHand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    document.getElementById('minHand').style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
}

// Update every second
setInterval(updateClock, 1000);
updateClock(); // Initial run
