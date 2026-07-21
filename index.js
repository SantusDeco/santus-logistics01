//////////////////////////////
// BACK TO TOP
//////////////////////////////
function toTop(){
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//////////////////////////////
// MOBILE MENU TOGGLE
//////////////////////////////
function toggleMenu(){
  document.getElementById("navbar").classList.toggle("active");
}

//////////////////////////////
// CAR ANIMATION TRIGGER
//////////////////////////////
const vehicle = document.getElementById("myDIV");

function myFunction(){
  vehicle.classList.add("drive");
}

////////////////////////////////
// PREMIUM STATS COUNTER
////////////////////////////////

const counters = document.querySelectorAll(".counter");

let counterStarted = false;

function animateCounter(counter){

const target = Number(counter.dataset.target);

let count = 0;

const increment = Math.max(1,target/120);

function update(){

if(count < target){

count += increment;

counter.innerText = Math.ceil(count).toLocaleString();

requestAnimationFrame(update);

}else{

counter.innerText = target.toLocaleString();

}

}

update();

}

function startCounters(){

if(counterStarted) return;

counterStarted = true;

counters.forEach(counter=>animateCounter(counter));

}

const trigger = document.querySelector(".stats-section");

if(trigger){

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

startCounters();

}

});

},{

threshold:.35

});

observer.observe(trigger);

}


// FAKE DATABASE
const trackingDB = {
"SANTUS123": { status: "Shipped", progress: 50 },
"SANTUS456": { status: "In Transit", progress: 75 },
"SANTUS999": { status: "Delivered", progress: 100 }
};

function trackPackage(){
const input = document.getElementById("trackInput").value.trim();
const loading = document.getElementById("loading");
const result = document.getElementById("result");

loading.classList.remove("hidden");
result.classList.add("hidden");

setTimeout(() => {

loading.classList.add("hidden");

if(trackingDB[input]){

document.getElementById("trackId").innerText = input;
document.getElementById("statusText").innerText = trackingDB[input].status;

let progress = trackingDB[input].progress;
document.getElementById("progress").style.width = progress + "%";

// STEP HIGHLIGHT
let steps = document.querySelectorAll(".step");
steps.forEach((s,i)=>{
s.classList.remove("active");
if(progress >= (i+1)*25){
s.classList.add("active");
}
});

result.classList.remove("hidden");

}else{
alert("Tracking number not found!");
}

}, 1500);
}

const DB = {
"SANTUS-001": {status:"In Transit",location:"Lagos Hub",eta:"2 Days",progress:60,step:3,truck:60},
"SANTUS-002": {status:"Delivered",location:"Abuja",eta:"Delivered",progress:100,step:6,truck:100},
"SANTUS-003": {status:"Processing",location:"London Port",eta:"5 Days",progress:20,step:1,truck:20}
};

let history = [];

function trackEnterprise(){

const input = document.getElementById("trackInput").value.trim();
const data = DB[input];

document.getElementById("loading").classList.remove("hidden");
document.getElementById("result").classList.add("hidden");

setTimeout(()=>{

document.getElementById("loading").classList.add("hidden");

if(!data){
alert("Invalid Tracking ID");
return;
}

// update history
history.unshift(input);
history = history.slice(0,5);
document.getElementById("historyList").innerHTML =
history.map(h=>`<li>${h}</li>`).join("");

// fill data
document.getElementById("trackId").innerText = input;
document.getElementById("statusText").innerText = data.status;
document.getElementById("locationText").innerText = data.location;
document.getElementById("etaText").innerText = data.eta;

// progress
document.getElementById("progressBar").style.width = data.progress + "%";

// steps
document.querySelectorAll(".step").forEach((s,i)=>{
s.classList.remove("active");
if(i < data.step) s.classList.add("active");
});

// truck movement
document.getElementById("truck").style.left = data.truck + "%";

document.getElementById("result").classList.remove("hidden");

},1200);
}

// NEWSLETTER

const newsletterForm=document.querySelector(".newsletter-form");

if(newsletterForm){

newsletterForm.addEventListener("submit",(e)=>{

e.preventDefault();

alert("🎉 Thank you for subscribing to Santus Logistics!");

newsletterForm.reset();

});

}

/////////////////////////////////
// BACK TO TOP
/////////////////////////////////

const back=document.getElementById("backToTop");

if(back){

back.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}


