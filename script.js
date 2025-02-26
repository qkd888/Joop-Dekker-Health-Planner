// Initialize local storage
let appointments = JSON.parse(localStorage.getItem('appointments')) || {};
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let documents = JSON.parse(localStorage.getItem('documents')) || [];
let currentDocument = null;

// Set min date for date picker
function initializeDatePicker() {
    const dateInput = document.getElementById('dateSelect');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
}

// Save appointment
function saveAppointment() {
    const date = document.getElementById('dateSelect').value;
    const details = document.getElementById('appointmentDetails').value.trim();
    if (date && details) {
        appointments[date] = details;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        document.getElementById('appointmentDetails').value = '';
        updateAppointmentList();
    }
}

// Update appointment list
function updateAppointmentList() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '';
    Object.entries(appointments).forEach(([date, details]) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <span><strong>${new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}:</strong> ${details}</span>
            <button class="delete-btn" onclick="deleteAppointment('${date}')">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Delete appointment
function deleteAppointment(date) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        delete appointments[date];
        localStorage.setItem('appointments', JSON.stringify(appointments));
        updateAppointmentList();
    }
}

// Add contact
function addContact() {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    if (name && phone) {
        contacts.push({
            name,
            phone
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        updateContactList();
    }
}

// Update contact list
function updateContactList() {
    const list = document.getElementById('contactList');
    list.innerHTML = '';
    contacts.forEach((contact, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <span><strong>${contact.name}:</strong> ${contact.phone}</span>
            <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Delete contact
function deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        updateContactList();
    }
}

// Add document
function addDocument() {
    const input = document.getElementById('documentInput');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            documents.push({
                name: file.name,
                type: file.type,
                data: e.target.result
            });
            localStorage.setItem('documents', JSON.stringify(documents));
            input.value = '';
            updateDocumentList();
        };
        reader.readAsDataURL(file);
    }
}

// Update document list
function updateDocumentList() {
    const list = document.getElementById('documentList');
    list.innerHTML = '';
    documents.forEach((doc, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <span onclick="showDocumentModal(${index})">${doc.name}</span>
            <button class="delete-btn" onclick="deleteDocument(${index}); event.stopPropagation()">Delete</button>
        `;
        list.appendChild(item);
    });
}

// Delete document
function deleteDocument(index) {
    if (confirm('Are you sure you want to delete this document?')) {
        documents.splice(index, 1);
        localStorage.setItem('documents', JSON.stringify(documents));
        updateDocumentList();
        closeModal();
    }
}

// Show document modal
function showDocumentModal(index) {
    currentDocument = documents[index];
    const modal = document.getElementById('documentModal');
    const title = document.getElementById('modalTitle');
    const preview = document.getElementById('modalPreview');

    title.textContent = currentDocument.name;
    preview.innerHTML = '';

    if (currentDocument.type.includes('image')) {
        const img = document.createElement('img');
        img.src = currentDocument.data;
        img.className = 'document-preview';
        preview.appendChild(img);
    } else if (currentDocument.type === 'application/pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = currentDocument.data;
        iframe.className = 'document-preview';
        preview.appendChild(iframe);
    } else {
        preview.textContent = 'Preview not available for this file type';
    }

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
    currentDocument = null;
}

// Download document
function downloadDocument() {
    if (currentDocument) {
        const link = document.createElement('a');
        link.href = currentDocument.data;
        link.download = currentDocument.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize app
window.onload = () => {
    initializeDatePicker();
    updateAppointmentList();
    updateContactList();
    updateDocumentList();
};