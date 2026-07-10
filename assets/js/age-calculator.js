document.addEventListener("DOMContentLoaded", function() {
    
    const calculateBtn = document.getElementById("calculate-btn");
    const resultDiv = document.getElementById("result");
    
    calculateBtn.addEventListener("click", function() {
        const birthdateInput = document.getElementById("birthdate").value;
        
        if (!birthdateInput) {
            resultDiv.innerHTML = "<span style='color: red;'>Please select a valid date of birth.</span>";
            return;
        }

        const birthDate = new Date(birthdateInput);
        const today = new Date();

        if (birthDate > today) {
            resultDiv.innerHTML = "<span style='color: red;'>Birth date cannot be in the future!</span>";
            return;
        }

        // 1. Calculate Standard Years, Months, and Days
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // 2. Calculate Total Time in Days, Weeks, and Hours
        const timeDiff = today.getTime() - birthDate.getTime();
        
        // Math for exact totals
        const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;
        const totalHours = Math.floor(timeDiff / (1000 * 3600));

        // 3. Display the final result with the new detailed breakdown
        resultDiv.innerHTML = `
            <strong style="font-size: 20px;">You are:</strong><br>
            <span style="color: #007bff; font-weight: bold; font-size: 18px;">
                ${years} Years, ${months} Months, and ${days} Days old
            </span>
            
            <hr style="margin: 15px 0; border: 0; border-top: 1px dashed #ccc;">
            
            <div style="text-align: left; font-size: 14px; line-height: 1.8; color: #444;">
                <strong>Detailed Breakdown:</strong><br>
                🗓️ ${totalWeeks.toLocaleString()} Weeks and ${remainingDays} Days<br>
                ☀️ ${totalDays.toLocaleString()} Total Days<br>
                ⏱️ ${totalHours.toLocaleString()} Total Hours
            </div>
        `;
    });
});
