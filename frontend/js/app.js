// Drag & Drop Logic for Kanban Board
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    setTimeout(() => { ev.target.style.opacity = '0.4'; }, 0);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    draggedElement.style.opacity = '1';
    
    // Allow dropping on the column directly or on a card within the column
    let targetColumn = ev.target;
    if(!targetColumn.classList.contains('column')) {
        targetColumn = targetColumn.closest('.column');
    }
    
    if(targetColumn && targetColumn.classList.contains('column')) {
        targetColumn.appendChild(draggedElement);
        console.log(`[Action] Moved task "${data}" to column "${targetColumn.id}"`);
    }
}

// Add event listeners for end drag to restore opacity
document.addEventListener('dragend', (ev) => {
    if(ev.target.classList.contains('task-card')) {
        ev.target.style.opacity = '1';
    }
});

// Mock AI Breakdown Logic
function triggerAIBreakdown() {
    const todoColumn = document.getElementById('todo');
    const taskId = 'task-' + Math.floor(Math.random() * 10000);
    
    const newTask = document.createElement('div');
    newTask.className = 'task-card';
    newTask.draggable = true;
    newTask.id = taskId;
    newTask.ondragstart = drag;
    
    newTask.innerHTML = `
        <h4>Thiết kế giao diện bằng AI</h4>
        <p>Sử dụng AI để sinh Wireframe & Component Layout.</p>
        <div class="tags">
            <span class="tag tag-ai">✨ AI Generated</span>
            <span class="tag">UI/UX</span>
        </div>
    `;
    
    todoColumn.appendChild(newTask);
    alert('AI đã phân tách và thêm 1 tác vụ mới vào cột To Do!');
}
