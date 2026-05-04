const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/todos.db');

let db;

async function init() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      role       TEXT    NOT NULL DEFAULT 'user',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS todos (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title      TEXT    NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
  `);

  persist();
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Wrap sql.js to mimic better-sqlite3's synchronous API
function getDb() {
  return {
    prepare(sql) {
      return {
        // Returns first matching row as an object, or undefined
        get(...params) {
          const stmt = db.prepare(sql);
          stmt.bind(params.flat());
          if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return convertRow(row);
          }
          stmt.free();
          return undefined;
        },
        // Returns all matching rows as an array of objects
        all(...params) {
          const rows = [];
          const stmt = db.prepare(sql);
          stmt.bind(params.flat());
          while (stmt.step()) {
            rows.push(convertRow(stmt.getAsObject()));
          }
          stmt.free();
          return rows;
        },
        // Executes a write statement, returns { lastInsertRowid, changes }
        run(...params) {
          const stmt = db.prepare(sql);
          stmt.bind(params.flat());
          stmt.step();
          stmt.free();
          const lastInsertRowid = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0] ?? 0;
          persist();
          return { lastInsertRowid };
        },
      };
    },
    exec(sql) {
      const result = db.exec(sql);
      persist();
      return result;
    },
  };
}

// sql.js returns BigInt for INTEGER columns sometimes; normalize to number/string
function convertRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = typeof v === 'bigint' ? Number(v) : v;
  }
  return out;
}

module.exports = { init, getDb };
