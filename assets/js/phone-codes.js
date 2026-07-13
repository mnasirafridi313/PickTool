const deviceCodes = {
    general: [
        { title: "IMEI Number", code: "*#06#", detail: "Displays device IMEI" },
        { title: "Testing Menu", code: "*#*#4636#*#*", detail: "Phone info and battery stats" },
        { title: "Software Version", code: "*#*#44336#*#*", detail: "View software version info" }
    ],
    samsung: [
        { title: "Service Menu", code: "*#0*#", detail: "LCD, touch, and sensor tests" },
        { title: "Firmware Info", code: "*#1234#", detail: "Check software version" },
        { title: "Battery Status", code: "*#0228#", detail: "Battery details" },
        { title: "USB Settings", code: "*#0808#", detail: "Configure USB mode" }
    ],
    xiaomi: [
        { title: "CIT Menu", code: "*#*#6484#*#*", detail: "Hardware diagnostic tests" },
        { title: "FQC Test", code: "*#*#64663#*#*", detail: "Factory quality control test" },
        { title: "IMEI/Info", code: "*#06#", detail: "View device IMEI" }
    ]
};

function showCodes() {
    const brand = document.getElementById('brand').value;
    const resultDiv = document.getElementById('results');
    
    resultDiv.innerHTML = "";
    
    if (brand && deviceCodes[brand]) {
        deviceCodes[brand].forEach(item => {
            resultDiv.innerHTML += `
                <div class="code-item">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${item.title}</strong>
                        <span style="color:#3b5998; font-weight:bold;">${item.code}</span>
                    </div>
                    <small style="color:#666;">${item.detail}</small>
                </div>`;
        });
    }
}
