import { useEffect, useState } from "react";
import "./style.css";

function App() {
  const [activityLists, setActivityLists] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [draggedActivity, setDraggedActivity] = useState(null);

  const [scheduleName, setScheduleName] = useState("");
  const [startTime, setStartTime] = useState(480);
  const [endTime, setEndTime] = useState(840);
  const [interval, setIntervalValue] = useState(60);

  const [listName, setListName] = useState("");

  // ================= API =================
  const loadData = async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      setActivityLists(data.activityLists || []);
      setSchedules(data.schedules || []);
    } catch (e) {
      console.error(e);
    }
  };

  const saveData = async (lists, scheds) => {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityLists: lists, schedules: scheds }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= HELPERS =================
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${String(m).padStart(2, "0")}`;
  };

  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeOptions.push(h * 60 + m);
    }
  }

  // ================= LISTS =================
  const addList = () => {
    if (!listName.trim()) return;

    const newLists = [
      ...activityLists,
      { id: Date.now(), name: listName, activities: [] },
    ];

    setActivityLists(newLists);
    setListName("");
    saveData(newLists, schedules);
  };

  const addActivity = (listId, name) => {
    if (!name.trim()) return;

    const newLists = activityLists.map((l) =>
      l.id === listId
        ? {
            ...l,
            activities: [...l.activities, { id: Date.now(), name }],
          }
        : l
    );

    setActivityLists(newLists);
    saveData(newLists, schedules);
  };

  // ================= SCHEDULES =================
  const addSchedule = () => {
    if (!scheduleName.trim()) return;

    const newSchedule = {
      id: Date.now(),
      name: scheduleName,
      startTime,
      endTime,
      interval,
      slots: [],
    };

    let current = startTime;

    while (current < endTime) {
      const next = current + interval;
      newSchedule.slots.push({
        id: Date.now() + current,
        startTime: current,
        endTime: next,
        activity: null,
      });
      current = next;
    }

    const newSchedules = [...schedules, newSchedule];

    setSchedules(newSchedules);
    setScheduleName("");
    saveData(activityLists, newSchedules);
  };

  const deleteSchedule = (id) => {
    const newSchedules = schedules.filter((s) => s.id !== id);
    setSchedules(newSchedules);
    saveData(activityLists, newSchedules);
  };

  // ================= DRAG & DROP =================
  const handleDragStart = (activity) => {
    setDraggedActivity(activity);
  };

  const handleDrop = (scheduleId, slotId) => {
    if (!draggedActivity) return;

    const newSchedules = schedules.map((s) => {
      if (s.id !== scheduleId) return s;

      return {
        ...s,
        slots: s.slots.map((slot) =>
          slot.id === slotId
            ? { ...slot, activity: draggedActivity.name }
            : slot
        ),
      };
    });

    setSchedules(newSchedules);
    saveData(activityLists, newSchedules);
  };

  // ================= UI =================
  return (
    <div className="container">
      <h1>Activity Scheduler</h1>

      {/* CONTROLS */}
      <div className="controls">
        <input
          value={scheduleName}
          onChange={(e) => setScheduleName(e.target.value)}
          placeholder="Schedule name"
        />

        <select value={startTime} onChange={(e) => setStartTime(+e.target.value)}>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{formatTime(t)}</option>
          ))}
        </select>

        <select value={endTime} onChange={(e) => setEndTime(+e.target.value)}>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{formatTime(t)}</option>
          ))}
        </select>

        <input
          type="number"
          value={interval}
          onChange={(e) => setIntervalValue(+e.target.value)}
        />

        <button onClick={addSchedule}>Add Schedule</button>
      </div>

      <div className="main-content">
        {/* ACTIVITIES */}
        <div className="activities-panel">
          <input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="List name"
          />
          <button onClick={addList}>Add List</button>

          {activityLists.map((list) => (
            <div key={list.id}>
              <h4>{list.name}</h4>

              <input
                placeholder="Add activity"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addActivity(list.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />

              {list.activities.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={() => handleDragStart(a)}
                  className="activity"
                >
                  {a.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* SCHEDULES */}
        <div className="schedule-panel">
          <h3>Schedules</h3>

          {schedules.map((s) => (
            <div key={s.id} className="schedule-item">
              <strong>{s.name}</strong>
              <button onClick={() => deleteSchedule(s.id)}>Delete</button>

              <div className="schedule-slots">
                {s.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="time-slot"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(s.id, slot.id)}
                  >
                    <span>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>

                    {slot.activity && (
                      <div className="activity-assigned">
                        {slot.activity}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;