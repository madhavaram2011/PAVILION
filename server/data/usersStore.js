/**
 * In-memory Users data store with demo accounts.
 */
import bcrypt from 'bcryptjs';

let nextId = 3;
const generateId = () => `u${nextId++}`;

// Pre-hash passwords for demo users (password: "password123")
const hashedPw = bcrypt.hashSync('password123', 12);

const USERS = [
  {
    id: 'u1',
    name: 'Arjun Sharma',
    email: 'arjun@pavilion.dev',
    password: hashedPw,
    role: 'admin',
    places: ['p1', 'p2', 'p3', 'p4', 'p7', 'p9', 'p11', 'p13', 'p15'],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'u2',
    name: 'Priya Patel',
    email: 'priya@pavilion.dev',
    password: hashedPw,
    role: 'user',
    places: ['p5', 'p6', 'p8', 'p10', 'p12', 'p14'],
    createdAt: '2024-01-15T00:00:00.000Z',
  },
];

// ── CRUD Operations ──────────────────────────────────────────────

export function getAllUsers() {
  return USERS.map(({ password, ...user }) => user);
}

export function getUserById(id) {
  const user = USERS.find(u => u.id === id);
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export function getUserByEmail(email) {
  return USERS.find(u => u.email === email) || null;
}

/** Returns full user with password for auth checks */
export function getUserByEmailWithPassword(email) {
  return USERS.find(u => u.email === email) || null;
}

export async function createUser({ name, email, password: rawPassword }) {
  const hashed = await bcrypt.hash(rawPassword, 12);
  const newUser = {
    id: generateId(),
    name,
    email,
    password: hashed,
    role: 'user',
    places: [],
    createdAt: new Date().toISOString(),
  };
  USERS.push(newUser);
  const { password, ...safe } = newUser;
  return safe;
}

export function addPlaceToUser(userId, placeId) {
  const user = USERS.find(u => u.id === userId);
  if (user && !user.places.includes(placeId)) {
    user.places.push(placeId);
  }
}

export function removePlaceFromUser(userId, placeId) {
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.places = user.places.filter(p => p !== placeId);
  }
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByEmailWithPassword,
  createUser,
  addPlaceToUser,
  removePlaceFromUser,
};
