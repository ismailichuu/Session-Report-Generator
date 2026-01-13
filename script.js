const batch = "BCR73";
const trainer = "Hrithik P S & Sarang T P";
let coordinator = localStorage.getItem('coordinatorName') || "";
const preparedBy = localStorage.getItem('reporterName') || "";

// Initialize coordinator name when page loads
function initializePage() {
    // Set initial coordinator name if saved
    const coordinatorInput = document.getElementById('coordinator');
    if (coordinatorInput && coordinator) {
        coordinatorInput.value = coordinator;
    }
    
    // Load students
    loadStudents();
}

//Save reporter name
function saveReporter() {
    const name = document.getElementById('reporter').value.trim();
    if (!name) {
        showToast('Invalid Input', 'Please enter a reporter name.', 'error');
        return;
    }
    
    reporter = name;
    localStorage.setItem('reporterName', reporter);
    showToast('Success!', 'Reporter name saved.', 'success');
}

// Save coordinator name
function saveCoordinator() {
    const name = document.getElementById('coordinator').value.trim();
    if (!name) {
        showToast('Invalid Input', 'Please enter a coordinator name.', 'error');
        return;
    }
    
    coordinator = name;
    localStorage.setItem('coordinatorName', coordinator);
    showToast('Success!', 'Coordinator name saved.', 'success');
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', initializePage);

const defaultStudents = [
    "Aboobacker HM", "Achilles Jilson", "Adhil", "Adithyan", "Akhila", 
    "Amal Benny", "Ambily", "Anson", "Anusha Shine", "Anushma Radhakrishnan", 
    "Arjun", "Athira Muralidharan", "Ayisha Safa N", "Binzy", "Deeja", "Devi", 
    "Fathima Shifana", "Fathima Zuhra", "Gayathry E S", "Ghanashyam Govind", 
    "Haris Hamid", "Jabir C", "Jees Vincent", "M Shamual", "Mohammed Ismail C N", 
    "Mohammed Shibil", "Muhammed Aflah", "Muhammed Nihal", "Nayana Benny", 
    "Praveen M P", "Prithviraj P U", "Rahul Raj", "Sabin VV", "Shabna", "Shibin K P", 
    "Thamir", "Thasni Sidhiq", "Varun jp", "Yadhav A V"
];

const students = defaultStudents;

// Toast notification function
function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function saveStudents() {
    const names = document.getElementById("studentInput").value
        .split(",")
        .map(n => n.trim())
        .filter(n => n !== "");

    if (names.length === 0) {
        showToast('Invalid Input', 'Please enter valid student names.', 'error');
        return;
    }

    students.length = 0;
    students.push(...names);
    loadStudents();
    showToast('Success!', `${names.length} students saved successfully.`, 'success');
}

function loadStudents() {
    const container = document.getElementById("students");
    container.innerHTML = "<div class='student-header'>Select Present Students:</div>";

    students.forEach((name, index) => {
        container.innerHTML += `
        <label>
          <input type="checkbox" id="s_${index}" checked> ${name}
        </label>
      `;
    });
}

function generateReport() {
    if (students.length === 0) {
        showToast('No Students', 'Please save students first!', 'error');
        return;
    }

    const date = document.getElementById("date").value || "Not specified";
    const topic = document.getElementById("topic").value || "General Session";
    const topicDescription = document.getElementById("topicDescription").value;
    const tldvLink = document.getElementById("tldvLink").value.trim();
    const alternate = document.getElementById("alternate").value
        .split(",")
        .map(n => n.trim())
        .filter(n => n !== "");

    const attendees = [];
    const absentees = [];

    students.forEach((name, i) => {
        const checked = document.getElementById(`s_${i}`).checked;
        checked ? attendees.push(name) : absentees.push(name);
    });

    if (alternate.length > 0) {
        attendees.push(...alternate);
    }

    const format = (arr, isAbsentee = false) => {
        if (!arr.length) return "None";
        const emoji = isAbsentee ? "🚫" : "👤";
        return arr.map(n => `${emoji} ${n}`).join("\n");
    };

    const report = `
🌟 Session Report 🌟
📅 Date: ${date}
🖥 Batch: ${batch}
🕒 Time: 3:00 PM – 4:00 PM
👨‍🏫 Trainer: ${trainer}
🤝 Coordinator: ${coordinator}
📝 Report Prepared by: ${preparedBy}

🗣 Activity: ${topic}
${topicDescription ? `📝 Description: ${topicDescription}
` : ''}
------------------------------------
✅ Attendees:

${format(attendees)}
------------------------------------
🚫 Absentees:

${format(absentees, true)}


${tldvLink ? `🎥 TL;DV Recording: ${tldvLink}` : ''}
`;

    document.getElementById("output-box").innerText = report;
    showToast('Report Generated!', 'Your session report is ready.', 'success');
}

function copyReport() {
    const text = document.getElementById("output-box").innerText;
    if (!text.trim()) {
        showToast('Nothing to Copy', 'Please generate the report first!', 'error');
        return;
    }

    navigator.clipboard.writeText(text);
    showToast('Copied!', 'Report copied to clipboard. Ready to paste! 🚀', 'success');
}

loadStudents();