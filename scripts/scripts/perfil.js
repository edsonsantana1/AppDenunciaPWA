document.addEventListener('DOMContentLoaded', function() {
    // Exemplo de dados de denúncias
    const denuncias = [
        { mensagem: 'Denúncia 1', cep: '12345678', rua: 'Rua A', numero: '123', cidade: 'Cidade A', estado: 'Estado A', data: '2025-03-08', hora: '10:00', arquivo: 'path/to/media1.jpg' },
        { mensagem: 'Denúncia 2', cep: '87654321', rua: 'Rua B', numero: '456', cidade: 'Cidade B', estado: 'Estado B', data: '2025-03-07', hora: '14:30', arquivo: 'path/to/media2.mp4' }
    ];

    const denunciasDiv = document.getElementById('denuncias');
    denuncias.forEach(denuncia => {
        const denunciaElement = document.createElement('div');
        denunciaElement.classList.add('denuncia-bloco');
        denunciaElement.innerHTML = `
            <p><strong>Mensagem:</strong> ${denuncia.mensagem}</p>
            <p><strong>CEP:</strong> ${denuncia.cep}</p>
            <p><strong>Rua:</strong> ${denuncia.rua}</p>
            <p><strong>Número:</strong> ${denuncia.numero}</p>
            <p><strong>Cidade:</strong> ${denuncia.cidade}</p>
            <p><strong>Estado:</strong> ${denuncia.estado}</p>
            <p><strong>Data:</strong> ${denuncia.data}</p>
            <p><strong>Hora:</strong> ${denuncia.hora}</p>
            <p><strong>Arquivo:</strong> <a href="${denuncia.arquivo}" download>Baixar Comprovante</a></p>
            <button onclick="excluirDenuncia('${denuncia.mensagem}')">Excluir</button>
            <hr>
        `;
        denunciasDiv.appendChild(denunciaElement);
    });

    function excluirDenuncia(mensagem) {
        if (confirm(`Tem certeza que deseja excluir a denúncia: ${mensagem}?`)) {
            alert(`Denúncia excluída: ${mensagem}`);
            // Lógica para excluir a denúncia
        }
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    // Lógica para sair da conta
    alert('Você saiu da conta!');
    // Redirecionar para a página inicial
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', function() {
    // Função para excluir card com confirmação
    function deleteCard(event) {
        event.stopPropagation(); // Impede que o clique no botão de exclusão abra o card
        const card = event.target.closest('.card');
        if (confirm('Deseja realmente excluir esta denúncia?')) {
            card.remove();
        }
    }

    // Função para alternar a visibilidade das informações adicionais
    function toggleCardDetails(event) {
        const card = event.currentTarget;
        card.classList.toggle('open');
    }

    // Função para criar um novo card de denúncia
    function createCard(title, description, details) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="card-details">
                <p>${details}</p>
            </div>
            <button class="deleteButton"><img src="icons/trash-icon.png" alt="Excluir"></button>
        `;
        card.addEventListener('click', toggleCardDetails);
        card.querySelector('.deleteButton').addEventListener('click', deleteCard);
        document.getElementById('denuncias').appendChild(card);
    }

    // Adiciona evento de clique aos botões de exclusão existentes
    document.querySelectorAll('.deleteButton').forEach(button => {
        button.addEventListener('click', deleteCard);
    });

    // Adiciona evento de clique aos cards existentes
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', toggleCardDetails);
    });

    // Função para logout
    document.getElementById('logoutButton').addEventListener('click', function() {
        alert('Você saiu da conta!');
        window.location.href = 'index.html';
    });

    // Exemplo de criação de novos cards de denúncia
    createCard('Denúncia 2', 'Descrição da denúncia 2...', 'Mais informações sobre a denúncia 2...');
    createCard('Denúncia 3', 'Descrição da denúncia 3...', 'Mais informações sobre a denúncia 3...');
});