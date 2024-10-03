// Adicionar e Remover Item (Tarefa)
function initializeList(container, listId) {
    const button = container.querySelector('.button-add-task');
    const input = container.querySelector('.input-task');
    const listaCompleta = container.querySelector('.list-tasks');
    
    let minhaListaItens = [];

    function adicionarNovaTarefa() {
        if (input.value.trim() === '') {
            alert('Por favor, adicione uma tarefa!');
            return;
        }

        minhaListaItens.push({
            tarefa: input.value,
            concluido: false
        });

        input.value = '';
        mostrarTarefa();
    }

    function mostrarTarefa() {
        let novaLi = '';

        minhaListaItens.forEach((item, posicao) => {
            novaLi += `
                <li class="task ${item.concluido ? 'done' : ''}">
                    <img src="img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa${listId}(${posicao})">
                    <p id="tarefa-text-${listId}-${posicao}">${item.tarefa}</p>
                    <img src="img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem${listId}(${posicao})">
                    <button class="edit-btn" onclick="editarTarefa${listId}(${posicao})">Editar</button>
                </li>
            `;
        });

        listaCompleta.innerHTML = novaLi;
        localStorage.setItem(`Lista-${listId}`, JSON.stringify(minhaListaItens));
    }

    window[`concluirTarefa${listId}`] = function(posicao) {
        minhaListaItens[posicao].concluido = !minhaListaItens[posicao].concluido;
        mostrarTarefa();
    };

    window[`deletarItem${listId}`] = function(posicao) {
        minhaListaItens.splice(posicao, 1);
        mostrarTarefa();
    };

    window[`editarTarefa${listId}`] = function(posicao) {
        const tarefaText = document.getElementById(`tarefa-text-${listId}-${posicao}`);
        const tarefaAntiga = minhaListaItens[posicao].tarefa;

        tarefaText.innerHTML = `<input class="edit-input" id="edit-input-${listId}-${posicao}" value="${tarefaAntiga}">`;

        const editInput = document.getElementById(`edit-input-${listId}-${posicao}`);
        editInput.focus();

        editInput.addEventListener('blur', () => salvarEdicao(posicao, editInput.value));
        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                salvarEdicao(posicao, editInput.value);
            }
        });
    };

    function salvarEdicao(posicao, novaTarefa) {
        if (novaTarefa.trim() === '') {
            alert('O campo não pode estar vazio!');
            return;
        }

        minhaListaItens[posicao].tarefa = novaTarefa;
        mostrarTarefa();
    }

    function recarregarTarefas() {
        const tarefasDoLocalStorage = localStorage.getItem(`Lista-${listId}`);
        if (tarefasDoLocalStorage) {
            minhaListaItens = JSON.parse(tarefasDoLocalStorage);
            mostrarTarefa();
        }
    }

    recarregarTarefas();
    button.addEventListener('click', adicionarNovaTarefa);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            adicionarNovaTarefa();
        }
    });
}
