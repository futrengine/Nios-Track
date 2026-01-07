// ==========================================
// 1. DATA: SYLLABUS
// ==========================================
const defaultSyllabus = {
    "Economics (318)": [
        {id: "Ch-08", name: "Measures of Central Tendency", status: "pending"},
        {id: "Ch-09", name: "Measures of Dispersion", status: "pending"},
        {id: "Ch-10", name: "Correlation Analysis", status: "pending"},
        {id: "Ch-11", name: "Index Numbers", status: "pending"},
        {id: "Ch-12", name: "Intro to Study of Economics", status: "pending"},
        {id: "Ch-13", name: "Central Problems of Economy", status: "pending"},
        {id: "Ch-14", name: "Consumer Equilibrium", status: "pending"},
        {id: "Ch-15", name: "Demand", status: "pending"},
        {id: "Ch-16", name: "Price Elasticity of Demand", status: "pending"},
        {id: "Ch-17", name: "Production Function", status: "pending"},
        {id: "Ch-18", name: "Cost of Production", status: "pending"},
        {id: "Ch-19", name: "Supply", status: "pending"},
        {id: "Ch-20", name: "Price Elasticity of Supply", status: "pending"},
        {id: "Ch-21", name: "Forms of Market", status: "pending"},
        {id: "Ch-22", name: "Price Determination", status: "pending"},
        {id: "Ch-23", name: "Revenue & Profit Max", status: "pending"},
        {id: "Ch-24", name: "National Income Aggregates", status: "pending"},
        {id: "Ch-25", name: "Measurement of NI", status: "pending"},
        {id: "Ch-26", name: "Consumption, Saving, Investment", status: "pending"},
        {id: "Ch-27", name: "Theory of Income Determination", status: "pending"},
        {id: "Ch-28", name: "Money and Banking", status: "pending"},
        {id: "Ch-29", name: "Govt Budget", status: "pending"}
    ],
    "Accountancy (320)": [
        {id: "Ch-14", name: "Depreciation", status: "pending"},
        {id: "Ch-15", name: "Provisions and Reserves", status: "pending"},
        {id: "Ch-16", name: "Financial Statements Intro", status: "pending"},
        {id: "Ch-17", name: "Financial Statements I", status: "pending"},
        {id: "Ch-18", name: "Financial Statements II", status: "pending"},
        {id: "Ch-19", name: "Not for Profit Org Intro", status: "pending"},
        {id: "Ch-20", name: "NPO Financial Statements", status: "pending"},
        {id: "Ch-21", name: "Accounts Incomplete Records", status: "pending"},
        {id: "Ch-22", name: "Partnership Intro", status: "pending"},
        {id: "Ch-23", name: "Admission of Partner", status: "pending"},
        {id: "Ch-24", name: "Retirement/Death of Partner", status: "pending"},
        {id: "Ch-25", name: "Dissolution of Firm", status: "pending"},
        {id: "Ch-26", name: "Company Intro", status: "pending"},
        {id: "Ch-27", name: "Issue of Shares", status: "pending"},
        {id: "Ch-28", name: "Forfeiture of Shares", status: "pending"},
        {id: "Ch-29", name: "Reissue of Forfeited Shares", status: "pending"},
        {id: "Ch-30", name: "Issue of Debentures", status: "pending"},
        {id: "Ch-31", name: "Fin. Statement Analysis Intro", status: "pending"},
        {id: "Ch-32", name: "Accounting Ratios I", status: "pending"},
        {id: "Ch-33", name: "Accounting Ratios II", status: "pending"},
        {id: "Ch-34", name: "Cash Flow Statement", status: "pending"}
    ],
    "Business Studies (319)": [
        {id: "Ch-10", name: "Fundamentals of Management", status: "pending"},
        {id: "Ch-11", name: "Planning and Organising", status: "pending"},
        {id: "Ch-12", name: "Staffing", status: "pending"},
        {id: "Ch-13", name: "Directing", status: "pending"},
        {id: "Ch-14", name: "Coordination & Controlling", status: "pending"},
        {id: "Ch-15", name: "Financing of Business", status: "pending"},
        {id: "Ch-16", name: "Sources of Long Term Finance", status: "pending"},
        {id: "Ch-17", name: "Financial Management", status: "pending"},
        {id: "Ch-18", name: "Indian Financial Market", status: "pending"},
        {id: "Ch-19", name: "Intro to Marketing", status: "pending"},
        {id: "Ch-20", name: "Marketing Mix", status: "pending"},
        {id: "Ch-21", name: "Advertising & Salesmanship", status: "pending"},
        {id: "Ch-22", name: "Internal Trade", status: "pending"},
        {id: "Ch-23", name: "External Trade", status: "pending"},
        {id: "Ch-24", name: "Consumer Protection", status: "pending"}
    ]
};

// ==========================================
// 2. CONFIG
// ==========================================

// --- EMAIL JS SETUP (Fill these in!) ---
const EMAIL_SERVICE_ID = "Nios-Alert"; 
const EMAIL_TEMPLATE_ID = "template_2d6pduo";
const EMAIL_PUBLIC_KEY = "2iAO2hcDv-c-ulN4W"; 


(function() {
    // Initialize EmailJS
    emailjs.init(EMAIL_PUBLIC_KEY);
})();

// --- FIREBASE SETUP ---
const firebaseConfig = {
    apiKey: "AIzaSyAiZ8u-1lqP-ics1RNlFj1FGesecReanoE",
    authDomain: "nios-track.firebaseapp.com",
    projectId: "nios-track",
    storageBucket: "nios-track.firebasestorage.app",
    messagingSenderId: "883252312270",
    appId: "1:883252312270:web:e4c8d1cd79b144761d389f",
    measurementId: "G-PCWD79LW74"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// --- STATE ---
let appData = defaultSyllabus;
let currentFilter = 'all';

// --- INACTIVITY TRACKER ---
let lastInteractionTime = Date.now();
const INACTIVITY_LIMIT = 3 * 60 * 60 * 1000; // 3 Hours in Milliseconds
let emailSentForSession = false;

// Exam Date (90 Days)
const examDate = new Date();
examDate.setDate(examDate.getDate() + 90); 

// ==========================================
// 3. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // UI Init
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    startTimer();
    initializeDatabase();
    setupInactivityTracker();
});

async function initializeDatabase() {
    const statusEl = document.getElementById('status-indicator');
    
    try {
        // NOTE: Enable "Anonymous" in Firebase Console > Authentication > Sign-in method
        await auth.signInAnonymously();
        
        const docRef = db.collection("students").doc("my_study_plan");
        const doc = await docRef.get();

        if (doc.exists) {
            appData = doc.data();
            statusEl.innerHTML = '<i class="fa-solid fa-cloud"></i> Cloud Synced';
            statusEl.style.color = "var(--green)";
        } else {
            await docRef.set(defaultSyllabus);
            statusEl.innerHTML = '<i class="fa-solid fa-database"></i> DB Created';
        }
    } catch (error) {
        console.error("DB Error:", error);
        // Show specific error to help user debug
        if(error.code === 'auth/admin-restricted-operation') {
            statusEl.innerHTML = '⚠ Enable Auth in Console';
        } else {
            statusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Offline Mode';
        }
        statusEl.style.color = "var(--yellow)";
        
        const local = localStorage.getItem('niosStudyData');
        if(local) appData = JSON.parse(local);
    }
    renderApp();
}

// ==========================================
// 4. RENDERING & LOGIC
// ==========================================

function filterView(filter) {
    resetInteraction(); // User is active
    currentFilter = filter;
    
    // Update Menu UI
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    renderApp();
}

function renderApp() {
    const container = document.getElementById('app-container');
    container.innerHTML = '';
    
    let stats = { total: 0, pending: 0, progress: 0, done: 0 };

    for (const [subject, chapters] of Object.entries(appData)) {
        
        if (currentFilter !== 'all' && subject !== currentFilter) continue;

        let subCompleted = 0;
        
        chapters.forEach(ch => {
            stats.total++;
            if(ch.status === 'pending') stats.pending++;
            if(ch.status === 'progress') stats.progress++;
            if(ch.status === 'completed') { stats.done++; subCompleted++; }
        });

        const section = document.createElement('div');
        section.className = 'subject-section';
        const percent = Math.round((subCompleted / chapters.length) * 100);

        section.innerHTML = `
            <div class="subject-header" onclick="toggleList('list-${subject.split(' ')[0]}')">
                <div>
                    <h2 style="margin:0; font-size:1.1rem;">${subject}</h2>
                    <span style="font-size:0.8rem; color:var(--text-muted)">${subCompleted} / ${chapters.length} Chapters Done</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
            </div>
            <ul class="chapter-list active" id="list-${subject.split(' ')[0]}">
                </ul>
        `;

        const list = section.querySelector('ul');
        
        chapters.forEach((ch, index) => {
            const li = document.createElement('li');
            li.className = 'chapter-item';
            
            let btnClass = 'status-pending';
            let btnText = 'Pending';
            let icon = '<i class="fa-regular fa-circle"></i>';
            
            if (ch.status === 'progress') { 
                btnClass = 'status-progress'; 
                btnText = 'In Progress'; 
                icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
            }
            if (ch.status === 'completed') { 
                btnClass = 'status-completed'; 
                btnText = 'Done'; 
                icon = '<i class="fa-solid fa-check-circle"></i>';
            }

            li.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <span class="chapter-id">${ch.id}</span>
                    <span class="chapter-name">${ch.name}</span>
                </div>
                <button class="status-btn ${btnClass}" onclick="toggleStatus('${subject}', ${index})">
                    ${icon} ${btnText}
                </button>
            `;
            list.appendChild(li);
        });

        container.appendChild(section);
    }

    updateGlobalStats(stats);
}

function updateGlobalStats(stats) {
    document.getElementById('count-pending').innerText = stats.pending;
    document.getElementById('count-progress').innerText = stats.progress;
    document.getElementById('count-done').innerText = stats.done;
    document.getElementById('total-progress').innerText = Math.round((stats.done/stats.total)*100) + '%';
}

async function toggleStatus(subject, index) {
    resetInteraction(); // User is active
    
    const current = appData[subject][index].status;
    let next = 'pending';
    if (current === 'pending') next = 'progress';
    else if (current === 'progress') next = 'completed';
    else if (current === 'completed') next = 'pending';
    
    appData[subject][index].status = next;
    renderApp();

    try {
        await db.collection("students").doc("my_study_plan").set(appData);
    } catch(e) { console.log("Save error", e); }
    localStorage.setItem('niosStudyData', JSON.stringify(appData));
    localStorage.setItem('lastVisit', new Date().toISOString());
}

function toggleList(id) {
    document.getElementById(id).classList.toggle('active');
}

// ==========================================
// 5. INACTIVITY & EMAIL LOGIC (3 HOURS)
// ==========================================

function setupInactivityTracker() {
    // 1. Listen for user activity to reset timer
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
        document.addEventListener(evt, resetInteraction);
    });

    // 2. Check every minute if user has been idle for 3 hours
    setInterval(() => {
        const now = Date.now();
        const timeDiff = now - lastInteractionTime;
        
        // If 3 hours passed AND we haven't sent an email yet
        if (timeDiff > INACTIVITY_LIMIT && !emailSentForSession) {
            sendProgressEmail("Inactive Alert: You haven't studied in 3 hours!");
            emailSentForSession = true; // Don't spam
        }
    }, 60000); // Check every 1 minute

    // 3. Check 'Offline' Inactivity (Upon page load)
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const hoursGone = (new Date() - lastDate) / (1000 * 60 * 60);
        
        if (hoursGone >= 3) {
            // User returned after 3+ hours
            alert(`Welcome back! You were gone for ${Math.floor(hoursGone)} hours. Time to focus!`);
        }
    }
    // Update visit time
    localStorage.setItem('lastVisit', new Date().toISOString());
}

function resetInteraction() {
    lastInteractionTime = Date.now();
    emailSentForSession = false; // Reset so we can alert again next time
}

function sendProgressEmail(customMessage = null) {
    const btn = document.querySelector('.btn-email');
    if(btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    const done = document.getElementById('count-done').innerText;
    const total = document.getElementById('total-progress').innerText;

    let msgBody = customMessage ? customMessage : `Current Status: ${done} Chapters Completed. Total Readiness: ${total}.`;

    const params = {
        to_name: "Student",
        message: msgBody,
        date: new Date().toLocaleString()
    };

    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, params)
        .then(function() {
            if(btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
            if(!customMessage) alert("Email Sent!");
            setTimeout(() => { if(btn) btn.innerHTML = '<i class="fa-solid fa-envelope"></i> Email Report' }, 3000);
        }, function(error) {
            if(btn) btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
            console.error("Email Error:", error);
        });
}

function startTimer() {
    const timerEl = document.getElementById('countdown');
    setInterval(() => {
        const now = new Date().getTime();
        const distance = examDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timerEl.innerHTML = `${days}:${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function resetData() {
    if(confirm("Reset all data?")) {
        localStorage.clear();
        db.collection("students").doc("my_study_plan").set(defaultSyllabus)
        .then(() => location.reload());
    }
}

// ==========================================
// 6. EXPOSE FUNCTIONS TO HTML (CRITICAL FIX)
// ==========================================
window.toggleList = toggleList;
window.toggleStatus = toggleStatus;
window.filterView = filterView;
window.sendProgressEmail = sendProgressEmail;
window.resetData = resetData;