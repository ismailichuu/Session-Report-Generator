
const batch = "BCR73 - Group 2";
const trainer = "Hrithik P S";
const coordinator = "Prithiviraj";
const preparedBy = "Mohammed Ismail C N";

const defaultStudents = [
    "Aboobacker HM", "Anushma Radhakrishnan", "Ayisha Safa N", "Binzy",
    "Fathima Shifana", "Ghanashyam Govind", "Gayathry E S", "Jabir C",
    "Jees Vincent", "Mohammed Ismail C N", "Nayana Benny", "Praveen M P",
    "Prithviraj P U", "Thamir", "Mohammed Shibil", "Yadhav A V",
    "Muhammed Aflah", "Shibin K P", "Muhammed Nihal", "Athira Muralidharan",
    "Thasni Sidhiq", "Haris Hamid", "Fathima Zuhra"
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