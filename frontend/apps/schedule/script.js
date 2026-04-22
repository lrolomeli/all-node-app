let draggedElement = null;
let activityLists = [];
let schedules = [];

// Load data from server
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
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
    try {
        await fetch('/api/data', {
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
    
    // Generate time slots
    let currentTime = startTime;
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
