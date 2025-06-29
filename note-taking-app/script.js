document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const newNoteBtn = document.getElementById('new-note-btn');
            const emptyNewNoteBtn = document.getElementById('empty-new-note-btn');
            const cancelNoteBtn = document.getElementById('cancel-note-btn');
            const saveNoteBtn = document.getElementById('save-note-btn');
            const noteEditor = document.getElementById('note-editor');
            const notesGrid = document.getElementById('notes-grid');
            const noteTitle = document.getElementById('note-title');
            const noteContent = document.getElementById('note-content');
            const deleteModal = document.getElementById('delete-modal');
            const closeDeleteModal = document.getElementById('close-delete-modal');
            const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
            const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
            const searchInput = document.querySelector('.search-bar input');

            // State variables
            let notes = [];
            let currentNoteId = null;
            let isEditing = false;

            // Initialize the app
            init();

            // Event Listeners
            newNoteBtn.addEventListener('click', showNoteEditor);
            emptyNewNoteBtn.addEventListener('click', showNoteEditor);
            cancelNoteBtn.addEventListener('click', hideNoteEditor);
            saveNoteBtn.addEventListener('click', saveNote);
            closeDeleteModal.addEventListener('click', hideDeleteModal);
            cancelDeleteBtn.addEventListener('click', hideDeleteModal);
            confirmDeleteBtn.addEventListener('click', deleteNote);
            searchInput.addEventListener('input', searchNotes);

            // Functions
            function init() {
                loadNotes();
                renderNotes();
            }

            function loadNotes() {
                const savedNotes = localStorage.getItem('professional-notes');
                if (savedNotes) {
                    notes = JSON.parse(savedNotes);
                }
            }

            function saveNotes() {
                localStorage.setItem('professional-notes', JSON.stringify(notes));
            }

            function renderNotes(filteredNotes = null) {
                const notesToRender = filteredNotes || notes;
                
                if (notesToRender.length === 0) {
                    notesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-sticky-note"></i>
                            <h3>No notes yet</h3>
                            <p>Create your first note by clicking the "New Note" button</p>
                            <button class="btn btn-primary" id="empty-new-note-btn">
                                <i class="fas fa-plus"></i>
                                New Note
                            </button>
                        </div>
                    `;
                    document.getElementById('empty-new-note-btn').addEventListener('click', showNoteEditor);
                    return;
                }

                notesGrid.innerHTML = notesToRender.map(note => `
                    <div class="note-card" data-id="${note.id}">
                        <div class="note-actions">
                            <div class="note-action-btn edit-note-btn">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="note-action-btn delete-note-btn">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                        <h3 class="note-title">${note.title}</h3>
                        <p class="note-content">${note.content}</p>
                        <p class="note-date">${formatDate(note.updatedAt)}</p>
                    </div>
                `).join('');

                // Add event listeners to note cards
                document.querySelectorAll('.note-card').forEach(card => {
                    const editBtn = card.querySelector('.edit-note-btn');
                    const deleteBtn = card.querySelector('.delete-note-btn');
                    const noteId = card.getAttribute('data-id');

                    card.addEventListener('click', (e) => {
                        // Don't open editor if clicking on action buttons
                        if (!e.target.closest('.note-action-btn')) {
                            editNote(noteId);
                        }
                    });

                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        editNote(noteId);
                    });

                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showDeleteModal(noteId);
                    });
                });
            }

            function showNoteEditor() {
                noteEditor.style.display = 'block';
                noteTitle.value = '';
                noteContent.value = '';
                currentNoteId = null;
                isEditing = false;
                notesGrid.style.display = 'none';
                noteTitle.focus();
            }

            function hideNoteEditor() {
                noteEditor.style.display = 'none';
                notesGrid.style.display = 'grid';
            }

            function editNote(noteId) {
                const note = notes.find(n => n.id === noteId);
                if (note) {
                    noteEditor.style.display = 'block';
                    noteTitle.value = note.title;
                    noteContent.value = note.content;
                    currentNoteId = noteId;
                    isEditing = true;
                    notesGrid.style.display = 'none';
                    noteTitle.focus();
                }
            }

            function saveNote() {
                const title = noteTitle.value.trim();
                const content = noteContent.value.trim();

                if (!title) {
                    alert('Please enter a title for your note');
                    return;
                }

                const now = new Date();

                if (isEditing) {
                    // Update existing note
                    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
                    if (noteIndex !== -1) {
                        notes[noteIndex] = {
                            ...notes[noteIndex],
                            title,
                            content,
                            updatedAt: now
                        };
                    }
                } else {
                    // Create new note
                    const newNote = {
                        id: generateId(),
                        title,
                        content,
                        createdAt: now,
                        updatedAt: now
                    };
                    notes.unshift(newNote); // Add to beginning of array
                }

                saveNotes();
                renderNotes();
                hideNoteEditor();
            }

            function showDeleteModal(noteId) {
                currentNoteId = noteId;
                deleteModal.style.display = 'flex';
            }

            function hideDeleteModal() {
                deleteModal.style.display = 'none';
            }

            function deleteNote() {
                notes = notes.filter(note => note.id !== currentNoteId);
                saveNotes();
                renderNotes();
                hideDeleteModal();
            }

            function searchNotes() {
                const searchTerm = searchInput.value.toLowerCase();
                if (!searchTerm) {
                    renderNotes();
                    return;
                }

                const filteredNotes = notes.filter(note => 
                    note.title.toLowerCase().includes(searchTerm) || 
                    note.content.toLowerCase().includes(searchTerm)
                );
                renderNotes(filteredNotes);
            }

            function generateId() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            }

            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        });