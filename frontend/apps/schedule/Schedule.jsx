import { useEffect, useState } from "react";
import { useAuth } from "../../src/useAuth.js";
import "./style.css";

function App() {
  const { checking } = useAuth();
  const [activityLists, setActivityLists] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const [scheduleName, setScheduleName] = useState("");
  const [startTime, setStartTime] = useState(480);
  const [endTime, setEndTime] = useState(840);
  const [interval, setIntervalValue] = useState(60);
  const [listName, setListName] = useState("");
  const [editingActivity, setEditingActivity] = useState(null);
  const [draggedFromSlot, setDraggedFromSlot] = useState(null);
  const [collapsedLists, setCollapsedLists] = useState(new Set());
  const [collapsedSchedules, setCollapsedSchedules] = useState(new Set());

  const toggleList = (id) => setCollapsedLists((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleSchedule = (id) => setCollapsedSchedules((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  // ── API ──
  const loadData = async () => {
    try {
      const res = await fetch("/api/schedule", { credentials: "include" });
      const data = await res.json();
      setActivityLists(data.activityLists || []);
      setSchedules(data.schedules || []);
    } catch (e) {
      console.error(e);
    }
  };

  const saveData = async (lists, scheds) => {
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ activityLists: lists, schedules: scheds }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`[schedule] save failed ${res.status}:`, text);
      }
    } catch (e) {
      console.error("[schedule] save error:", e);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ── Helpers ──
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

  // ── Lists ──
  const addList = () => {
    if (!listName.trim()) return;
    const newLists = [...activityLists, { id: Date.now(), name: listName, activities: [] }];
    setActivityLists(newLists);
    setListName("");
    saveData(newLists, schedules);
  };

  const addActivity = (listId, name) => {
    if (!name.trim()) return;
    const newLists = activityLists.map((l) =>
      l.id === listId
        ? { ...l, activities: [...l.activities, { id: Date.now(), name }] }
        : l
    );
    setActivityLists(newLists);
    saveData(newLists, schedules);
  };

  const deleteList = (listId) => {
    const newLists = activityLists.filter((l) => l.id !== listId);
    setActivityLists(newLists);
    saveData(newLists, schedules);
  };

  const deleteActivity = (listId, activityId) => {
    const newLists = activityLists.map((l) =>
      l.id === listId
        ? { ...l, activities: l.activities.filter((a) => a.id !== activityId) }
        : l
    );
    setActivityLists(newLists);
    saveData(newLists, schedules);
  };

  const updateActivity = (listId, activityId, newName) => {
    if (!newName.trim()) return;
    const newLists = activityLists.map((l) =>
      l.id === listId
        ? { ...l, activities: l.activities.map((a) => a.id === activityId ? { ...a, name: newName.trim() } : a) }
        : l
    );
    setActivityLists(newLists);
    saveData(newLists, schedules);
  };

  // ── Schedules ──
  const addSchedule = () => {
    if (!scheduleName.trim()) return;
    const newSchedule = { id: Date.now(), name: scheduleName, startTime, endTime, interval, slots: [] };
    let current = startTime;
    while (current < endTime) {
      const next = current + interval;
      newSchedule.slots.push({ id: Date.now() + current, startTime: current, endTime: next, activity: null });
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

  // ── Drag & Drop ──
  const handleDrop = (scheduleId, slotId) => {
    if (!draggedActivity) return;

    let newSchedules = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      return { ...s, slots: s.slots.map((slot) => slot.id === slotId ? { ...slot, activity: draggedActivity.name } : slot) };
    });

    if (draggedFromSlot) {
      newSchedules = newSchedules.map((s) => {
        if (s.id !== draggedFromSlot.scheduleId) return s;
        return { ...s, slots: s.slots.map((slot) => slot.id === draggedFromSlot.slotId ? { ...slot, activity: null } : slot) };
      });
    }

    setSchedules(newSchedules);
    setDragOverSlot(null);
    setDraggedFromSlot(null);
    saveData(activityLists, newSchedules);
  };

  const clearSlot = (scheduleId, slotId) => {
    const newSchedules = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      return { ...s, slots: s.slots.map((slot) => slot.id === slotId ? { ...slot, activity: null } : slot) };
    });
    setSchedules(newSchedules);
    saveData(activityLists, newSchedules);
  };

  if (checking) return null;

  return (
    <div className="container">
      <header className="app-header">
        <a href="/" className="btn-home">← Home</a>
        <h1>Activity Scheduler</h1>
      </header>

      {/* Create schedule */}
      <div className="card">
        <p className="card-title">New Schedule</p>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="sched-name">Name</label>
            <input
              id="sched-name"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="e.g. Monday routine"
              onKeyDown={(e) => e.key === "Enter" && addSchedule()}
            />
          </div>
          <div className="field">
            <label htmlFor="sched-start">Start</label>
            <select id="sched-start" value={startTime} onChange={(e) => setStartTime(+e.target.value)}>
              {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sched-end">End</label>
            <select id="sched-end" value={endTime} onChange={(e) => setEndTime(+e.target.value)}>
              {timeOptions.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sched-interval">Interval (min)</label>
            <input
              id="sched-interval"
              type="number"
              value={interval}
              min={5}
              max={240}
              onChange={(e) => setIntervalValue(+e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={addSchedule}>+ Create Schedule</button>
      </div>

      <div className="workspace">
        {/* Activities panel */}
        <div className="card">
          <p className="card-title">Activities</p>
          <div className="add-list-row">
            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name"
              onKeyDown={(e) => e.key === "Enter" && addList()}
            />
            <button className="btn btn-success btn-sm" onClick={addList}>Add</button>
          </div>

          {activityLists.length === 0 && (
            <p className="empty-state">No lists yet. Create one above.</p>
          )}

          {activityLists.map((list) => (
            <div key={list.id} className="activity-list-group">
              <div className="list-group-header">
                <button className="icon-btn collapse-btn" onClick={() => toggleList(list.id)} title="Toggle">
                  {collapsedLists.has(list.id) ? "▶" : "▼"}
                </button>
                <h4>{list.name}</h4>
                <button
                  className="icon-btn icon-btn--danger"
                  onClick={() => deleteList(list.id)}
                  title="Delete list"
                >×</button>
              </div>
              {!collapsedLists.has(list.id) && (
                <>
                  <input
                    className="add-activity-input"
                    placeholder="Add activity (Enter)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addActivity(list.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="activities-list">
                    {list.activities.map((a) =>
                      editingActivity?.activityId === a.id ? (
                        <div key={a.id} className="activity activity--editing">
                          <input
                            className="activity-edit-input"
                            autoFocus
                            defaultValue={a.name}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { updateActivity(list.id, a.id, e.target.value); setEditingActivity(null); }
                              if (e.key === "Escape") setEditingActivity(null);
                            }}
                            onBlur={(e) => { updateActivity(list.id, a.id, e.target.value); setEditingActivity(null); }}
                          />
                        </div>
                      ) : (
                        <div
                          key={a.id}
                          draggable
                          onDragStart={() => setDraggedActivity(a)}
                          onDragEnd={() => setDraggedActivity(null)}
                          className="activity"
                        >
                          <span className="activity-name">{a.name}</span>
                          <div className="activity-actions">
                            <button
                              className="icon-btn"
                              onClick={() => setEditingActivity({ listId: list.id, activityId: a.id })}
                              title="Edit"
                            >✎</button>
                            <button
                              className="icon-btn icon-btn--danger"
                              onClick={() => deleteActivity(list.id, a.id)}
                              title="Delete"
                            >×</button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Schedules panel */}
        <div>
          {schedules.length === 0 && (
            <div className="card">
              <p className="empty-state">No schedules yet. Create one above.</p>
            </div>
          )}

          {schedules.map((s) => (
            <div key={s.id} className="schedule-item">
              <div className="schedule-header">
                <button className="icon-btn collapse-btn" onClick={() => toggleSchedule(s.id)} title="Toggle">
                  {collapsedSchedules.has(s.id) ? "▶" : "▼"}
                </button>
                <strong>{s.name}</strong>
                <button className="btn btn-danger" onClick={() => deleteSchedule(s.id)}>Delete</button>
              </div>
              {!collapsedSchedules.has(s.id) && <div className="schedule-slots">
                {s.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`time-slot${dragOverSlot === slot.id ? " drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOverSlot(slot.id); }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={() => handleDrop(s.id, slot.id)}
                  >
                    <span className="time-label">
                      {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    </span>
                    {slot.activity ? (
                      <div
                        className="activity-assigned"
                        draggable
                        onDragStart={() => {
                          setDraggedActivity({ name: slot.activity });
                          setDraggedFromSlot({ scheduleId: s.id, slotId: slot.id });
                        }}
                        onDragEnd={() => { setDraggedActivity(null); setDraggedFromSlot(null); }}
                      >
                        <span>{slot.activity}</span>
                        <button
                          className="icon-btn icon-btn--light"
                          onClick={() => clearSlot(s.id, slot.id)}
                          title="Remove"
                        >×</button>
                      </div>
                    ) : (
                      <span className="empty-slot">Drop here</span>
                    )}
                  </div>
                ))}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
