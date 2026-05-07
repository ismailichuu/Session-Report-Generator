const batch = "BCR73";
let trainer = localStorage.getItem("trainerName") || "";
let coordinator = localStorage.getItem("coordinatorName") || "Mohammed Ismail C N";
let reporter = localStorage.getItem("reporterName") || "Mohammed Ismail C N";
let pendingStudentRemoveIndex = null;

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
const savedStudents = JSON.parse(localStorage.getItem("studentsList") || "null");
const students = sortNames(Array.isArray(savedStudents) && savedStudents.length ? savedStudents : [...defaultStudents]);

function saveStudentList() {
    localStorage.setItem("studentsList", JSON.stringify(students));
}

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
    const input = document.getElementById("studentInput");
    const names = parseNameList(input.value);

    if (names.length === 0) {
        showToast("Invalid Input", "Please enter valid student names.", "error");
        return;
    }

    const existingNames = new Set(students.map(normalizeName));
    const newNames = names.filter((name) => !existingNames.has(normalizeName(name)));

    if (newNames.length === 0) {
        showToast("No New Students", "All entered students already exist in the list.", "info");
        return;
    }

    students.push(...newNames);
    sortNames(students);
    saveStudentList();
    input.value = "";
    loadStudents();
    showToast("Students Added", `${newNames.length} student${newNames.length === 1 ? "" : "s"} added to the list.`, "success");
}

function openDeleteStudentModal(index) {
    pendingStudentRemoveIndex = index;
    const modal = document.getElementById("deleteStudentModal");
    const message = document.getElementById("deleteStudentMessage");
    message.textContent = `Are you sure? ${students[index]} will be permanently removed from the saved student list.`;
    modal.hidden = false;
}

function closeDeleteStudentModal() {
    pendingStudentRemoveIndex = null;
    document.getElementById("deleteStudentModal").hidden = true;
}

function confirmRemoveStudent() {
    if (pendingStudentRemoveIndex === null) return;
    removeStudent(pendingStudentRemoveIndex);
    closeDeleteStudentModal();
}

function removeStudent(index) {
    const removedName = students.splice(index, 1)[0];
    saveStudentList();
    loadStudents();
    showToast("Student Removed", `${removedName} removed from the list.`, "success");
}

function loadStudents() {
    const container = document.getElementById("students");
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "student-header";
    header.textContent = "Select Present Students";
    container.appendChild(header);

    students.forEach((name, index) => {
        const row = document.createElement("div");
        row.className = "student-row";

        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `s_${index}`;
        checkbox.checked = true;

        const nameText = document.createElement("span");
        nameText.textContent = name;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "student-remove";
        removeButton.textContent = "x";
        removeButton.title = `Remove ${name}`;
        removeButton.setAttribute("aria-label", `Remove ${name}`);
        removeButton.onclick = () => openDeleteStudentModal(index);

        label.appendChild(checkbox);
        label.appendChild(nameText);
        row.appendChild(label);
        row.appendChild(removeButton);
        container.appendChild(row);
    });
}

function removeBatchName(name) {
    const batchPattern = new RegExp(`\\b${batch}\\b`, "gi");
    return (name || "")
        .replace(batchPattern, "")
        .replace(/\b[A-Z]{2,}\d+\b$/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeName(name) {
    return removeBatchName(name)
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase();
}

function getNameParts(name) {
    return removeBatchName(name)
        .toLowerCase()
        .replace(/'s\b/g, "")
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function isAutomatedAttendee(name) {
    return /notetaker|note\s*taker|tldv\.io|recorder|transcriber/i.test(name || "");
}

function findRosterMatch(name) {
    const normalized = normalizeName(name);
    if (!normalized) return null;

    const exactMatch = students.find((student) => normalizeName(student) === normalized);
    if (exactMatch) return exactMatch;

    const nameParts = getNameParts(name);
    if (nameParts.length === 0) return null;

    const possibleMatches = students.filter((student) => {
        const studentParts = getNameParts(student);
        const shorterLength = Math.min(nameParts.length, studentParts.length);

        if (shorterLength === 0 || nameParts[0] !== studentParts[0]) {
            return false;
        }

        for (let i = 1; i < shorterLength; i++) {
            if (nameParts[i] !== studentParts[i]) {
                return false;
            }
        }

        return true;
    });

    return possibleMatches.length === 1 ? possibleMatches[0] : null;
}

function parseDelimitedRows(text) {
    const rows = [];
    let row = [];
    let value = "";
    let insideQuotes = false;
    const tabCount = (text.match(/\t/g) || []).length;
    const commaCount = (text.match(/,/g) || []).length;
    const delimiter = tabCount > commaCount ? "\t" : ",";

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            value += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === delimiter && !insideQuotes) {
            row.push(value.trim());
            value = "";
        } else if ((char === "\n" || char === "\r") && !insideQuotes) {
            if (char === "\r" && nextChar === "\n") i++;
            row.push(value.trim());
            if (row.some((cell) => cell !== "")) rows.push(row);
            row = [];
            value = "";
        } else {
            value += char;
        }
    }

    row.push(value.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
    return rows;
}

function getAttendanceNamesFromCsv(text) {
    const rows = parseDelimitedRows(text);
    const headerIndex = rows.findIndex((row) =>
        row.some((cell) => cell.trim().toLowerCase() === "full name")
    );

    if (headerIndex >= 0) {
        const header = rows[headerIndex].map((cell) => cell.trim().toLowerCase());
        const nameColumnIndex = header.indexOf("full name");
        return rows
            .slice(headerIndex + 1)
            .map((row) => row[nameColumnIndex] || "")
            .filter(Boolean);
    }

    return rows
        .map((row) => row[0] || "")
        .filter((cell) => cell && !cell.startsWith("*") && normalizeName(cell));
}

function importAttendanceCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const trainerValue = document.getElementById("trainer").value.trim();
        if (!trainerValue) {
            showToast("Trainer Required", "Enter the trainer name before importing attendance.", "error");
            event.target.value = "";
            return;
        }

        const importedNames = getAttendanceNamesFromCsv(reader.result)
            .map(removeBatchName)
            .filter((name) => name && !isAutomatedAttendee(name));
        const trainerName = normalizeName(trainerValue);
        const alternateBox = document.getElementById("alternate");
        const matchedRosterNames = new Set();
        const seenImportedNames = new Set();
        let matchedCount = 0;

        importedNames.forEach((name) => {
            const normalized = normalizeName(name);
            if (!normalized || seenImportedNames.has(normalized) || normalized === trainerName) return;
            seenImportedNames.add(normalized);

            const matchedStudent = findRosterMatch(name);
            if (matchedStudent) {
                matchedRosterNames.add(normalizeName(matchedStudent));
            }
        });

        students.forEach((name, index) => {
            const checkbox = document.getElementById(`s_${index}`);
            const isPresent = matchedRosterNames.has(normalizeName(name));
            checkbox.checked = isPresent;
            if (isPresent) matchedCount++;
        });

        const alternateNames = importedNames.filter((name, index, names) => {
            const normalized = normalizeName(name);
            return normalized &&
                normalized !== trainerName &&
                !findRosterMatch(name) &&
                names.findIndex((item) => normalizeName(item) === normalized) === index;
        });

        const existingAlternates = parseNameList(alternateBox.value);
        const existingNormalized = new Set(existingAlternates.map(normalizeName));
        const cleanedExistingAlternates = existingAlternates.filter((name) =>
            !isAutomatedAttendee(name) &&
            normalizeName(name) !== trainerName &&
            !findRosterMatch(name)
        );
        const cleanedExistingNormalized = new Set(cleanedExistingAlternates.map(normalizeName));
        const newAlternates = alternateNames.filter((name) =>
            !existingNormalized.has(normalizeName(name)) &&
            !cleanedExistingNormalized.has(normalizeName(name))
        );

        if (cleanedExistingAlternates.length > 0 || newAlternates.length > 0) {
            alternateBox.value = [...cleanedExistingAlternates, ...newAlternates].join(", ");
            alternateBox.focus();
        } else {
            alternateBox.value = "";
        }

        const status = document.getElementById("attendanceImportStatus");
        status.textContent = `Marked ${matchedCount} roster students as present. Added ${newAlternates.length} alternate attendee${newAlternates.length === 1 ? "" : "s"}.`;
        showToast("Attendance Imported", `${matchedCount} students matched. ${newAlternates.length} moved to alternates.`, "success");
        event.target.value = "";
    };

    reader.onerror = () => {
        showToast("Import Failed", "Could not read the selected CSV file.", "error");
        event.target.value = "";
    };

    reader.readAsText(file);
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

