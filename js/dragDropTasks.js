// dragDropTasks.js

document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('.list-tasks');

    containers.forEach(container => {
        addDragAndDropListeners(container);
    });

    function addDragAndDropListeners(container) {
        const tasks = container.querySelectorAll('.task');

        tasks.forEach(task => {
            let isDragging = false;

            // Duplo clique para ativar o modo de arrastar
            task.addEventListener('dblclick', function () {
                isDragging = true;
                task.draggable = true; // Ativa o arraste
                task.classList.add('drag-ready');
            });

            // Ou segurar o mouse para ativar o modo de arrastar
            task.addEventListener('mousedown', function (event) {
                setTimeout(function () {
                    if (event.buttons === 1) { // Certifica que o botão esquerdo do mouse está pressionado
                        isDragging = true;
                        task.draggable = true;
                        task.classList.add('drag-ready');
                    }
                }, 500); // Aguarda meio segundo para ativar o modo de arraste
            });

            task.addEventListener('dragstart', function (event) {
                if (isDragging) {
                    event.target.classList.add('dragging');
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', event.target.dataset.position);
                }
            });

            task.addEventListener('dragend', function (event) {
                event.target.classList.remove('dragging', 'drag-ready');
                task.draggable = false; // Desativa o arraste após concluir
                isDragging = false;
            });
        });

        container.addEventListener('dragover', function (event) {
            event.preventDefault();
            const afterElement = getDragAfterElement(container, event.clientY);
            const dragging = container.querySelector('.dragging');

            if (afterElement == null) {
                container.appendChild(dragging);
            } else {
                container.insertBefore(dragging, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }
});
