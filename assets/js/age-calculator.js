const birthDate=document.getElementById("birthDate");
const calculateAge=document.getElementById("calculateAge");
const ageResult=document.getElementById("ageResult");
const copyAge=document.getElementById("copyAge");

function monthName(month){

const months=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

return months[month];

}

if(calculateAge){

calculateAge.addEventListener("click",function(){

if(birthDate.value===""){

ageResult.innerHTML="<p>Please select your birth date.</p>";

return;

}

const birth=new Date(birthDate.value);
const today=new Date();

if(birth>today){

ageResult.innerHTML="<p>Birth date cannot be in the future.</p>";

return;

}

let years=today.getFullYear()-birth.getFullYear();
let months=today.getMonth()-birth.getMonth();
let days=today.getDate()-birth.getDate();

if(days<0){

months--;

days+=new Date(today.getFullYear(),today.getMonth(),0).getDate();

}

if(months<0){

years--;

months+=12;

}

let nextBirthday=new Date(today.getFullYear(),birth.getMonth(),birth.getDate());

if(nextBirthday<today){

nextBirthday.setFullYear(today.getFullYear()+1);

}

const daysLeft=Math.ceil((nextBirthday-today)/(1000*60*60*24));

ageResult.innerHTML=`

<div class="resultCard">

<div class="resultBox">
<h2>${years}</h2>
<p>Years</p>
</div>

<div class="resultBox">
<h2>${months}</h2>
<p>Months</p>
</div>

<div class="resultBox">
<h2>${days}</h2>
<p>Days</p>
</div>

</div>

<div class="extraInfo">

<p><strong>🎂 Date of Birth:</strong> ${birth.getDate()} ${monthName(birth.getMonth())} ${birth.getFullYear()}</p>

<p><strong>🎉 Next Birthday:</strong> ${daysLeft} Days Left</p>

</div>

`;

});

}

if(copyAge){

copyAge.addEventListener("click",function(){

navigator.clipboard.writeText(ageResult.innerText);

copyAge.textContent="Copied ✓";

setTimeout(function(){

copyAge.textContent="Copy Result";

},2000);

});

}
