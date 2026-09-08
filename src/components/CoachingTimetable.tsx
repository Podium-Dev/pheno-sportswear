"use client";

import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const classes = {
  pt: "1:1 personal training",
  conditioning: "Strength & Conditioning",
  beginners: "Beginners boxing",
  women: "Women's boxing",
  fighters: "Fighters boxing",
  sparring: "Sparring (all levels)",
};
type ClassType = keyof typeof classes;
const rows: { time: string; sessions: (ClassType | null)[] }[] = [
  { time: "06:00", sessions: ["pt", "pt", "pt", "pt", "pt", null, null] },
  { time: "07:00", sessions: ["pt", "conditioning", "pt", "conditioning", "pt", "pt", null] },
  { time: "08:00", sessions: ["pt", null, null, "pt", "pt", "pt", null] },
  { time: "09:00", sessions: [null, null, null, null, null, "pt", null] },
  { time: "10:00", sessions: ["pt", "pt", "pt", "pt", "pt", "conditioning", "sparring"] },
  { time: "11:00", sessions: ["pt", "pt", "pt", "pt", "pt", null, null] },
  { time: "12:00", sessions: ["pt", "pt", "pt", "pt", "pt", null, null] },
  { time: "18:00", sessions: ["beginners", null, "women", "beginners", "women", null, null] },
  { time: "19:30", sessions: ["fighters", null, "fighters", "fighters", "fighters", null, null] },
];

export function CoachingTimetable() {
  const [filter, setFilter] = useState<ClassType | "all">("all");
  const [day, setDay] = useState(0);
  return (
    <>
      <section className="coaching-timetable" aria-labelledby="timetable-title">
        <header className="coaching-schedule-intro">
          <h2 id="timetable-title">Your week. Your work.</h2>
          <p>Find your rhythm with one-to-one training, group boxing and Strength &amp; Conditioning. All times are UK local time.</p>
        </header>
        <div className="coaching-schedule-filters" role="group" aria-label="Filter timetable by class">
          {(["all", ...Object.keys(classes)] as (ClassType | "all")[]).map((type) => (
            <button key={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === "all" ? "All sessions" : classes[type]}</button>
          ))}
        </div>
        <div className="coaching-timetable__scroll" role="region" aria-label="Weekly coaching timetable, scroll horizontally for all days" tabIndex={0}>
          <table>
            <caption className="visually-hidden">Weekly coaching timetable</caption>
            <thead><tr><th scope="col">Time</th>{days.map((name) => <th key={name} scope="col">{name}</th>)}</tr></thead>
            <tbody>{rows.map((row) => <tr key={row.time}>
              <th scope="row">{row.time}</th>
              {row.sessions.map((type, index) => <td key={index} className={type && (filter === "all" || filter === type) ? `coaching-timetable__session ${type === "pt" ? "coaching-timetable__session--pt" : ""}` : ""}>
                {type && (filter === "all" || filter === type) ? <span>{classes[type]}</span> : <span aria-label="No matching session">—</span>}
              </td>)}
            </tr>)}</tbody>
          </table>
        </div>
        <p className="coaching-timetable__note">Group classes: £10 per person, maximum 10 people. One-to-one training: £30 per booking, one person per slot. Check the booking calendar for availability.</p>
      </section>
      <section className="coaching-day-sessions" aria-labelledby="day-sessions-title">
        <header className="coaching-schedule-intro"><h2 id="day-sessions-title">Find your next session.</h2><p>Choose a day to see what is on, then head to the calendar to book.</p></header>
        <div className="coaching-schedule-filters" role="group" aria-label="Choose a weekday">
          {days.map((name, index) => <button key={name} type="button" aria-pressed={day === index} onClick={() => setDay(index)}>{name}</button>)}
        </div>
        <ul className="coaching-day-sessions__list" aria-label={`${days[day]} sessions`}>
          {rows.filter((row) => row.sessions[day]).map((row) => {
            const type = row.sessions[day]!;
            return <li key={row.time}><div><h3>{classes[type]}</h3><p>{type === "pt" ? "One-to-one · £30" : "Group class · £10 per person · Up to 10 people"}</p></div><time>{row.time}</time><span>Yousef Jaafar</span><a className="button" href="#register-interest" aria-label={`Book ${classes[type]} on ${days[day]} at ${row.time}`}>Book a session</a></li>;
          })}
        </ul>
      </section>
    </>
  );
}
