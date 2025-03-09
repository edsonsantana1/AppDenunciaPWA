document.getElementById('cep').addEventListener('input', function() {
    const cep = this.value;
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    }
});

document.getElementById('denunciaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Denúncia enviada com sucesso!');
    window.location.href = 'login.html'; // Redireciona para a página de login
});

let mediaRecorder;
let audioChunks = [];

document.getElementById('startRecording').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = document.getElementById('audioPlayback');
        audio.src = audioUrl;
        audioChunks = [];
    });

    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;
});

document.getElementById('stopRecording').addEventListener('click', () => {
    mediaRecorder.stop();
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
});

document.getElementById('redefinirSenhaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const senha = document.getElementById('senha').value;
    const token = window.location.pathname.split('/').pop();

    const response = await fetch(`/redefinir_senha/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
    });

    if (response.ok) {
        alert('Senha redefinida com sucesso!');
    } else {
        alert('Erro ao redefinir senha');
    }
});

document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        event.preventDefault();
    } else {
        // Redireciona para a página de login após o cadastro
        window.location.href = 'login.html';
    }
});


document.getElementById('telefone').addEventListener('input', function() {
    const telefone = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (telefone.length === 10 || telefone.length === 11) {
        // Verifica se o telefone tem 10 ou 11 dígitos
        this.setCustomValidity('');
    } else {
        this.setCustomValidity('Por favor, insira um número de telefone válido.');
    }
});

$(document).ready(function(){
    $("#telefone").inputmask({
        mask: ["(99)99999-9999", "(99) 99999-9999", "9999999-9999", "99 99999-9999"],
        placeholder: " ",
        showMaskOnHover: false,
        showMaskOnFocus: true,
        onincomplete: function(){
            alert('Por favor, preencha o número de telefone corretamente.');
        },
        definitions: {
            '9': {
                validator: "[0-9]",
                cardinality: 1
            }
        }
    });
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
        alert('Login realizado com sucesso!');
        window.location.href = 'perfil.html'; // Redireciona para a página de perfil
    } else {
        alert('Erro ao realizar login');
    }
});



