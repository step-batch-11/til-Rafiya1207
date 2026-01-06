// scripts/generate_til.js

const LOG_DIR = 'logs';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayName(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

// ISO week number
function isoWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const today = new Date();
const dateStr = formatDate(today);
const fileName = `${dateStr}.md`;
const filePath = `${LOG_DIR}/${fileName}`;

await Deno.mkdir(LOG_DIR, { recursive: true });

try {
  await Deno.stat(filePath);
  console.log(`TIL for today already exists: ${filePath}`);
  Deno.exit(0);
} catch {
  // File does not exist → continue
}

const template = `---
date: ${dateStr}
day: ${dayName(today)}
week: ${isoWeekNumber(today)}
---

# Topics Covered In Session


# Confusing


# Questions


# Things To Explore/Try


# Learnings Of The Day


# What Have I Done Today


# Things To Do Tomorrow


> Today was useful because **___**.
`;

await Deno.writeTextFile(filePath, template);

console.log(`Created TIL log: ${filePath}`);
