let students = [];
let editIndex = -1;

window.addEventListener('load', () => {
    loadStudents();
    setupImagePreview();
});

function setupImagePreview() {
    const imageInput = document.getElementById('image');
    const preview = documena.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });
}

document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const numero = document.getElementById('numero').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const imageInput = document.getElementById('image');

    const existingIndex = students.findIndex(s => s.numero === numero);
    if (existingIndex !== -1 && existingIndex !== editIndex) {
        showMessage('Ce numéro étudiant existe déjà !', 'error');
        return;
    }

    const student = {
        numero,
        nom,
        prenom,
        telephone,
        image: null
    };

    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            student.image = e.target.result;
            saveStudent(student);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        if (editIndex !== -1 && students[editIndex].image) {
            student.image = students[editIndex].image;
        }
        saveStudent(student);
    }
});

function saveStudent(student) {
    if (editIndex === -1) {
        students.push(student);
        showMessage('Étudiant ajouté avec succès !', 'success');
    } else {
        students[editIndex] = student;
        showMessage('Étudiant modifié avec succès !', 'success');
        editIndex = -1;
        document.getElementById('submitBtn').textContent = '💾 Enregistrer';
    }

    saveToStorage();
    resetForm();
    displayStudents();
}

function displayStudents() {
    const tbody = document.getElementById('studentsBody');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Aucun étudiant enregistré</td></tr>';
        updateStats();
        return;
    }

    tbody.innerHTML = students.map((student, index) => `
        <tr>
            <td>
                <img src="${student.image || getDefaultAvatar(student.prenom)}" 
                     alt="${student.prenom}" 
                     class="student-image">
            </td>
            <td>${student.numero}</td>
            <td>${student.nom}</td>
            <td>${student.prenom}</td>
            <td>${student.telephone || '-'}</td>
            <td class="no-print">
                <button class="action-btn btn-edit" onclick="editStudent(${index})">✏️ Modifier</button>
                <button class="action-btn btn-delete" onclick="deleteStudent(${index})">🗑️ Supprimer</button>
            </td>
        </tr>
    `).join('');

    updateStats();
}

function getDefaultAvatar(name) {
    const initial = name.charAt(0).toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%230f2027' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='40' font-weight='bold'%3E${initial}%3C/text%3E%3C/svg%3E`;
}

function editStudent(index) {
    editIndex = index;
    const student = students[index];

    document.getElementById('numero').value = student.numero;
    document.getElementById('nom').value = student.nom;
    document.getElementById('prenom').value = student.prenom;
    document.getElementById('telephone').value = student.telephone || '';
    
    if (student.image) {
        document.getElementById('previewImg').src = student.image;
        document.getElementById('imagePreview').style.display = 'block';
    }

    document.getElementById('submitBtn').textContent = '✏️ Modifier';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
//fonction supprimer 
function deleteStudent(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        students.splice(index, 1);
        saveToStorage();
        displayStudents();
        showMessage('Étudiant supprimé avec succès !', 'success');
    }
}
//fonction supprimer tout les listes:
function effacerTout() {
    if (confirm('Êtes-vous sûr de vouloir supprimer TOUS les étudiants ?')) {
        students = [];
        saveToStorage();
        displayStudents();
        showMessage('Tous les étudiants ont été supprimés !', 'success');
    }
}

function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    editIndex = -1;
    document.getElementById('submitBtn').textContent = '💾 Enregistrer';
}
//fonction imprimer liste //
function imprimerListe() {
    if (students.length === 0) {
        showMessage('Aucun étudiant à imprimer !', 'error');
        return;
    }
    window.print();
}

function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudents() {
    const saved = localStorage.getItem('students');
    if (saved) {
        students = JSON.parse(saved);
        displayStudents();
    }
}

function updateStats() {
    document.getElementById('totalStudents').textContent = students.length;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}