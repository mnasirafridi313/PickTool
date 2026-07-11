let balance = 100;

function addTrade() {
    const pair = document.getElementById("pair").value;
    const vol = document.getElementById("volume").value;
    const res = parseFloat(document.getElementById("resultVal").value);
    
    if (pair && vol && !isNaN(res)) {
        balance += res;
        
        const ul = document.getElementById("tradeHistory");
        const li = document.createElement("li");
        li.textContent = `${pair} | Vol: ${vol} | Result: $${res}`;
        ul.appendChild(li);
        
        document.getElementById("finalBalance").innerText = balance.toFixed(2);
        
        // Clear inputs
        document.getElementById("pair").value = "";
        document.getElementById("volume").value = "";
        document.getElementById("resultVal").value = "";
    }
}
