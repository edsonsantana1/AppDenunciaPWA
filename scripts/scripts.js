// Função para enviar denúncia
function enviarDenuncia(denuncia) {
    return fetch('http://localhost:3000/api/denuncia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(denuncia)
    })
    .then(response => response.json());
}

// Função para obter todas as denúncias
function obterDenuncias() {
    return fetch('http://localhost:3000/api/denuncias')
        .then(response => response.json());
}

// Função para atualizar denúncia
function atualizarDenuncia(id, denuncia) {
    return fetch(`http://localhost:3000/api/denuncia/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(denuncia)
    })
    .then(response => response.json());
}

// Função para deletar denúncia
function deletarDenuncia(id) {
    return fetch(`http://localhost:3000/api/denuncia/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json());
}

// Função para fazer login
function fazerLogin(loginData) {
    return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json());
}

// Função para fazer cadastro
function fazerCadastro(cadastroData) {
    return fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cadastroData)
    })
    .then(response => response.json());
}

// Função para redefinir senha
function redefinirSenha(token, senha) {
    return fetch(`/api/redefinir_senha/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
    })
    .then(response => response.json());
}

// Função para buscar endereço pelo CEP
function buscarEndereco(cep) {
    return fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json());
}

// Event listener para o campo de CEP
document.getElementById('cep').addEventListener('input', function() {
    const cep = this.value;
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                document.getElementById('bairro').value = data.bairro;
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    }
});

// Event listener para o formulário de denúncia
document.getElementById('denunciaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const denuncia = {
        mensagem: document.getElementById('mensagem').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        bairro: document.getElementById('bairro').value
    };

    // Armazena a denúncia no localStorage temporariamente
    localStorage.setItem('denuncia', JSON.stringify(denuncia));

    // Redireciona para a página de login
    window.location.href = 'login.html';
});

// Gravação de áudio
let mediaRecorder;
let audioChunks = [];

document.getElementById('startRecording').addEventListener('click', async () => {
    try {
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
    } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
    }
});

document.getElementById('stopRecording').addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
    }
});

// Event listener para o formulário de redefinição de senha
document.getElementById('redefinirSenhaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const senha = document.getElementById('senha').value;
    const token = window.location.pathname.split('/').pop();

    const response = await redefinirSenha(token, senha);

    if (response.message === 'Senha redefinida com sucesso!') {
        alert(response.message);
    } else {
        alert('Erro ao redefinir senha');
    }
});

// Event listener para o formulário de cadastro
document.getElementById('cadastroForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
    } else {
        const response = await fazerCadastro({ nome, email, senha });
        alert(response.message);
        window.location.href = 'login.html';
    }
});

// Event listener para o formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        // Fazendo a requisição de login
        const response = await fazerLogin({ email, senha });

        // Verificando a resposta
        if (response.message === 'Login realizado com sucesso!') {
            alert(response.message);

            // Recupera a denúncia do localStorage, se existir
            const denuncia = JSON.parse(localStorage.getItem('denuncia'));

            if (denuncia) {
                // Envia a denúncia para o backend
                try {
                    const data = await enviarDenuncia(denuncia);
                    alert('Denúncia enviada com sucesso!');
                    localStorage.removeItem('denuncia'); // Remove a denúncia do localStorage
                    window.location.href = 'perfil.html'; // Redireciona para a página de perfil
                } catch (error) {
                    console.error('Erro ao enviar denúncia:', error);
                    alert('Erro ao enviar denúncia. Tente novamente mais tarde.');
                }
            } else {
                // Se não houver denúncia, redireciona para o perfil
                window.location.href = 'perfil.html';
            }
        } else {
            alert(response.message || 'Erro ao realizar login');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao realizar login. Tente novamente mais tarde.');
    }
});

// Validação de telefone
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


// perfil

document.addEventListener('DOMContentLoaded', () => {
    carregarDenuncias();

    document.getElementById('logoutButton').addEventListener('click', fazerLogout);

    // Event listener para excluir o card de boas-vindas
    document.querySelector('#welcomeCard .deleteButton').addEventListener('click', function(event) {
        event.stopPropagation();
        document.getElementById('welcomeCard').remove();
    });
});

function obterDenuncias() {
    return fetch('http://localhost:3000/api/denuncias')
        .then(response => response.json());
}

function exibirDenuncias(denuncias) {
    const container = document.getElementById('denunciasContainer');
    container.innerHTML = '';

    denuncias.forEach(denuncia => {
        const denunciaElement = document.createElement('div');
        denunciaElement.className = 'denuncia';
        denunciaElement.innerHTML = `
            <h3>Denúncia #${denuncia.id}</h3>
            <p><strong>Mensagem:</strong> ${denuncia.mensagem}</p>
            <p><strong>CEP:</strong> ${denuncia.cep}</p>
            <p><strong>Rua:</strong> ${denuncia.rua}</p>
            <p><strong>Número:</strong> ${denuncia.numero}</p>
            <p><strong>Cidade:</strong> ${denuncia.cidade}</p>
            <p><strong>Estado:</strong> ${denuncia.estado}</p>
            <p><strong>Bairro:</strong> ${denuncia.bairro}</p>
            <button class="deleteButton" data-id="${denuncia.id}">Excluir</button>
        `;
        denunciaElement.addEventListener('click', () => abrirDetalhesDenuncia(denuncia));
        container.appendChild(denunciaElement);
    });

    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            deletarDenuncia(id)
                .then(() => {
                    alert('Denúncia excluída com sucesso!');
                    carregarDenuncias();
                })
                .catch(error => {
                    console.error('Erro ao excluir denúncia:', error);
                });
        });
    });
}

function deletarDenuncia(id) {
    return fetch(`http://localhost:3000/api/denuncia/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json());
}

function carregarDenuncias() {
    obterDenuncias()
        .then(denuncias => {
            exibirDenuncias(denuncias);
        })
        .catch(error => {
            console.error('Erro ao obter denúncias:', error);
        });
}

function fazerLogout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

function abrirDetalhesDenuncia(denuncia) {
    alert(`Detalhes da denúncia #${denuncia.id}:\n${denuncia.mensagem}`);
}