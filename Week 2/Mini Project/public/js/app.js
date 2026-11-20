
// ==========================================
// 1. APPLICATION STATE
// ==========================================

let token = localStorage.getItem("token");
let currentUser = null;
let notes = [];
let editingNoteId = null;
let isRegistering = false;


// ==========================================
// 2. DOM ELEMENTS
// ==========================================

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authDescription = document.getElementById("auth-description");
const authToggle = document.getElementById("auth-toggle");
const authSwitchText = document.getElementById("auth-switch-text");
const authMessage = document.getElementById("auth-message");
const nameField = document.getElementById("name-field");
const authSubmit = document.querySelector(".auth-submit");

const notesContainer = document.getElementById("notes-container");
const notesCount = document.getElementById("notes-count");
const emptyState = document.getElementById("empty-state");

const noteModal = document.getElementById("note-modal");
const noteForm = document.getElementById("note-form");
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");

const searchInput = document.getElementById("search-input");


// ==========================================
// 3. API HELPER
// ==========================================

async function apiRequest(url, options = {}) {

    const headers = {
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}


// ==========================================
// 4. AUTHENTICATION UI
// ==========================================

function showAuth() {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
}

function showDashboard() {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
}


// Switch between Login and Register


authToggle.addEventListener("click", () => {

    isRegistering = !isRegistering;

    authForm.reset();
    authMessage.textContent = "";

    if (isRegistering) {

        authTitle.textContent = "Create your account.";
        authDescription.textContent = "Start organizing your thoughts.";

        authSwitchText.textContent = "Already have an account?";
        authToggle.textContent = "Sign in";

        authSubmit.textContent = "Create account";

        nameField.classList.remove("hidden");

        document.getElementById("auth-name").required = true;

    } else {

        authTitle.textContent = "Welcome back.";
        authDescription.textContent = "Pick up where you left off.";

        authSwitchText.textContent = "Don't have an account?";
        authToggle.textContent = "Create account";

        authSubmit.textContent = "Sign in";

        nameField.classList.add("hidden");

        document.getElementById("auth-name").required = false;
    }
});


authForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;

    const payload = {
        email,
        password
    };

    if (isRegistering) {
        payload.name = document.getElementById("auth-name").value.trim();
    }

    const endpoint = isRegistering
        ? "/api/auth/register"
        : "/api/auth/login";

    authSubmit.disabled = true;

    try {

        const data = await apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (isRegistering) {

            // Registration successful
            authToggle.click();

            authMessage.style.color = "var(--accent)";
            authMessage.textContent =
                "Account created successfully! Please sign in.";

        } else {

            // Login successful
            token = data.token;

            localStorage.setItem("token", token);

            currentUser = data.user;

            showDashboard();

            updateUserDetails();

            await loadNotes();
        }

    } catch (error) {

        authMessage.style.color = "var(--danger)";
        authMessage.textContent = error.message;

    } finally {

        authSubmit.disabled = false;

        authSubmit.textContent = isRegistering
            ? "Create account"
            : "Sign in";
    }
});



// ==========================================
// 5. USER INFORMATION
// ==========================================

function updateUserDetails() {

    if (!currentUser) return;

    document.getElementById("user-name").textContent =
        currentUser.name;

    document.getElementById("user-email").textContent =
        currentUser.email;

    document.getElementById("user-avatar").textContent =
        currentUser.name.charAt(0).toUpperCase();
}


// ==========================================
// 7. LOAD NOTES (READ)
// ==========================================

async function loadNotes() {

    try {

        const data = await apiRequest("/api/notes");

        notes = data.notes;

        renderNotes();

    } catch (error) {

        alert(error.message);

        if (error.message.includes("token") ||
            error.message.includes("Token")) {
            logout();
        }
    }
}


// ==========================================
// 8. RENDER NOTES
// ==========================================

function renderNotes() {

    notesContainer.replaceChildren();

    const searchTerm = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(note => {

        const title = note.title.toLowerCase();
        const content = note.content.toLowerCase();

        return title.includes(searchTerm) ||
               content.includes(searchTerm);
    });

    notesCount.textContent =
        `${filteredNotes.length} ${
            filteredNotes.length === 1 ? "note" : "notes"
        }`;

    if (filteredNotes.length === 0) {

        emptyState.classList.remove("hidden");
        notesContainer.classList.add("hidden");

        return;
    }

    emptyState.classList.add("hidden");
    notesContainer.classList.remove("hidden");

    filteredNotes.forEach(note => {

        const card = document.createElement("article");
        card.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const footer = document.createElement("div");
        footer.className = "note-card-footer";

        const date = document.createElement("span");
        date.className = "note-date";

        date.textContent = new Date(
            note.updatedAt || note.createdAt
        ).toLocaleDateString();

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            openEditModal(note);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteNote(note.id);
        });

        actions.append(editButton, deleteButton);

        footer.append(date, actions);

        card.append(title, content, footer);

        notesContainer.appendChild(card);
    });
}


// ==========================================
// 9. OPEN CREATE NOTE MODAL
// ==========================================

function openCreateModal() {

    editingNoteId = null;

    noteForm.reset();

    document.getElementById("modal-title").textContent =
        "Create a note";

    document.getElementById("note-date").textContent =
        "Your thoughts matter.";

    noteModal.classList.remove("hidden");

    noteTitle.focus();
}


// ==========================================
// 10. OPEN EDIT NOTE MODAL
// ==========================================

function openEditModal(note) {

    editingNoteId = note.id;

    noteTitle.value = note.title;
    noteContent.value = note.content;

    document.getElementById("modal-title").textContent =
        "Edit your note";

    document.getElementById("note-date").textContent =
        "Make your changes.";

    noteModal.classList.remove("hidden");

    noteTitle.focus();
}


// ==========================================
// 11. CLOSE MODAL
// ==========================================

function closeModal() {

    noteModal.classList.add("hidden");

    noteForm.reset();

    editingNoteId = null;
}

document.getElementById("add-note-btn")
    .addEventListener("click", openCreateModal);

document.getElementById("empty-add-btn")
    .addEventListener("click", openCreateModal);

document.getElementById("close-modal")
    .addEventListener("click", closeModal);

document.getElementById("cancel-note")
    .addEventListener("click", closeModal);


// Close modal when clicking outside

noteModal.addEventListener("click", (event) => {

    if (event.target === noteModal) {
        closeModal();
    }
});


// ==========================================
// 12. CREATE / UPDATE NOTE
// ==========================================

noteForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) return;

    const isEditing = editingNoteId !== null;

    const url = isEditing
        ? `/api/notes/${encodeURIComponent(editingNoteId)}`
        : "/api/notes";

    try {

        await apiRequest(url, {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify({
                title,
                content
            })
        });

        closeModal();

        await loadNotes();

    } catch (error) {

        alert(error.message);
    }
});


// ==========================================
// 13. DELETE NOTE
// ==========================================

async function deleteNote(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {

        await apiRequest(
            `/api/notes/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );

        await loadNotes();

    } catch (error) {

        alert(error.message);
    }
}


// ==========================================
// 14. SEARCH NOTES
// ==========================================

searchInput.addEventListener("input", () => {

    renderNotes();

});


// ==========================================
// 15. LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    token = null;
    currentUser = null;
    notes = [];

    searchInput.value = "";

    showAuth();

    authForm.reset();
}


// ==========================================
// 16. INITIALIZE APPLICATION
// ==========================================

async function initializeApp() {

    if (!token) {
        showAuth();
        return;
    }

    try {

        // Validate the saved JWT by fetching protected notes
        const data = await apiRequest("/api/notes");

        notes = data.notes;

        // The backend does not currently have a /me endpoint.
        // We'll show the email from a decoded JWT only for display.
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        currentUser = {
            name: payload.email.split("@")[0],
            email: payload.email
        };

        updateUserDetails();

        showDashboard();

        renderNotes();

    } catch (error) {

        logout();
    }
}


// Logout button

document.getElementById("logout-btn")
    .addEventListener("click", logout);


// Start the app

initializeApp();
