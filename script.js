document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://note-backend-617681911777.us-central1.run.app/";
    
    const notesContainer = document.getElementById("notesList");
    const saveButton = document.getElementById("saveNote");
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    const editTitle = document.getElementById("editTitle");
    const editContent = document.getElementById("editContent");
    const updateButton = document.getElementById("updateNote");
    let editingNoteId = null;

    // Array warna untuk latar belakang catatan
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function fetchNotes() {
        fetch("${URL}/notes")
          .then(response => response.json())
          .then(data => {
            notesContainer.innerHTML = "";
            data.forEach(note => {
              const noteCard = document.createElement("div");
              noteCard.classList.add("card", "mb-3", "shadow-lg");
              noteCard.style.maxWidth = "18rem";
              noteCard.style.flex = "1 1 auto";
              noteCard.style.backgroundColor = getRandomColor(); // misalnya jika ada fungsi getRandomColor()
      
              noteCard.innerHTML = `
                <div class="card-header fw-bold">
                    <span>${note.title}</span>
                </div>
                <div class="card-body" style="max-height: 150px; overflow-y: auto;">
                    <p class="card-text">${note.content}</p>
                </div>
                <div class="card-footer text-end">
                    <button class="btn btn-dark btn-sm me-1 edit-btn" data-id="${note.id}" data-title="${note.title}" data-content="${note.content}">
                    <i class="bi bi-pencil" style="color: white;"></i>
                    </button>
                    <button class="btn btn-dark btn-sm delete-btn" data-id="${note.id}">
                    <i class="bi bi-trash" style="color: red;"></i>
                    </button>
                </div>
                `;
              notesContainer.appendChild(noteCard);
            });

                // Pasang event listener untuk tombol hapus
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const noteId = this.getAttribute("data-id");
                        deleteNote(noteId);
                    });
                });

                // Pasang event listener untuk tombol edit
                document.querySelectorAll(".edit-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        editingNoteId = this.getAttribute("data-id");
                        editTitle.value = this.getAttribute("data-title");
                        editContent.value = this.getAttribute("data-content");
                        editModal.show();
                    });
                });
            })
            .catch(error => console.error("Error fetching notes:", error));
    }

    fetchNotes();

    // Fungsi untuk menambahkan catatan baru
    saveButton.addEventListener("click", function () {
        fetch("${URL}/add-note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: titleInput.value, content: contentInput.value })
        }).then(() => {
            fetchNotes();
            titleInput.value = "";
            contentInput.value = "";
            bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
        });
    });

    // Fungsi untuk memperbarui catatan
    updateButton.addEventListener("click", function () {
        fetch(`${URL}/edit-note/${editingNoteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle.value, content: editContent.value })
        }).then(() => {
            fetchNotes();
            editModal.hide();
        });
    });

    // Fungsi untuk menghapus catatan
    function deleteNote(id) {
        fetch(`${URL}/delete-note/${id}`, { method: "DELETE" })
            .then(() => fetchNotes());
    }
});
