
const API_URL = 'https://68029a700a99cb7408ea0bf8.mockapi.io/posts';
        

function showSection(sectionId) {
    
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    
    document.getElementById(sectionId).classList.add('active');
    
    
    document.querySelectorAll('.button-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`).classList.add('active');
    
    
    if (sectionId === 'list') {
        loadItems();
    }
}


function loadItems() {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '<div class="loading">Carregando itens...</div>';
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar itens');
            }
            return response.json();
        })
        .then(items => {
            if (items.length === 0) {
                listContainer.innerHTML = '<div class="message">Nenhum item cadastrado ainda.</div>';
                return;
            }
            
            listContainer.innerHTML = '';
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card';
                itemElement.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                    <div class="item-meta">
                        <p><strong>Autor:</strong> ${item.author}</p>
                        <p><strong>ID:</strong> ${item.id} | <strong>Criado em:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                `;
                listContainer.appendChild(itemElement);
            });
        })
        .catch(error => {
            listContainer.innerHTML = `<div class="error">Erro ao carregar itens: ${error.message}</div>`;
        });
}

document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        author: document.getElementById('author').value
    };
    
    const messageDiv = document.getElementById('formMessage');
    messageDiv.style.display = 'none';
    
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar item');
        }
        return response.json();
    })
    .then(data => {
        messageDiv.textContent = `Item criado com sucesso! ID: ${data.id}`;
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';
        
        
        document.getElementById('itemForm').reset();
        
        
        if (document.getElementById('list').classList.contains('active')) {
            loadItems();
        }
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    })
    .catch(error => {
        messageDiv.textContent = `Erro ao criar item: ${error.message}`;
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    });
});


document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('list').classList.contains('active')) {
        loadItems();
    }
});