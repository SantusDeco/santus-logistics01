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

//////////////////////////////
// PREMIUM COUNTERS
//////////////////////////////
const counters = document.querySelectorAll(".sub");
let counterStarted = false;

function animateCounter(counter){
  const target = +counter.dataset.value;
  let count = 0;

  const duration = 2000;
  const stepTime = Math.max(10, Math.floor(duration / target));

  const timer = setInterval(() => {
    count++;
    counter.textContent = count;

    if(count >= target){
      clearInterval(timer);
      counter.textContent = target;
    }
  }, stepTime);
}

function startCounters(){
  if(counterStarted) return;
  counterStarted = true;

  counters.forEach(counter => animateCounter(counter));
}

//////////////////////////////
// SCROLL TRIGGER (PRO VERSION)
//////////////////////////////
const trigger = document.querySelector(".second-container");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      startCounters();
    }
  });
}, {
  threshold: 0.4
});

if(trigger){
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

