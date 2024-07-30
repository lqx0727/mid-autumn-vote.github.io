const MAX_VOTES = 2;

async function loadPrograms() {
    const response = await fetch('/programs');
    const data = await response.json();
    const programList = document.getElementById('programList');
    programList.innerHTML = '';
    data.forEach(program => {
        const programDiv = document.createElement('div');
        programDiv.classList.add('program');
        programDiv.innerHTML = `
            <h3>${program.name}</h3>
            <img src="${program.photo}" alt="${program.name}">
            <button class="btn" onclick="vote(${program.id})">投票</button>
        `;
        programList.appendChild(programDiv);
    });
}

async function vote(programId) {
    const response = await fetch('/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId })
    });
    const result = await response.json();
    if (result.success) {
        alert('投票成功！');
    } else {
        alert(result.message);
    }
}

async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const response = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const result = await response.json();
    if (result.success) {
        document.getElementById('adminMenu').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        localStorage.setItem('role', 'admin');
    } else {
        alert('密码错误。');
    }
}

function logout() {
    localStorage.removeItem('role');
    document.getElementById('adminMenu').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

function showUploadForm() {
    document.getElementById('uploadForm').classList.toggle('hidden');
}

async function uploadProgram() {
    const programName = document.getElementById('programName').value;
    const programPhoto = document.getElementById('programPhoto').files[0];
    if (!programName || !programPhoto) {
        alert('请输入节目名称并选择一张照片。');
        return;
    }
    const formData = new FormData();
    formData.append('name', programName);
    formData.append('photo', programPhoto);
    const response = await fetch('/programs', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.success) {
        loadPrograms();
        alert('节目上传成功！');
        document.getElementById('uploadForm').classList.add('hidden');
    } else {
        alert('上传失败，请重试。');
    }
}

async function resetVotes() {
    const response = await fetch('/admin/reset-votes', { method: 'POST' });
    const result = await response.json();
    if (result.success) {
        alert('投票已重置。');
    } else {
        alert('重置失败，请重试。');
    }
}

async function showStatistics() {
    const response = await fetch('/statistics');
    const data = await response.json();
    const statisticsDiv = document.getElementById('statistics');
    statisticsDiv.innerHTML = '<h3>投票统计</h3>';
    data.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.innerHTML = `<p>${stat.name}: ${stat.votes} 票</p>`;
        statisticsDiv.appendChild(statDiv);
    });
    statisticsDiv.classList.remove('hidden');
}

function changeBackground() {
    document.getElementById('backgroundForm').classList.toggle('hidden');
}

async function uploadBackground() {
    const backgroundImage = document.getElementById('backgroundImage').files[0];
    if (!backgroundImage) {
        alert('请选择一张照片。');
        return;
    }
    const formData = new FormData();
    formData.append('background', backgroundImage);
    const response = await fetch('/admin/background', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.success) {
        alert('背景已更换！');
        document.body.style.backgroundImage = `url(${result.url})`;
        document.getElementById('backgroundForm').classList.add('hidden');
    } else {
        alert('更换失败，请重试。');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPrograms();
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        document.getElementById('adminMenu').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }
});
