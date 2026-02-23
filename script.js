const batch = "BCR73";
let trainer = localStorage.getItem("trainerName") || "";
let coordinator = localStorage.getItem("coordinatorName") || "Mohammed Ismail C N";
let reporter = localStorage.getItem("reporterName") || "Mohammed Ismail C N";

function initializePage() {
    const trainerInput = document.getElementById("trainer");
    const coordinatorInput = document.getElementById("coordinator");
    const reporterInput = document.getElementById("reporter");

    if (trainerInput && trainer) {
        trainerInput.value = trainer;
    }

    if (coordinatorInput && coordinator) {
        coordinatorInput.value = coordinator;
    }

    if (reporterInput && reporter) {
        reporterInput.value = reporter;
    }

    loadStudents();
}

function saveTrainer() {
    const name = document.getElementById("trainer").value.trim();
    if (!name) {
        showToast("Invalid Input", "Please enter a trainer name.", "error");
        return;
    }

    trainer = name;
    localStorage.setItem("trainerName", trainer);
    showToast("Success", "Trainer name saved.", "success");
}

function saveReporter() {
    const name = document.getElementById("reporter").value.trim();
    if (!name) {
        showToast("Invalid Input", "Please enter a reporter name.", "error");
        return;
    }

    reporter = name;
    localStorage.setItem("reporterName", reporter);
    showToast("Success", "Reporter name saved.", "success");
}

function saveCoordinator() {
    const name = document.getElementById("coordinator").value.trim();
    if (!name) {
        showToast("Invalid Input", "Please enter a coordinator name.", "error");
        return;
    }

    coordinator = name;
    localStorage.setItem("coordinatorName", coordinator);
    showToast("Success", "Coordinator name saved.", "success");
}

document.addEventListener("DOMContentLoaded", initializePage);

const defaultStudents = [
    "Aboobacker HM", "Achilles Jilson", "Adhil", "Adithyan", "Akhila",
    "Amal Benny", "Ambily", "Anson", "Anusha Shine", "Anushma Radhakrishnan",
    "Arjun", "Athira Muralidharan", "Ayisha Safa N", "Binzy", "Deeja", "Devi",
    "Fathima Shifana", "Fathima Zuhra", "Gayathry E S", "Ghanashyam Govind",
    "Haris Hamid", "Jabir C", "Jees Vincent", "M Shamual", "Mohammed Ismail C N",
    "Mohammed Shibil", "Muhammed Aflah", "Muhammed Nihal", "Nayana Benny",
    "Praveen M P", "Prithviraj P U", "Rahul Raj", "Sabin VV", "Shabna", "Shibin K P",
    "Thamir", "Thasni Sidhiq", "Varun jp", "Yadhav A V", "Ayananth T S", "Akshay V P"
];

const sortNames = (names) => names.sort((a, b) => a.localeCompare(b));
const students = sortNames([...defaultStudents]);

function showToast(title, message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
        success: "OK",
        error: "!",
        info: "i"
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">x</button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hiding");
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

function saveStudents() {
    const names = document.getElementById("studentInput").value
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n !== "");

    if (names.length === 0) {
        showToast("Invalid Input", "Please enter valid student names.", "error");
        return;
    }

    students.length = 0;
    students.push(...sortNames(names));
    loadStudents();
    showToast("Success", `${names.length} students saved successfully.`, "success");
}

function loadStudents() {
    const container = document.getElementById("students");
    container.innerHTML = "<div class='student-header'>Select Present Students</div>";

    students.forEach((name, index) => {
        container.innerHTML += `
        <label>
          <input type="checkbox" id="s_${index}" checked> ${name}
        </label>
      `;
    });
}

function parseNameList(rawText) {
    if (!rawText) return [];
    const parts = rawText
        .split(/[\n,;]+/)
        .map((n) => n.trim())
        .filter((n) => n !== "");

    return [...new Set(parts)];
}

function generateReport() {
    const trainerValue = document.getElementById("trainer").value.trim();
    const coordinatorValue = document.getElementById("coordinator").value.trim();
    const reporterValue = document.getElementById("reporter").value.trim();
    const date = document.getElementById("date").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const topicDescription = document.getElementById("topicDescription").value.trim();
    const studentInputValue = document.getElementById("studentInput").value.trim();
    const alternateValue = document.getElementById("alternate").value.trim();
    const tldvLink = document.getElementById("tldvLink").value.trim();

    const missingFields = [];
    if (!trainerValue) missingFields.push("Trainer Name");
    if (!coordinatorValue) missingFields.push("Coordinator Name");
    if (!reporterValue) missingFields.push("Report Prepared By");
    if (!date) missingFields.push("Session Date");
    if (!topic) missingFields.push("Topic / Activity");
    if (!topicDescription) missingFields.push("Topic Description");
    if (students.length === 0) missingFields.push("Students List");

    if (missingFields.length > 0) {
        showToast("Missing Fields", `Please fill all fields: ${missingFields.join(", ")}`, "error");
        return;
    }

    trainer = trainerValue;
    coordinator = coordinatorValue;
    reporter = reporterValue;
    localStorage.setItem("trainerName", trainer);
    localStorage.setItem("coordinatorName", coordinator);
    localStorage.setItem("reporterName", reporter);

    const alternate = parseNameList(alternateValue);

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
        const marker = isAbsentee ? "🚫" : "👤";
        return arr.map((n) => `${marker} ${n}`).join("\n");
    };

    const report = `
🌟 Session Report 🌟
📅 Date: ${date}
🖥 Batch: ${batch}
🕒 Time: 3:00 PM - 4:00 PM
👨‍🏫 Trainer: ${trainer}
🤝 Coordinator: ${coordinator}
📝 Report Prepared by: ${reporter}

🗣 Activity: ${topic}
${topicDescription ? `📝 Description: ${topicDescription}\n` : ""}
------------------------------------
✅ Attendees:

${format(attendees)}

${tldvLink ? `🎥 TL;DV Recording: ${tldvLink}` : ""}
`;

    document.getElementById("output-box").innerText = report;
    showToast("Report Generated", "Your session report is ready.", "success");
}

function copyReport() {
    const text = document.getElementById("output-box").innerText;
    if (!text.trim()) {
        showToast("Nothing to Copy", "Please generate the report first.", "error");
        return;
    }

    navigator.clipboard.writeText(text);
    showToast("Copied", "Report copied to clipboard.", "success");
}

loadStudents();

