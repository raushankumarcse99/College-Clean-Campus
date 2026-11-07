// CampusCare - JavaScript functionality

// Get HTML elements
const reportForm = document.getElementById("reportForm");
const ideaForm = document.getElementById("ideaForm");
const activityList = document.getElementById("activityList");
const totalReports = document.getElementById("totalReports");
const totalIdeas = document.getElementById("totalIdeas");
const toast = document.getElementById("toast");

// Load saved activities from browser
let activities = JSON.parse(
    localStorage.getItem("campusCareActivities")
) || [];

// Save activities in browser
function saveActivities() {
    localStorage.setItem(
        "campusCareActivities",
        JSON.stringify(activities)
    );
}

// Show small notification message
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function() {
        toast.classList.remove("show");
    }, 2500);
}

// Update dashboard and activity list
function updateDashboard() {

    const reports = activities.filter(
        item => item.kind === "Report"
    ).length;

    const ideas = activities.filter(
        item => item.kind === "Green Idea"
    ).length;

    totalReports.textContent = reports;
    totalIdeas.textContent = ideas;

    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <span>🌱</span>
                <p>
                    No activity yet. Submit a report or share
                    a green idea to get started.
                </p>
            </div>
        `;
        return;
    }

    activityList.innerHTML = activities.map(item => `
        <article class="activity-item">

            <div class="activity-symbol">
                ${item.kind === "Report" ? "📢" : "💡"}
            </div>

            <div class="activity-details">
                <strong>${escapeHTML(item.title)}</strong>

                <p>${escapeHTML(item.description)}</p>

                <small>
                    ${escapeHTML(item.location)} ·
                    ${escapeHTML(item.date)}
                </small>
            </div>

            <span class="type-tag">${item.kind}</span>

        </article>
    `).join("");
}

// Protect the activity list from unsafe HTML input
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// Submit a campus issue
reportForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const issue = document.getElementById("issueType").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();
    const photo = document.getElementById("photo").files[0];

    if (!issue || !location || !description) {
        showToast("Please complete all required fields.");
        return;
    }

    const newReport = {
        kind: "Report",
        title: issue,
        description: description +
            (photo ? " (Photo selected: " + photo.name + ")" : ""),
        location: location,
        date: new Date().toLocaleString()
    };

    activities.unshift(newReport);

    saveActivities();
    updateDashboard();

    reportForm.reset();

    showToast("Demo report saved successfully.");
});

// Submit a green idea
ideaForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = document.getElementById("ideaTitle").value.trim();

    const description = document.getElementById(
        "ideaDescription"
    ).value.trim();

    if (!title || !description) {
        showToast("Please enter your idea and suggestion.");
        return;
    }

    const newIdea = {
        kind: "Green Idea",
        title: title,
        description: description,
        location: "Campus Suggestion",
        date: new Date().toLocaleString()
    };

    activities.unshift(newIdea);

    saveActivities();
    updateDashboard();

    ideaForm.reset();

    showToast("Your green idea has been saved.");
});

// Get current location
document.getElementById("locationButton").addEventListener(
    "click",
    function() {

        const locationInput = document.getElementById("location");

        if (!navigator.geolocation) {
            showToast("Location is not supported by this browser.");
            return;
        }

        showToast("Requesting location permission...");

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const latitude =
                    position.coords.latitude.toFixed(5);

                const longitude =
                    position.coords.longitude.toFixed(5);

                locationInput.value =
                    `Latitude: ${latitude}, Longitude: ${longitude}`;

                showToast("Current location added.");
            },

            function() {
                showToast(
                    "Location permission unavailable. Enter it manually."
                );
            }
        );
    }
);

// Clear demo activity
document.getElementById("clearButton").addEventListener(
    "click",
    function() {

        if (activities.length === 0) {
            showToast("There is no demo data to clear.");
            return;
        }

        const confirmed = confirm(
            "Do you want to clear all saved reports and ideas?"
        );

        if (confirmed) {
            activities = [];

            saveActivities();
            updateDashboard();

            showToast("Demo activity cleared.");
        }
    }
);

// Display saved activities when website opens
updateDashboard();