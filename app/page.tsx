"use client";

import { useEffect, useMemo, useState } from "react";

type FieldType = "lifting" | "time";

type Exercise = {
  name: string;
  prescription: string;
  notes?: string;
  fieldType: FieldType;
};

type WorkoutDay = {
  title: string;
  type: string;
  exercises: Exercise[];
};

type LogEntry = {
  weight: string;
  repsOrTime: string;
  notes: string;
};

type SavedWorkout = {
  id: string;
  date: string;
  day: string;
  title: string;
  entries: {
    exercise: string;
    prescription: string;
    fieldType: FieldType;
    weight: string;
    repsOrTime: string;
    notes: string;
  }[];
};

const workouts: Record<string, WorkoutDay> = {
  Monday: {
    title: "Power & Max Effort Upper Body",
    type: "Training Day",
    exercises: [
      { name: "Dynamic Warmup", prescription: "Complete before workout", fieldType: "time" },
      { name: "Kneeling Med Ball Chest Pass Into Wall", prescription: "3 x 5", fieldType: "lifting" },
      { name: "Isometric Shoulder Y-W-T On Bench", prescription: "3 x 15 seconds each position", fieldType: "time" },
      { name: "Barbell Bench Press", prescription: "Work up to 5 x 1 at 90% 1RM", notes: "Last set perform 10+ reps", fieldType: "lifting" },
      { name: "Strip Set Chain Push Ups", prescription: "2 sets", notes: "4 chains x10 • 3 chains x8 • 2 chains x6 • 1 chain x4 • Bodyweight max reps", fieldType: "lifting" },
      { name: "Standing Hand Over Hand Rope Pull w/ Sled", prescription: "3 timed sets", fieldType: "time" },
      { name: "Band Face Pulls", prescription: "3 x 15", fieldType: "lifting" },
      { name: "DeFranco Shoulder Shocker", prescription: "2-3 rounds of 8 each variation", fieldType: "lifting" },
      { name: "Thick Rope Curls w/ 70 lb KB", prescription: "3 x 10", fieldType: "lifting" },
      { name: "Band Triceps Pushdown", prescription: "3 x 100 total reps", notes: "Use light/moderate band", fieldType: "lifting" },
    ],
  },
  Tuesday: {
    title: "Power & Dynamic Effort Lower Body",
    type: "Training Day",
    exercises: [
      { name: "Dynamic Warmup", prescription: "Complete before workout", fieldType: "time" },
      { name: "MB Chest Throw Into Sprint", prescription: "6 x 10-15 yards", fieldType: "time" },
      { name: "Push Up Into Sprint", prescription: "6 x 10-15 yards", fieldType: "time" },
      { name: "Kneeling Jump Into Box Jump", prescription: "6 x 3", notes: "Start at 30 inches and increase box height each set", fieldType: "lifting" },
      { name: "Barbell Dynamic Box Squat w/ Chains", prescription: "8 x 3 at 70% 1RM", fieldType: "lifting" },
      { name: "Double KB Swing", prescription: "4 x 12", fieldType: "lifting" },
      { name: "KB Get Up - First Movement", prescription: "3 x 10 each side", fieldType: "lifting" },
      { name: "Plate Pinches - 45 lb Bumper Plate", prescription: "3 x 30-60 seconds", fieldType: "time" },
      { name: "Manual Neck", prescription: "3 x 10 each position", fieldType: "lifting" },
    ],
  },
  Wednesday: {
    title: "Rest Day",
    type: "Recovery",
    exercises: [
      { name: "Rest Day", prescription: "Recovery", fieldType: "time" },
    ],
  },
  Thursday: {
    title: "Repetition Effort Upper Body",
    type: "Training Day",
    exercises: [
      { name: "Dynamic Warmup", prescription: "Complete before workout", fieldType: "time" },
      { name: "Explosive Push Up Onto Boxes", prescription: "5 x 5", fieldType: "lifting" },
      { name: "Band Pull Apart", prescription: "5 x 10", fieldType: "lifting" },
      { name: "DB Incline Bench With 5-Second Negative", prescription: "4 x 6", fieldType: "lifting" },
      { name: "Fat Bar Lat Pulldown w/ Pause", prescription: "4 x 12", fieldType: "lifting" },
      { name: "Incline DB Reverse Fly", prescription: "4 x 15", fieldType: "lifting" },
      { name: "1-Arm DB Row w/ Fat Gripz", prescription: "3 x 8 each arm", fieldType: "lifting" },
      { name: "Towel Barbell Shrugs", prescription: "3 x 10", fieldType: "lifting" },
      { name: "Plank w/ Tricep Lockout", prescription: "3 x 10", fieldType: "lifting" },
    ],
  },
  Friday: {
    title: "Power & Max Effort Lower Body",
    type: "Training Day",
    exercises: [
      { name: "Dynamic Warmup", prescription: "Complete before workout", fieldType: "time" },
      { name: "Sled Resisted Sprints", prescription: "6 x 10-15 yards", fieldType: "time" },
      { name: "Mountain Climber Into Sprint", prescription: "6 x 10-15 yards", fieldType: "time" },
      { name: "Kneeling Jump Into Broad Jump", prescription: "6 x 3", notes: "Measure distance of each jump and aim to get farther each set", fieldType: "lifting" },
      { name: "Trap Bar Deadlift", prescription: "Work up to 3 x 3 at 85% 1RM", fieldType: "lifting" },
      { name: "2-KB Front Squat", prescription: "4 x 10", fieldType: "lifting" },
      { name: "Ab Wheel Roll Out", prescription: "3 x 10", fieldType: "lifting" },
      { name: "Fat Bar Hold w/ 185 lbs", prescription: "3 x as long as possible", fieldType: "time" },
    ],
  },
  Saturday: {
    title: "Walk & Stretch",
    type: "Recovery",
    exercises: [
      { name: "Walk", prescription: "1 hour", fieldType: "time" },
      { name: "Stretch", prescription: "Full body stretch", fieldType: "time" },
    ],
  },
  Sunday: {
    title: "Recovery Walk & Massage",
    type: "Recovery",
    exercises: [
      { name: "Walk", prescription: "1 hour", fieldType: "time" },
      { name: "Full Body Massage", prescription: "Recovery session", fieldType: "time" },
      { name: "Foam Roller", prescription: "Full body", fieldType: "time" },
      { name: "Theragun", prescription: "Full body", fieldType: "time" },
    ],
  },
};

const days = Object.keys(workouts);

function getTodayDay() {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return workouts[day] ? day : "Monday";
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function Page() {
  const [selectedDay, setSelectedDay] = useState(getTodayDay());
  const [date, setDate] = useState(getTodayDate());
  const [logs, setLogs] = useState<Record<string, LogEntry>>({});
  const [history, setHistory] = useState<SavedWorkout[]>([]);

  const workout = workouts[selectedDay];

  useEffect(() => {
    const saved = localStorage.getItem("patrick-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const progressRows = useMemo(() => {
    return workout.exercises.map((exercise, index) => {
      const key = `${date}-${selectedDay}-${index}`;
      return {
        exercise,
        weight: logs[key]?.weight || "",
        repsOrTime: logs[key]?.repsOrTime || "",
        notes: logs[key]?.notes || "",
      };
    });
  }, [logs, selectedDay, date, workout]);

  function updateLog(index: number, field: keyof LogEntry, value: string) {
    const key = `${date}-${selectedDay}-${index}`;
    setLogs((prev) => ({
      ...prev,
      [key]: {
        weight: prev[key]?.weight || "",
        repsOrTime: prev[key]?.repsOrTime || "",
        notes: prev[key]?.notes || "",
        [field]: value,
      },
    }));
  }

  function saveWorkout() {
    const savedWorkout: SavedWorkout = {
      id: crypto.randomUUID(),
      date,
      day: selectedDay,
      title: workout.title,
      entries: progressRows.map((row) => ({
        exercise: row.exercise.name,
        prescription: row.exercise.prescription,
        fieldType: row.exercise.fieldType,
        weight: row.weight,
        repsOrTime: row.repsOrTime,
        notes: row.notes,
      })),
    };

    const updated = [savedWorkout, ...history];
    setHistory(updated);
    localStorage.setItem("patrick-history", JSON.stringify(updated));
    alert("Workout saved.");
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.headerOuter}>
          <div style={styles.headerInner}>
            <p style={styles.kicker}>Patrick&apos;s Notre Dame Linebacker Workout</p>
            <h1 style={styles.dayTitle}>{selectedDay}</h1>
            <h2 style={styles.workoutTitle}>{workout.title}</h2>
            <p style={styles.badge}>{workout.type}</p>
          </div>
        </header>

        <section style={styles.controls}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            style={styles.input}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </section>

        <section style={styles.dayButtons}>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={selectedDay === day ? styles.activeDayButton : styles.dayButton}
            >
              {day}
            </button>
          ))}
        </section>

        <section style={styles.exerciseList}>
          {workout.exercises.map((exercise, index) => {
            const key = `${date}-${selectedDay}-${index}`;
            const isTimeOnly = exercise.fieldType === "time";

            return (
              <div key={key} style={styles.card}>
                <h3 style={styles.exerciseTitle}>
                  {index + 1}. {exercise.name}
                </h3>

                <p style={styles.prescription}>{exercise.prescription}</p>

                {exercise.notes && <p style={styles.notes}>{exercise.notes}</p>}

                <div style={isTimeOnly ? styles.timeGrid : styles.liftingGrid}>
                  {!isTimeOnly && (
                    <input
                      placeholder="Weight"
                      value={logs[key]?.weight || ""}
                      onChange={(e) => updateLog(index, "weight", e.target.value)}
                      style={styles.input}
                    />
                  )}

                  <input
                    placeholder={isTimeOnly ? "Time / Duration" : "Reps / Time"}
                    value={logs[key]?.repsOrTime || ""}
                    onChange={(e) => updateLog(index, "repsOrTime", e.target.value)}
                    style={styles.input}
                  />

                  <input
                    placeholder="Notes"
                    value={logs[key]?.notes || ""}
                    onChange={(e) => updateLog(index, "notes", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            );
          })}
        </section>

        <section style={styles.tableBox}>
          <h2 style={styles.goldHeading}>Today&apos;s Progress Table</h2>

          <div style={styles.scrollBox}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Exercise</th>
                  <th style={styles.th}>Weight</th>
                  <th style={styles.th}>Reps / Time</th>
                  <th style={styles.th}>Notes</th>
                </tr>
              </thead>

              <tbody>
                {progressRows.map((row, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{row.exercise.name}</td>
                    <td style={styles.td}>
                      {row.exercise.fieldType === "time" ? "-" : row.weight || "-"}
                    </td>
                    <td style={styles.td}>{row.repsOrTime || "-"}</td>
                    <td style={styles.td}>{row.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.tableBox}>
          <h2 style={styles.blueHeading}>Saved Workout History</h2>

          {history.length === 0 ? (
            <p style={styles.emptyText}>No saved workouts yet.</p>
          ) : (
            history.map((saved) => (
              <div key={saved.id} style={styles.savedCard}>
                <h3 style={styles.savedTitle}>
                  {saved.date} — {saved.day} — {saved.title}
                </h3>

                <div style={styles.scrollBox}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Exercise</th>
                        <th style={styles.th}>Weight</th>
                        <th style={styles.th}>Reps / Time</th>
                        <th style={styles.th}>Notes</th>
                      </tr>
                    </thead>

                    <tbody>
                      {saved.entries.map((entry, index) => (
                        <tr key={index}>
                          <td style={styles.td}>{entry.exercise}</td>
                          <td style={styles.td}>
                            {entry.fieldType === "time" ? "-" : entry.weight || "-"}
                          </td>
                          <td style={styles.td}>{entry.repsOrTime || "-"}</td>
                          <td style={styles.td}>{entry.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <button onClick={saveWorkout} style={styles.saveButton}>
        Save
      </button>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#050816",
    color: "white",
    padding: 16,
    paddingBottom: 120,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  headerOuter: {
    background: "linear-gradient(135deg,#061A40,#0B2D66,#D4AF37)",
    padding: 2,
    borderRadius: 28,
    marginBottom: 20,
  },
  headerInner: {
    background: "#07111f",
    borderRadius: 26,
    padding: 24,
  },
  kicker: {
    color: "#D4AF37",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 2,
    margin: 0,
    marginBottom: 12,
    fontSize: 13,
  },
  dayTitle: {
    fontSize: 44,
    margin: 0,
    fontWeight: 900,
  },
  workoutTitle: {
    color: "#bfdbfe",
    marginTop: 8,
    marginBottom: 0,
    fontSize: 26,
    fontWeight: 900,
  },
  badge: {
    display: "inline-block",
    background: "#D4AF37",
    color: "black",
    padding: "8px 14px",
    borderRadius: 999,
    marginTop: 14,
    fontWeight: 900,
  },
  controls: {
    display: "grid",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    background: "rgba(0,0,0,.45)",
    color: "white",
    border: "1px solid rgba(147,197,253,.35)",
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    width: "100%",
    boxSizing: "border-box",
  },
  dayButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))",
    gap: 10,
    marginBottom: 20,
  },
  dayButton: {
    background: "rgba(255,255,255,.08)",
    color: "white",
    border: 0,
    borderRadius: 16,
    padding: 14,
    fontWeight: 900,
  },
  activeDayButton: {
    background: "#D4AF37",
    color: "black",
    border: 0,
    borderRadius: 16,
    padding: 14,
    fontWeight: 900,
  },
  exerciseList: {
    display: "grid",
    gap: 16,
  },
  card: {
    background: "#0B1220",
    border: "1px solid rgba(96,165,250,.25)",
    borderRadius: 24,
    padding: 20,
  },
  exerciseTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 900,
  },
  prescription: {
    color: "#D4AF37",
    fontWeight: 800,
    marginTop: 0,
  },
  notes: {
    color: "#bfdbfe",
  },
  timeGrid: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  },
  liftingGrid: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  },
  tableBox: {
    marginTop: 28,
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(212,175,55,.35)",
    borderRadius: 24,
    padding: 20,
  },
  goldHeading: {
    color: "#D4AF37",
    marginTop: 0,
  },
  blueHeading: {
    color: "#bfdbfe",
    marginTop: 0,
  },
  emptyText: {
    color: "rgba(255,255,255,.65)",
  },
  scrollBox: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 700,
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    color: "#bfdbfe",
    borderBottom: "1px solid rgba(255,255,255,.15)",
    padding: 10,
  },
  td: {
    borderBottom: "1px solid rgba(255,255,255,.08)",
    padding: 10,
  },
  savedCard: {
    background: "rgba(0,0,0,.35)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  savedTitle: {
    color: "#D4AF37",
    marginTop: 0,
  },
  saveButton: {
    position: "fixed",
    right: 24,
    bottom: 24,
    background: "#D4AF37",
    color: "black",
    border: 0,
    borderRadius: 999,
    padding: "16px 28px",
    fontSize: 18,
    fontWeight: 900,
    boxShadow: "0 20px 40px rgba(0,0,0,.35)",
  },
};