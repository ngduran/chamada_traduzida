// Dados mock das turmas e alunos
const mockData = {
    '3-tecnico': {
        name: 'turma_3_tecnico',
        students: [
            'Ana Silva Santos',
            'Bruno Costa Lima',
            'Carlos Eduardo Souza',
            'Daniela Ferreira',
            'Eduardo Santos',
            'Fernanda Oliveira',
            'Gabriel Rodrigues',
            'Helena Martins',
            'Igor Pereira',
            'Juliana Alves'
        ]
    },
    '2-tecnico': {
        name: 'turma_2_tecnico',
        students: [
            'Larissa Mendes',
            'Marcos Vinícius',
            'Natália Ribeiro',
            'Otávio Silva',
            'Patrícia Costa',
            'Rafael Santos',
            'Sabrina Lima',
            'Thiago Oliveira',
            'Vanessa Souza'
        ]
    },
    '1-medio': {
        name: 'turma_1_medio',
        students: [
            'Amanda Ferreira',
            'Bernardo Alves',
            'Camila Santos',
            'Diego Martins',
            'Elisa Rodrigues',
            'Felipe Costa',
            'Giovana Silva',
            'Henrique Lima',
            'Isabela Souza',
            'João Pedro',
            'Karina Oliveira',
            'Lucas Mendes'
        ]
    }
};

// Traduções
const translations = {
    pt: {
        login_title: 'Sistema de Chamada',
        username: 'Usuário:',
        password: 'Senha:',
        login_button: 'Entrar',
        main_title: 'Minhas Turmas',
        logout: 'Sair',
        turma_3_tecnico: '3º Técnico em Informática',
        turma_2_tecnico: '2º Técnico em Informática',
        turma_1_medio: '1º Ensino Médio',
        students_count: '25 alunos',
        students_count_2: '22 alunos',
        students_count_3: '30 alunos',
        back: '← Voltar',
        turma_title: 'Turma',
        attendance_title: 'Chamada e Notas',
        date_today: 'Data:',
        student_name: 'Nome do Aluno',
        attendance: 'Presença',
        grade: 'Nota',
        present: 'Presente',
        estado: 'ESTADO X',
        colegio: 'COLÉGIO EXEMPLAR',
        materia: 'ANÁLISE E PROJETO DE SISTEMAS'
    },
    es: {
        login_title: 'Sistema de Asistencia',
        username: 'Usuario:',
        password: 'Contraseña:',
        login_button: 'Ingresar',
        main_title: 'Mis Clases',
        logout: 'Salir',
        turma_3_tecnico: '3º Técnico en Informática',
        turma_2_tecnico: '2º Técnico en Informática',
        turma_1_medio: '1º Enseñanza Media',
        students_count: '25 estudiantes',
        students_count_2: '22 estudiantes',
        students_count_3: '30 estudiantes',
        back: '← Volver',
        turma_title: 'Clase',
        attendance_title: 'Asistencia y Notas',
        date_today: 'Fecha:',
        student_name: 'Nombre del Estudiante',
        attendance: 'Asistencia',
        grade: 'Nota',
        present: 'Inasistencias',
        estado: 'ESTADO X',
        colegio: 'ESCUELA EJEMPLAR',
        materia: 'ANÁLISIS Y DISEÑO DE SISTEMAS'
    }
};

// Idioma atual
let currentLanguage = 'pt';
let currentTurma = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data atual
    updateCurrentDate();
    
    // Configurar formulário de login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Aplicar tradução inicial
    applyTranslations();
});

// Função de login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validação simples (usuário fixo para demonstração)
    if (username === 'prof' && password === '123') {
        showScreen('main-screen');
    } else {
        alert(currentLanguage === 'pt' ? 'Usuário ou senha incorretos!' : '¡Usuario o contraseña incorrectos!');
    }
}

// Função para mostrar tela específica
function showScreen(screenId) {
    // Esconder todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Mostrar tela solicitada
    document.getElementById(screenId).classList.add('active');
}

// Função para abrir turma
function openTurma(turmaId) {
    currentTurma = turmaId;
    const turma = mockData[turmaId];
    
    // Atualizar título da turma
    const turmaTitle = document.getElementById('turma-title');
    turmaTitle.setAttribute('data-translate', turma.name);
    
    // Gerar lista de alunos
    generateStudentsList(turma.students);
    
    // Aplicar traduções
    applyTranslations();
    
    // Mostrar tela da turma
    showScreen('turma-screen');
}


document.getElementById("generate-pdf").addEventListener("click", () => {   
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
   
    const t = translations[currentLanguage];
   
    const nome_turma = t[mockData[currentTurma].name];
  
    const turmaNome = t[`turma_${mockData[currentTurma].name.split("_")[1]}`] || currentTurma;
    const alunos = mockData[currentTurma].students; 

    const turmaTitle = document.getElementById('turma-title');

    doc.setFontSize(14);
    doc.text(t.estado, 10, 10);
    doc.text(t.colegio, 10, 20);
    doc.text(`${t.materia} - ${nome_turma}`, 10, 30);
        
    doc.text(`${t.student_name.padEnd(61)}| ${t.grade.padEnd(6)}| ${t.present}`, 10, 40);

    doc.setFontSize(12);    

    alunos.forEach((aluno, index) => {
        const y = 50 + index * 8;
        const nota = (Math.random() * 4 + 6).toFixed(1); // notas entre 6.0 e 10.0
        const faltas = Math.floor(Math.random() * 5); // até 4 faltas           
       
        doc.text(aluno, 10, y);        // Nome do aluno à esquerda
        doc.text("|  " + nota + "  |", 110, y);        // Nota centralizada na coluna 2
        doc.text("|  " + `${faltas}` + "  |", 140, y); // Presenças na coluna 3
        
    });

    doc.setFontSize(10);
    doc.text(t.colegio, 10, 280);

    doc.save(`relatorio_${turmaNome}.pdf`);
});

// Função para gerar lista de alunos
function generateStudentsList(students) {
    const container = document.getElementById('students-container');
    container.innerHTML = '';
    
    students.forEach((studentName, index) => {
        const studentRow = document.createElement('div');
        studentRow.className = 'student-row';
        studentRow.innerHTML = `
            <div class="student-name">${studentName}</div>
            <div class="attendance-control">
                <input type="checkbox" id="attendance-${index}" />
                <label for="attendance-${index}" data-translate="present">Presente</label>
            </div>
            <div>
                <input type="number" class="grade-input" min="0" max="10" step="0.1" placeholder="0.0" />
            </div>
        `;
        container.appendChild(studentRow);
    });
}

// Função para voltar à tela principal
function backToMain() {
    showScreen('main-screen');
}

// Função de logout
function logout() {
    // Limpar formulário
    document.getElementById('login-form').reset();
    
    // Voltar para tela de login
    showScreen('login-screen');
}

// Função para trocar idioma
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Atualizar botões de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    // Aplicar traduções
    applyTranslations();
}

// Função para aplicar traduções
function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Atualizar placeholders e outros atributos se necessário
    const gradeInputs = document.querySelectorAll('.grade-input');
    gradeInputs.forEach(input => {
        input.placeholder = currentLanguage === 'pt' ? '0.0' : '0.0';
    });
}

// Função para atualizar data atual
function updateCurrentDate() {
    const today = new Date();
    const dateString = today.toLocaleDateString(currentLanguage === 'pt' ? 'pt-BR' : 'es-PY');
    
    // Atualizar quando a tela da turma for carregada
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    
    // Configurar para atualizar a data quando necessário
    setTimeout(() => {
        const dateSpan = document.getElementById('current-date');
        if (dateSpan) {
            dateSpan.textContent = dateString;
        }
    }, 100);
}

// Função utilitária para simular salvamento (para futuras implementações)
function saveAttendanceAndGrades() {
    const attendanceData = [];
    const gradeData = [];
    
    // Coletar dados de presença
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
        attendanceData.push({
            studentIndex: index,
            present: checkbox.checked
        });
    });
    
    // Coletar dados de notas
    document.querySelectorAll('.grade-input').forEach((input, index) => {
        gradeData.push({
            studentIndex: index,
            grade: input.value
        });
    });
    
    // Por enquanto, apenas log no console (futuramente salvaria no servidor)
    console.log('Dados de presença:', attendanceData);
    console.log('Dados de notas:', gradeData);
    
    // Mostrar mensagem de sucesso
    const message = currentLanguage === 'pt' ? 
        'Dados salvos com sucesso!' : 
        '¡Datos guardados exitosamente!';
    alert(message);
}



