"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type InputType = "strength" | "time";

type WorkoutItem = {
  exercise: string;
  category: string;
  inputType: InputType;
};

type WorkoutLog = {
  id: string;
  workout_date: string;
  exercise: string;
  entry_type: string | null;
  set_number: number | null;
  weight: number | null;
  reps: number | null;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
};

type SetInput = {
  weight: string;
  reps: string;
  duration: string;
  notes: string;
};

const ND_BLUE = "#0C2340";
const ND_DARK = "#061526";
const ND_DEEP = "#020814";
const ND_GOLD = "#C99700";
const ND_GOLD_LIGHT = "#F2C94C";
const ND_GREEN = "#00843D";
const WHITE = "#F8FAFC";
const MUTED = "rgba(248,250,252,0.68)";

const EMPTY_SET: SetInput = {
  weight: "",
  reps: "",
  duration: "",
  notes: "",
};

const dayOrder = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const workoutsByDay: Record<string, WorkoutItem[]> = {
  Sunday: [
    { exercise: "Rest Day", category: "Recovery", inputType: "time" },
    { exercise: "1 Hour Walk", category: "Optional recovery", inputType: "time" },
    { exercise: "Massage", category: "Optional recovery", inputType: "time" },
    { exercise: "Foam Roller", category: "Optional recovery", inputType: "time" },
    { exercise: "Theragun", category: "Optional recovery", inputType: "time" },
    { exercise: "Stretching", category: "Optional mobility", inputType: "time" },
    { exercise: "Sauna", category: "Optional recovery", inputType: "time" },
  ],
  Monday: [
    { exercise: "Dynamic Warmup", category: "Power & Max Effort Upper Body", inputType: "time" },
    { exercise: "Kneeling Med Ball Chest Pass Into Wall", category: "3 x 5", inputType: "strength" },
    { exercise: "Isometric Shoulder Y-W-T On Bench", category: "3 x 15 seconds each position", inputType: "time" },
    { exercise: "Barbell Bench Press", category: "Work up to 5 x 1 at 90% 1RM • Last set perform 1 or more reps", inputType: "strength" },
    { exercise: "Strip Set Chain Push Ups", category: "2 sets: 4 chains x10 • 3 chains x8 • 2 chains x6 • 1 chain x4 • Bodyweight max reps", inputType: "strength" },
    { exercise: "Standing Hand Over Hand Rope Pull w/ Sled", category: "3 timed sets", inputType: "time" },
    { exercise: "Band Face Pulls", category: "3 x 15", inputType: "strength" },
    { exercise: "DeFranco Shoulder Shocker", category: "2-3 sets of 8 reps each variation", inputType: "strength" },
    { exercise: "Thick Rope Curls w/ 70 lb KB", category: "3 x 10", inputType: "strength" },
    { exercise: "Band Triceps Pushdown", category: "3 x 100 total reps • Use light/moderate band", inputType: "strength" },
  ],
  Tuesday: [
    { exercise: "Dynamic Warmup", category: "Power & Dynamic Effort Lower Body", inputType: "time" },
    { exercise: "Med Ball Chest Throw Into Sprint", category: "6 x 10-15 yards", inputType: "time" },
    { exercise: "Push Up Into Sprint", category: "6 x 10-15 yards", inputType: "time" },
    { exercise: "Kneeling Jump Into Box Jump", category: "6 x 3 • Start at 30 inches and increase box height each set", inputType: "strength" },
    { exercise: "Barbell Dynamic Box Squat w/ Chains", category: "8 x 3 at 70% 1RM", inputType: "strength" },
    { exercise: "Double KB Swing", category: "4 x 12", inputType: "strength" },
    { exercise: "KB Get Up - First Movement", category: "3 x 10 each side", inputType: "strength" },
    { exercise: "Plate Pinches - 45 lb Bumper Plate", category: "3 x 30-60 seconds", inputType: "time" },
    { exercise: "Manual Neck", category: "3 x 10 each position", inputType: "strength" },
  ],
  Wednesday: [
    { exercise: "Rest Day", category: "Recovery", inputType: "time" },
    { exercise: "1 Hour Walk", category: "Optional recovery", inputType: "time" },
    { exercise: "Foam Roller", category: "Optional recovery", inputType: "time" },
    { exercise: "Theragun", category: "Optional recovery", inputType: "time" },
    { exercise: "Stretching", category: "Optional mobility", inputType: "time" },
  ],
  Thursday: [
    { exercise: "Dynamic Warmup", category: "Repetition Effort Upper Body", inputType: "time" },
    { exercise: "Explosive Push Up Onto Boxes", category: "5 x 5", inputType: "strength" },
    { exercise: "Band Pull Apart", category: "5 x 10", inputType: "strength" },
    { exercise: "DB Incline Bench With 5-Second Negative", category: "4 x 6", inputType: "strength" },
    { exercise: "Fat Bar Lat Pulldown w/ Pause", category: "4 x 12", inputType: "strength" },
    { exercise: "Incline DB Reverse Fly", category: "4 x 15", inputType: "strength" },
    { exercise: "1-Arm DB Row w/ Fat Gripz", category: "3 x 8 each arm", inputType: "strength" },
    { exercise: "Towel Barbell Shrugs", category: "3 x 10", inputType: "strength" },
    { exercise: "Plank w/ Tricep Lockout", category: "3 x 10", inputType: "strength" },
  ],
  Friday: [
    { exercise: "Dynamic Warmup", category: "Power & Max Effort Lower Body", inputType: "time" },
    { exercise: "Sled Resisted Sprints", category: "6 x 10-15 yards", inputType: "time" },
    { exercise: "Mountain Climber Into Sprint", category: "6 x 10-15 yards", inputType: "time" },
    { exercise: "Kneeling Jump Into Broad Jump", category: "6 x 3 • Measure distance and aim farther each set", inputType: "strength" },
    { exercise: "Trap Bar Deadlift", category: "Work up to 3 x 3 at 85% 1RM", inputType: "strength" },
    { exercise: "2-KB Front Squat", category: "4 x 10", inputType: "strength" },
    { exercise: "Ab Wheel Roll Out", category: "3 x 10", inputType: "strength" },
    { exercise: "Fat Bar Hold w/ 185 lbs", category: "3 x as long as possible", inputType: "time" },
  ],
  Saturday: [
    { exercise: "Rest Day", category: "Recovery", inputType: "time" },
    { exercise: "1 Hour Walk", category: "Optional recovery", inputType: "time" },
    { exercise: "Mobility Work", category: "Optional mobility", inputType: "time" },
    { exercise: "Foam Roller", category: "Optional recovery", inputType: "time" },
    { exercise: "Theragun", category: "Optional recovery", inputType: "time" },
    { exercise: "Stretching", category: "Optional mobility", inputType: "time" },
    { exercise: "Sauna", category: "Optional recovery", inputType: "time" },
  ],
};

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  return toLocalDateString(new Date());
}

function getDayName(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function prettyDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateForDay(dayName: string) {
  const today = new Date();
  const targetIndex = dayOrder.indexOf(dayName);
  const todayIndex = today.getDay();
  const difference = targetIndex - todayIndex;

  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  date.setDate(date.getDate() + difference);

  return toLocalDateString(date);
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 760);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobile();
  const localToday = getTodayDate();

  const [selectedDate, setSelectedDate] = useState(localToday);
  const [selectedDay, setSelectedDay] = useState(getDayName(localToday));
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [inputs, setInputs] = useState<Record<string, SetInput[]>>({});
  const [loadingExercise, setLoadingExercise] = useState<string | null>(null);

  const todaysWorkout = workoutsByDay[selectedDay] || [];
  const selectedDateLogs = logs.filter((log) => log.workout_date === selectedDate);

  const summary = useMemo(() => {
    const strength = todaysWorkout.filter((item) => item.inputType === "strength").length;
    const time = todaysWorkout.filter((item) => item.inputType === "time").length;

    const categories = todaysWorkout.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return { total: todaysWorkout.length, strength, time, categories };
  }, [todaysWorkout]);

  async function loadLogs() {
    if (!supabase) {
      alert("Supabase environment variables are missing.");
      return;
    }

    const { data, error } = await supabase
      .from("workout_logs")
      .select("*")
      .order("workout_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(JSON.stringify(error, null, 2));
      return;
    }

    setLogs(data || []);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function getSets(exercise: string) {
    return inputs[exercise] || [{ ...EMPTY_SET }];
  }

  function selectDay(day: string) {
    setSelectedDay(day);
    setSelectedDate(dateForDay(day));
  }

  function handleDateChange(dateValue: string) {
    setSelectedDate(dateValue);
    setSelectedDay(getDayName(dateValue));
  }

  function goToToday() {
    const today = getTodayDate();
    setSelectedDate(today);
    setSelectedDay(getDayName(today));
  }

  function addSet(exercise: string) {
    setInputs((prev) => ({
      ...prev,
      [exercise]: [...(prev[exercise] || [{ ...EMPTY_SET }]), { ...EMPTY_SET }],
    }));
  }

  function removeSet(exercise: string, setIndex: number) {
    setInputs((prev) => {
      const currentSets = prev[exercise] || [{ ...EMPTY_SET }];
      const updatedSets = currentSets.filter((_, index) => index !== setIndex);

      return {
        ...prev,
        [exercise]: updatedSets.length > 0 ? updatedSets : [{ ...EMPTY_SET }],
      };
    });
  }

  function updateSetInput(
    exercise: string,
    setIndex: number,
    field: keyof SetInput,
    value: string
  ) {
    setInputs((prev) => {
      const currentSets = prev[exercise] || [{ ...EMPTY_SET }];

      const updatedSets = currentSets.map((set, index) =>
        index === setIndex ? { ...set, [field]: value } : set
      );

      return {
        ...prev,
        [exercise]: updatedSets,
      };
    });
  }

  async function saveWorkout(item: WorkoutItem) {
    if (!supabase) {
      alert("Supabase environment variables are missing.");
      return;
    }

    const sets = getSets(item.exercise);

    const rows = sets.map((set, index) => ({
      workout_date: selectedDate,
      exercise: item.exercise,
      entry_type: item.inputType,
      set_number: index + 1,
      weight: item.inputType === "strength" && set.weight ? Number(set.weight) : null,
      reps: item.inputType === "strength" && set.reps ? Number(set.reps) : null,
      duration_minutes: item.inputType === "time" && set.duration ? Number(set.duration) : null,
      notes: set.notes || null,
    }));

    setLoadingExercise(item.exercise);

    const { error } = await supabase.from("workout_logs").insert(rows);

    setLoadingExercise(null);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error, null, 2));
      return;
    }

    setInputs((prev) => ({
      ...prev,
      [item.exercise]: [{ ...EMPTY_SET }],
    }));

    await loadLogs();
  }

  async function deleteLog(id: string) {
    if (!supabase) {
      alert("Supabase environment variables are missing.");
      return;
    }

    const confirmed = window.confirm("Delete this workout set?");
    if (!confirmed) return;

    const { error } = await supabase.from("workout_logs").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert(JSON.stringify(error, null, 2));
      return;
    }

    await loadLogs();
  }

  return (
    <main style={styles.page}>
      {!isMobile && (
        <aside style={styles.sidebar}>
          <div style={styles.logoWrap}>
            <div style={styles.logo}>ND</div>
            <p style={styles.logoSub}>FIGHTING IRISH</p>
          </div>

          {[
            { label: "WORKOUT", icon: "🏋️", target: "workout-section" },
            { label: "SUMMARY", icon: "📊", target: "progress-section" },
            { label: "CALENDAR", icon: "📅", target: "calendar-section" },
            { label: "HISTORY", icon: "🕘", target: "history-section" },
            { label: "PROGRESS", icon: "📈", target: "history-section" },
          ].map((item, index) => (
            <button
              key={item.label}
              style={index === 0 ? styles.navButtonActive : styles.navButton}
              onClick={() => scrollToSection(item.target)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div style={styles.sideCard}>
            <p style={styles.sideCardTop}>TODAY</p>
            <h3 style={styles.sideCardTitle}>{selectedDay}</h3>
            <p style={styles.sideCardText}>{summary.total} items scheduled</p>
          </div>
        </aside>
      )}

      <section style={isMobile ? styles.contentMobile : styles.content}>
        <header id="calendar-section" style={isMobile ? styles.heroMobile : styles.hero}>
          <div>
            <p style={styles.kicker}>PATRICK&apos;S</p>
            <h1 style={isMobile ? styles.titleMobile : styles.title}>NOTRE DAME</h1>
            <h2 style={isMobile ? styles.subtitleMobile : styles.subtitle}>
              WORKOUT COMMAND CENTER
            </h2>
          </div>

          <div style={isMobile ? styles.heroRightMobile : styles.heroRight}>
            <div style={styles.dateCard}>
              <span style={styles.dateLabel}>SELECT DATE</span>
              <input
                style={styles.dateInput}
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            <button style={styles.todayButton} onClick={goToToday}>
              TODAY
            </button>

            <div style={styles.shamrock}>☘</div>
          </div>
        </header>

        <nav style={isMobile ? styles.dayBarMobile : styles.dayBar}>
          {dayOrder.map((day) => {
            const active = selectedDay === day;
            const date = dateForDay(day);

            return (
              <button
                key={day}
                style={active ? styles.dayButtonActive : styles.dayButton}
                onClick={() => selectDay(day)}
              >
                <span style={styles.dayName}>{day.slice(0, 3).toUpperCase()}</span>
                <span style={styles.dayDate}>
                  {new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </button>
            );
          })}
        </nav>

        <section style={isMobile ? styles.metricsGridMobile : styles.metricsGrid}>
          <MetricCard title="TOTAL TODAY" value={summary.total} color={WHITE} />
          <MetricCard title="STRENGTH" value={summary.strength} color={ND_GOLD_LIGHT} />
          <MetricCard title="TIME / RECOVERY" value={summary.time} color={ND_GREEN} />
          <MetricCard title="SAVED TODAY" value={selectedDateLogs.length} color={WHITE} />
        </section>

        <section id="workout-section" style={isMobile ? styles.panelMobile : styles.panel}>
          <div style={isMobile ? styles.panelHeaderMobile : styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>{prettyDate(selectedDate)}</p>
              <h2 style={styles.panelTitle}>{selectedDay.toUpperCase()} WORKOUT</h2>
            </div>

            <button
              style={styles.floatingMiniButton}
              onClick={() => scrollToSection("progress-section")}
            >
              VIEW SUMMARY
            </button>
          </div>

          <div style={isMobile ? styles.workoutGridMobile : styles.workoutGrid}>
            {todaysWorkout.map((item) => {
              const isTime = item.inputType === "time";
              const sets = getSets(item.exercise);

              return (
                <article key={item.exercise} style={styles.workoutCard}>
                  <div style={styles.cardHeader}>
                    <div style={isTime ? styles.greenIcon : styles.goldIcon}>
                      {isTime ? "⏱" : "🏋"}
                    </div>

                    <div>
                      <h3 style={styles.exerciseTitle}>{item.exercise}</h3>
                      <p style={isTime ? styles.greenText : styles.goldText}>
                        {item.category.toUpperCase()} •{" "}
                        {isTime ? "TIME" : "WEIGHT + REPS"}
                      </p>
                    </div>
                  </div>

                  <div style={styles.setList}>
                    {sets.map((set, setIndex) => (
                      <div key={`${item.exercise}-${setIndex}`} style={styles.setBox}>
                        <div style={styles.setHeader}>
                          <strong style={styles.setTitle}>Set {setIndex + 1}</strong>

                          {sets.length > 1 && (
                            <button
                              type="button"
                              style={styles.removeSetButton}
                              onClick={() => removeSet(item.exercise, setIndex)}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {isTime ? (
                          <div>
                            <label style={styles.inputLabel}>TIME IN MINUTES</label>
                            <input
                              style={styles.input}
                              type="number"
                              placeholder="Enter time"
                              value={set.duration}
                              onChange={(e) =>
                                updateSetInput(
                                  item.exercise,
                                  setIndex,
                                  "duration",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ) : (
                          <div style={styles.twoColumn}>
                            <div>
                              <label style={styles.inputLabel}>WEIGHT</label>
                              <input
                                style={styles.input}
                                type="number"
                                placeholder="lbs"
                                value={set.weight}
                                onChange={(e) =>
                                  updateSetInput(
                                    item.exercise,
                                    setIndex,
                                    "weight",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label style={styles.inputLabel}>REPS</label>
                              <input
                                style={styles.input}
                                type="number"
                                placeholder="reps"
                                value={set.reps}
                                onChange={(e) =>
                                  updateSetInput(
                                    item.exercise,
                                    setIndex,
                                    "reps",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}

                        <label style={styles.inputLabel}>NOTES</label>
                        <input
                          style={styles.input}
                          type="text"
                          placeholder="Optional note"
                          value={set.notes}
                          onChange={(e) =>
                            updateSetInput(
                              item.exercise,
                              setIndex,
                              "notes",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    style={styles.addSetButton}
                    onClick={() => addSet(item.exercise)}
                  >
                    + Add Set
                  </button>

                  <button
                    style={isTime ? styles.saveGreen : styles.saveGold}
                    onClick={() => saveWorkout(item)}
                    disabled={loadingExercise === item.exercise}
                  >
                    {loadingExercise === item.exercise ? "SAVING..." : "SAVE ALL SETS"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section id="progress-section" style={isMobile ? styles.panelMobile : styles.panel}>
          <div style={isMobile ? styles.panelHeaderMobile : styles.panelHeader}>
            <div>
              <p style={styles.panelEyebrow}>DAILY BREAKDOWN</p>
              <h2 style={styles.panelTitle}>{selectedDay.toUpperCase()} SUMMARY</h2>
            </div>
          </div>

          <div style={styles.summaryGrid}>
            {Object.entries(summary.categories).map(([category, count]) => (
              <div key={category} style={styles.summaryCard}>
                <span style={styles.summaryCategory}>{category}</span>
                <strong style={styles.summaryCount}>{count}</strong>
              </div>
            ))}
          </div>

          <div style={styles.planList}>
            {todaysWorkout.map((item) => (
              <div key={item.exercise} style={styles.planRow}>
                <span>{item.exercise}</span>
                <strong style={item.inputType === "time" ? styles.greenText : styles.goldText}>
                  {item.inputType === "time" ? "TIME" : "WEIGHT / REPS"}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section id="history-section" style={isMobile ? styles.tablesGridMobile : styles.tablesGrid}>
          <div style={styles.tablePanel}>
            <h2 style={styles.tableTitle}>
              SAVED FOR {prettyDate(selectedDate).toUpperCase()}
            </h2>
            <WorkoutTable logs={selectedDateLogs} deleteLog={deleteLog} showDelete />
          </div>

          <div style={styles.tablePanel}>
            <h2 style={styles.tableTitle}>ALL SAVED WORKOUTS</h2>
            <WorkoutTable logs={logs.slice(0, 50)} deleteLog={deleteLog} showDelete />
          </div>
        </section>

        <footer style={styles.footer}>
          ☘ BUILT FOR DISCIPLINE • TRACKED FOR PROGRESS • GO IRISH ☘
        </footer>
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div style={styles.metricCard}>
      <p style={styles.metricTitle}>{title}</p>
      <h3 style={{ ...styles.metricValue, color }}>{value}</h3>
    </div>
  );
}

function WorkoutTable({
  logs,
  deleteLog,
  showDelete = false,
}: {
  logs: WorkoutLog[];
  deleteLog: (id: string) => void;
  showDelete?: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (logs.length === 0) {
    return <div style={styles.emptyCard}>No saved workouts yet.</div>;
  }

  return (
    <div style={styles.tableScroll}>
      <table style={styles.realTable}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Exercise</th>
            <th style={styles.th}>Set</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Weight</th>
            <th style={styles.th}>Reps</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Notes</th>
            {showDelete && <th style={styles.th}>Action</th>}
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => {
            const expanded = expandedId === log.id;

            return (
              <tr key={log.id}>
                <td colSpan={showDelete ? 9 : 8} style={styles.rowWrapperTd}>
                  <div
                    style={expanded ? styles.savedRowExpanded : styles.savedRow}
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                  >
                    <div style={styles.savedCellDate}>{prettyDate(log.workout_date)}</div>
                    <div style={styles.savedCellExercise}>{log.exercise}</div>
                    <div style={styles.savedCell}>Set {log.set_number ?? "—"}</div>
                    <div style={styles.savedCell}>{log.entry_type ?? "—"}</div>
                    <div style={styles.savedCell}>Wt {log.weight ?? "—"}</div>
                    <div style={styles.savedCell}>Reps {log.reps ?? "—"}</div>
                    <div style={styles.savedCell}>
                      {log.duration_minutes ? `${log.duration_minutes} min` : "—"}
                    </div>
                    <div style={styles.savedCellNotes}>{log.notes || "—"}</div>

                    {showDelete && (
                      <button
                        style={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLog(log.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {expanded && (
                    <div style={styles.expandedBox}>
                      <div style={styles.expandedTitle}>{log.exercise}</div>

                      <div style={styles.expandedGrid}>
                        <span>Date: {prettyDate(log.workout_date)}</span>
                        <span>Set: {log.set_number ?? "—"}</span>
                        <span>Type: {log.entry_type ?? "—"}</span>
                        <span>Weight: {log.weight ?? "—"}</span>
                        <span>Reps: {log.reps ?? "—"}</span>
                        <span>
                          Time: {log.duration_minutes ? `${log.duration_minutes} min` : "—"}
                        </span>
                        <span>Notes: {log.notes || "—"}</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: `radial-gradient(circle at top right, rgba(0,132,61,0.28), transparent 32%),
      radial-gradient(circle at top left, rgba(201,151,0,0.22), transparent 28%),
      linear-gradient(135deg, ${ND_DEEP} 0%, ${ND_DARK} 45%, ${ND_BLUE} 100%)`,
    color: WHITE,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    overflowX: "hidden",
  },

  sidebar: {
    width: 210,
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    padding: 22,
    background: "rgba(2,8,20,0.74)",
    borderRight: `1px solid rgba(201,151,0,0.45)`,
    backdropFilter: "blur(16px)",
    boxShadow: "20px 0 60px rgba(0,0,0,0.38)",
    boxSizing: "border-box",
  },

  logoWrap: {
    textAlign: "center",
    marginBottom: 24,
  },

  logo: {
    fontSize: 54,
    fontWeight: 1000,
    color: ND_GOLD_LIGHT,
    letterSpacing: -5,
    textShadow: "0 0 28px rgba(201,151,0,0.55)",
  },

  logoSub: {
    margin: 0,
    color: ND_GREEN,
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 2,
  },

  navButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "15px 14px",
    marginBottom: 10,
    borderRadius: 16,
    border: "1px solid transparent",
    background: "transparent",
    color: WHITE,
    fontWeight: 900,
    cursor: "pointer",
    textAlign: "left",
  },

  navButtonActive: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "15px 14px",
    marginBottom: 10,
    borderRadius: 16,
    border: `1px solid ${ND_GOLD}`,
    background: "linear-gradient(135deg, rgba(201,151,0,0.24), rgba(0,132,61,0.12))",
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
  },

  navIcon: {
    fontSize: 20,
  },

  sideCard: {
    marginTop: 34,
    padding: 18,
    borderRadius: 20,
    border: `1px solid rgba(201,151,0,0.48)`,
    background: "linear-gradient(180deg, rgba(12,35,64,0.9), rgba(2,8,20,0.78))",
    boxShadow: "0 20px 44px rgba(0,0,0,0.35)",
  },

  sideCardTop: {
    margin: 0,
    color: ND_GREEN,
    fontWeight: 1000,
    fontSize: 11,
    letterSpacing: 2,
  },

  sideCardTitle: {
    margin: "8px 0",
    color: ND_GOLD_LIGHT,
    fontSize: 24,
  },

  sideCardText: {
    margin: 0,
    color: MUTED,
    fontWeight: 700,
  },

  content: {
    flex: 1,
    padding: 28,
    maxWidth: 1600,
    margin: "0 auto",
    boxSizing: "border-box",
  },

  contentMobile: {
    width: "100%",
    padding: 12,
    boxSizing: "border-box",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: 22,
    alignItems: "center",
    padding: 28,
    borderRadius: 28,
    marginBottom: 20,
    border: "1px solid rgba(201,151,0,0.45)",
    background: "linear-gradient(135deg, rgba(12,35,64,0.86), rgba(2,8,20,0.72))",
    boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
  },

  heroMobile: {
    display: "block",
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    border: "1px solid rgba(201,151,0,0.45)",
    background: "linear-gradient(135deg, rgba(12,35,64,0.86), rgba(2,8,20,0.72))",
    boxShadow: "0 20px 50px rgba(0,0,0,0.36)",
  },

  kicker: {
    margin: 0,
    color: ND_GREEN,
    fontSize: 14,
    letterSpacing: 7,
    fontWeight: 1000,
  },

  title: {
    margin: "6px 0",
    color: WHITE,
    fontSize: 58,
    lineHeight: 0.92,
    fontWeight: 1000,
    letterSpacing: 2,
  },

  titleMobile: {
    margin: "6px 0",
    color: WHITE,
    fontSize: 40,
    lineHeight: 0.95,
    fontWeight: 1000,
    letterSpacing: 1,
  },

  subtitle: {
    margin: 0,
    color: ND_GOLD_LIGHT,
    fontSize: 20,
    fontWeight: 1000,
    letterSpacing: 4,
  },

  subtitleMobile: {
    margin: 0,
    color: ND_GOLD_LIGHT,
    fontSize: 15,
    fontWeight: 1000,
    letterSpacing: 3,
  },

  heroRight: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  heroRightMobile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 16,
  },

  dateCard: {
    padding: 12,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
  },

  dateLabel: {
    display: "block",
    color: MUTED,
    fontSize: 10,
    fontWeight: 1000,
    letterSpacing: 2,
    marginBottom: 6,
  },

  dateInput: {
    background: "rgba(2,8,20,0.72)",
    color: WHITE,
    border: "1px solid rgba(201,151,0,0.42)",
    borderRadius: 12,
    padding: "12px 14px",
    fontWeight: 900,
    maxWidth: "100%",
  },

  todayButton: {
    border: 0,
    borderRadius: 999,
    padding: "15px 22px",
    background: `linear-gradient(180deg, ${ND_GOLD_LIGHT}, ${ND_GOLD})`,
    color: ND_DEEP,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
  },

  shamrock: {
    fontSize: 42,
    color: ND_GREEN,
    textShadow: "0 0 28px rgba(0,132,61,0.88)",
  },

  dayBar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 10,
    marginBottom: 20,
  },

  dayBarMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginBottom: 14,
  },

  dayButton: {
    border: "1px solid rgba(201,151,0,0.28)",
    borderRadius: 18,
    padding: "15px 8px",
    background: "rgba(255,255,255,0.04)",
    color: WHITE,
    cursor: "pointer",
    boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
  },

  dayButtonActive: {
    border: `1px solid ${ND_GOLD}`,
    borderRadius: 18,
    padding: "15px 8px",
    background: `linear-gradient(180deg, ${ND_GOLD_LIGHT}, ${ND_GOLD})`,
    color: ND_DEEP,
    cursor: "pointer",
    boxShadow: "0 20px 44px rgba(0,0,0,0.38)",
    transform: "translateY(-2px)",
  },

  dayName: {
    display: "block",
    fontWeight: 1000,
    fontSize: 15,
  },

  dayDate: {
    display: "block",
    marginTop: 5,
    fontWeight: 800,
    opacity: 0.82,
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },

  metricsGridMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginBottom: 14,
  },

  metricCard: {
    padding: 18,
    borderRadius: 22,
    background: "linear-gradient(180deg, rgba(12,35,64,0.88), rgba(2,8,20,0.68))",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 22px 60px rgba(0,0,0,0.34)",
  },

  metricTitle: {
    margin: 0,
    color: MUTED,
    fontWeight: 1000,
    fontSize: 11,
    letterSpacing: 2,
  },

  metricValue: {
    margin: "8px 0 0",
    fontSize: 40,
    fontWeight: 1000,
  },

  panel: {
    padding: 24,
    borderRadius: 28,
    marginBottom: 22,
    border: "1px solid rgba(201,151,0,0.35)",
    background: "linear-gradient(180deg, rgba(12,35,64,0.88), rgba(2,8,20,0.72))",
    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
  },

  panelMobile: {
    padding: 14,
    borderRadius: 24,
    marginBottom: 16,
    border: "1px solid rgba(201,151,0,0.35)",
    background: "linear-gradient(180deg, rgba(12,35,64,0.88), rgba(2,8,20,0.72))",
    boxShadow: "0 20px 50px rgba(0,0,0,0.34)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 14,
    borderBottom: `2px solid rgba(0,132,61,0.72)`,
  },

  panelHeaderMobile: {
    display: "block",
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: `2px solid rgba(0,132,61,0.72)`,
  },

  panelEyebrow: {
    margin: 0,
    color: ND_GREEN,
    fontWeight: 1000,
    letterSpacing: 2,
    fontSize: 12,
  },

  panelTitle: {
    margin: "5px 0 14px",
    color: WHITE,
    fontSize: 26,
    fontWeight: 1000,
    letterSpacing: 1,
  },

  floatingMiniButton: {
    border: 0,
    borderRadius: 999,
    padding: "13px 18px",
    background: `linear-gradient(180deg, ${ND_GREEN}, #005F2C)`,
    color: WHITE,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 38px rgba(0,0,0,0.34)",
  },

  workoutGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  },

  workoutGridMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
  },

  workoutCard: {
    padding: 18,
    borderRadius: 24,
    border: "1px solid rgba(201,151,0,0.38)",
    background: "linear-gradient(180deg, rgba(7,21,38,0.98), rgba(2,8,20,0.92))",
    boxShadow: "0 26px 60px rgba(0,0,0,0.4)",
    overflow: "hidden",
  },

  cardHeader: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },

  goldIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(201,151,0,0.16)",
    border: `1px solid ${ND_GOLD}`,
    color: ND_GOLD_LIGHT,
    fontSize: 22,
    flexShrink: 0,
  },

  greenIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,132,61,0.16)",
    border: `1px solid ${ND_GREEN}`,
    color: ND_GREEN,
    fontSize: 22,
    flexShrink: 0,
  },

  exerciseTitle: {
    margin: 0,
    color: WHITE,
    fontSize: 20,
    fontWeight: 1000,
  },

  goldText: {
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
  },

  greenText: {
    color: ND_GREEN,
    fontWeight: 1000,
  },

  setList: {
    display: "grid",
    gap: 12,
  },

  setBox: {
    padding: 12,
    borderRadius: 16,
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  setHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  setTitle: {
    color: ND_GOLD_LIGHT,
    fontSize: 14,
  },

  removeSetButton: {
    border: "1px solid rgba(255,80,80,0.32)",
    borderRadius: 999,
    padding: "6px 10px",
    background: "rgba(255,80,80,0.12)",
    color: "#FFD0D0",
    fontWeight: 900,
    cursor: "pointer",
  },

  addSetButton: {
    width: "100%",
    border: "1px solid rgba(201,151,0,0.45)",
    borderRadius: 999,
    padding: "13px 16px",
    background: "rgba(201,151,0,0.10)",
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    cursor: "pointer",
    marginTop: 14,
    marginBottom: 12,
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  inputLabel: {
    display: "block",
    color: MUTED,
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: WHITE,
    fontWeight: 800,
    fontSize: 15,
    marginBottom: 13,
    outline: "none",
  },

  saveGold: {
    width: "100%",
    border: 0,
    borderRadius: 999,
    padding: "15px 18px",
    background: `linear-gradient(180deg, ${ND_GOLD_LIGHT}, ${ND_GOLD})`,
    color: ND_DEEP,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 20px 44px rgba(0,0,0,0.38)",
    position: "relative",
    zIndex: 1,
  },

  saveGreen: {
    width: "100%",
    border: 0,
    borderRadius: 999,
    padding: "15px 18px",
    background: `linear-gradient(180deg, ${ND_GREEN}, #005F2C)`,
    color: WHITE,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 20px 44px rgba(0,0,0,0.38)",
    position: "relative",
    zIndex: 1,
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  summaryCard: {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  summaryCategory: {
    color: MUTED,
    fontWeight: 1000,
  },

  summaryCount: {
    display: "block",
    marginTop: 8,
    color: ND_GOLD_LIGHT,
    fontSize: 34,
  },

  planList: {
    display: "grid",
    gap: 10,
  },

  planRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    padding: "13px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    color: WHITE,
    fontWeight: 800,
  },

  tablesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: 18,
    marginBottom: 22,
  },

  tablesGridMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
    marginBottom: 16,
  },

  tablePanel: {
    padding: 18,
    borderRadius: 24,
    border: "1px solid rgba(201,151,0,0.35)",
    background: "linear-gradient(180deg, rgba(12,35,64,0.88), rgba(2,8,20,0.72))",
    boxShadow: "0 30px 80px rgba(0,0,0,0.36)",
  },

  tableTitle: {
    margin: "0 0 16px",
    color: WHITE,
    fontSize: 20,
    fontWeight: 1000,
  },

  tableScroll: {
    width: "100%",
    overflowX: "auto",
    borderRadius: 16,
  },

  realTable: {
    width: "100%",
    minWidth: 980,
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },

  th: {
    textAlign: "left",
    color: ND_GOLD_LIGHT,
    fontSize: 12,
    fontWeight: 1000,
    padding: "8px 12px",
    whiteSpace: "nowrap",
  },

  rowWrapperTd: {
    padding: 0,
  },

  savedRow: {
    display: "grid",
    gridTemplateColumns: "120px minmax(240px, 1.4fr) 80px 100px 90px 90px 90px minmax(180px, 1fr) 120px",
    alignItems: "center",
    gap: 10,
    padding: "14px 14px",
    borderRadius: 18,
    border: "1px solid rgba(201,151,0,0.28)",
    background: "rgba(2,8,20,0.62)",
    cursor: "pointer",
  },

  savedRowExpanded: {
    display: "grid",
    gridTemplateColumns: "120px minmax(240px, 1.4fr) 80px 100px 90px 90px 90px minmax(180px, 1fr) 120px",
    alignItems: "center",
    gap: 10,
    padding: "14px 14px",
    borderRadius: 18,
    border: "1px solid rgba(242,201,76,0.72)",
    background: "rgba(201,151,0,0.10)",
    cursor: "pointer",
  },

  savedCellDate: {
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    whiteSpace: "nowrap",
    fontSize: 13,
  },

  savedCellExercise: {
    color: WHITE,
    fontWeight: 1000,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  savedCell: {
    color: MUTED,
    fontWeight: 900,
    whiteSpace: "nowrap",
    fontSize: 13,
  },

  savedCellNotes: {
    color: MUTED,
    fontWeight: 900,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 13,
  },

  expandedBox: {
    margin: "8px 0 4px",
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(201,151,0,0.35)",
    color: WHITE,
  },

  expandedTitle: {
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    fontSize: 18,
    marginBottom: 12,
  },

  expandedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    color: MUTED,
    fontWeight: 900,
  },

  mobileHistoryList: {
    display: "grid",
    gap: 12,
  },

  historyCard: {
    border: "1px solid rgba(201,151,0,0.28)",
    borderRadius: 16,
    padding: 14,
    background: "rgba(2,8,20,0.42)",
  },

  historyTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  historyDate: {
    margin: 0,
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    fontSize: 12,
  },

  historyExercise: {
    margin: "5px 0 0",
    color: WHITE,
    fontSize: 15,
    fontWeight: 1000,
  },

  historyDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginTop: 12,
    color: MUTED,
    fontWeight: 800,
    fontSize: 12,
  },

  emptyCard: {
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: MUTED,
    fontWeight: 900,
  },

  deleteButton: {
    border: "1px solid rgba(255,80,80,0.35)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "rgba(255,80,80,0.18)",
    color: "#FFD0D0",
    fontWeight: 1000,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  footer: {
    textAlign: "center",
    color: ND_GOLD_LIGHT,
    fontWeight: 1000,
    letterSpacing: 3,
    padding: "18px 0 30px",
  },
};