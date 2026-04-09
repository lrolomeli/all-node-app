let draggedElement = null;
let activityLists = [];
let schedules = [];

// Load data from server
async function loadData() {
    try {
        // aqui al parecer esta obteniendo datos de la ruta api/data
        // pero no encuentro dicha ruta
        const response = await fetch('/api/data');
        // despues se obtienen los datos igualmente esperando a que el sistema haya terminado de enviar la informacion
        // como un tipo de callback interrupcion donde me indica solamente cuando este lista la info
        const data = await response.json();
        // esta linea no conozco como funciona me imagino que devolvera una u otra
        // pareciera una comparacion bit a bit de tipo or
        // sin embargo eso se haria de la siguiente manera res_var = X_var | Y_var.
        // en lenguaje C para comprobar que dos cosas son positivas se hace asi if(X_var && Y_var)
        // or if(X_var || Y_var) si cualquiera de las dos sentencias devuelven verdadero entonces
        // el resultado es verdadero y de lo contrario es falso.
        // en este caso la lista vacia o brackets probablemente devuelva falso y la respuesta sea
        // siempre falso por lo que intuyo que puede tratarse de otra cosa.
        // por ejemplo si la primer sentencia esta vacia mejor devuelve un elemento vacio en lugar de un error.
        // o algo por el estilo.
        // al parecer ya se lo que pasa se esta recibiendo el objeto data que es donde se encuentra la informacion
        // que guardamos en nuestra base de datos.
        activityLists = data.activityLists || [];
        schedules = data.schedules || [];
        console.log('Loaded schedules:', schedules.length);
        renderSchedules();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Save data to server
async function saveData() {
    // me imagino que esta haciendo uso de una api que 
    // la cual a su vez hace uso del metodo post
    // para la auth necesita el header
    // necesito repasar el apartado del curso de autenticacion
    // json stringify convierte el objeto de javascript en un formato para enviar serializado
    // no entiendo para que enviar las actividades de la lista o los horarios
    // porque no solamente autenticar y entonces permitir que se envien todo tipo de datos
    
    try {
        await pinAuth.authenticatedFetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activityLists, schedules })
        });
    } catch (error) {
        console.error('Failed to save data:', error);
    }
}

function populateTimeSelects() {
    const startSelect = document.getElementById('startTime');
    const endSelect = document.getElementById('endTime');
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            const timeValue = hour * 60 + min;
            const timeText = formatTime(timeValue);
            
            const startOption = new Option(timeText, timeValue);
            const endOption = new Option(timeText, timeValue);
            
            if (timeValue === 480) startOption.selected = true; // 8:00
            if (timeValue === 840) endOption.selected = true; // 14:00
            
            startSelect.appendChild(startOption);
            endSelect.appendChild(endOption);
        }
    }
}

function addSchedule() {
    // obteniendo los valores del documento web. en este caso el nombre que le daras al horario
    const scheduleName = document.getElementById('scheduleName').value.trim();
    const startTime = parseInt(document.getElementById('startTime').value);
    const endTime = parseInt(document.getElementById('endTime').value);
    const interval = parseInt(document.getElementById('interval').value);
    
    if (!scheduleName) {
        alert('Please enter a schedule name');
        return;
    }
    
    const schedule = {
        id: Date.now(),
        name: scheduleName,
        startTime,
        endTime,
        interval,
        slots: []
    };
    // se crea un objeto de js que despues sera guardado en formato json
    
    // Generate time slots
    let currentTime = startTime;
    // se divide el tiempo en slots del tiempo que se especifico
    while (currentTime < endTime) {
        const nextTime = currentTime + interval;
        schedule.slots.push({
            id: Date.now() + currentTime,
            startTime: currentTime,
            endTime: nextTime,
            activity: null
        });
        currentTime = nextTime;
    }
    
    // ahora se anade el horario en los horarios guardados en ...
    schedules.push(schedule);
    document.getElementById('scheduleName').value = '';
    renderSchedules();
    saveData();
}

function deleteSchedule(scheduleId) {
    schedules = schedules.filter(s => s.id !== scheduleId);
    renderSchedules();
    saveData();
    renderSchedules();
}

function renderSchedules() {
    const container = document.getElementById('schedules');
    console.log('Rendering schedules:', schedules.length, 'Container:', container);
    
    if (!container) {
        console.error('Schedules container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    schedules.forEach(schedule => {
        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule-item';
        
        scheduleDiv.innerHTML = `
            <div class="schedule-header">
                <span class="schedule-title">${schedule.name}</span>
                <button class="delete-schedule" onclick="deleteSchedule(${schedule.id})">Delete</button>
            </div>
            <div class="schedule-slots">
                ${schedule.slots.map(slot => `
                    <div class="time-slot" data-schedule="${schedule.id}" data-slot="${slot.id}">
                        <span class="time-label">${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</span>
                        ${slot.activity ? `<div class="activity-assigned">${slot.activity}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(scheduleDiv);
    });
    
    setupScheduleDragAndDrop();
}

function setupScheduleDragAndDrop() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
        slot.addEventListener('dragleave', handleDragLeave);
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function addList() {
    const listName = document.getElementById('newListName').value.trim();
    if (!listName) return;
    
    const listId = Date.now();
    activityLists.push({ id: listId, name: listName, activities: [] });
    
    document.getElementById('newListName').value = '';
    renderLists();
    saveData();
}

function addActivity(listId) {
    const input = document.querySelector(`[data-list="${listId}"] .add-activity input`);
    const activityName = input.value.trim();
    if (!activityName) return;
    
    const list = activityLists.find(l => l.id === listId);
    list.activities.push({ id: Date.now(), name: activityName });
    
    input.value = '';
    renderLists();
    saveData();
}

function editActivity(listId, activityId) {
    const list = activityLists.find(l => l.id === listId);
    const activity = list.activities.find(a => a.id === activityId);
    const newName = prompt('Edit activity:', activity.name);
    
    if (newName && newName.trim()) {
        activity.name = newName.trim();
        renderLists();
        saveData();
    }
}

function deleteActivity(listId, activityId) {
    const list = activityLists.find(l => l.id === listId);
    list.activities = list.activities.filter(a => a.id !== activityId);
    renderLists();
    saveData();
}

function renderLists() {
    const container = document.getElementById('activityLists');
    container.innerHTML = '';
    
    activityLists.forEach(list => {
        const listDiv = document.createElement('div');
        listDiv.className = 'activity-list';
        listDiv.dataset.list = list.id;
        
        listDiv.innerHTML = `
            <div class="list-header">
                <span class="list-title">${list.name}</span>
            </div>
            <div class="add-activity">
                <input type="text" placeholder="Add activity">
                <button onclick="addActivity(${list.id})">Add</button>
            </div>
            <div class="activities-list">
                ${list.activities.map(activity => `
                    <div class="activity" draggable="true" data-activity="${activity.id}" data-list="${list.id}">
                        ${activity.name}
                        <button class="edit-btn" onclick="editActivity(${list.id}, ${activity.id})">✏️</button>
                        <button class="delete-btn" onclick="deleteActivity(${list.id}, ${activity.id})">❌</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(listDiv);
    });
    
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const activities = document.querySelectorAll('.activity');
    
    activities.forEach(activity => {
        activity.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
        });
        
        activity.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            draggedElement = null;
        });
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const timeSlot = e.currentTarget;
    timeSlot.classList.remove('drag-over');
    
    if (draggedElement) {
        const scheduleId = parseInt(timeSlot.dataset.schedule);
        const slotId = parseInt(timeSlot.dataset.slot);
        const activityName = draggedElement.textContent.replace('✏️❌', '');
        
        // Update schedule data
        const schedule = schedules.find(s => s.id === scheduleId);
        const slot = schedule.slots.find(s => s.id === slotId);
        slot.activity = activityName;
        
        // Update UI
        const existingActivity = timeSlot.querySelector('.activity-assigned');
        if (existingActivity) {
            existingActivity.remove();
        }
        
        const activityDiv = document.createElement('div');
        activityDiv.className = 'activity-assigned';
        activityDiv.textContent = activityName;
        timeSlot.appendChild(activityDiv);
        
        // Save changes
        saveData();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    populateTimeSelects();
    
    // Load data first
    await loadData();
    
    // If no activity lists exist, create default one
    if (activityLists.length === 0) {
        activityLists.push({
            id: 1,
            name: 'Activities',
            activities: [
                { id: 1, name: 'Study' },
                { id: 2, name: 'Exercise' },
                { id: 3, name: 'Meeting' },
                { id: 4, name: 'Break' },
                { id: 5, name: 'Lunch' }
            ]
        });
        await saveData();
    }
    
    renderLists();
});
