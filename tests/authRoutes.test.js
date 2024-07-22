const request = require('supertest');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = require('../index');
const dbPath = path.join(__dirname, '../database/users.json');

beforeAll(() => {
  // Set up initial state before tests run
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
});

afterEach(() => {
  // Clear the database after each test
  fs.writeFileSync(dbPath, JSON.stringify([]));
});

describe('Auth Routes', () => {
  test('GET /login should render the login page', async () => {
    const res = await request(app).get('/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Login');
  });

  test('GET /signup should render the signup page', async () => {
    const res = await request(app).get('/signup');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign Up');
  });

  test('POST /signup should create a new user and redirect to login', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'password' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
    
    const users = JSON.parse(fs.readFileSync(dbPath));
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('testuser');
  });

  test('POST /signup should not allow duplicate usernames or emails', async () => {
    await request(app)
      .post('/signup')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'password' });

    const res = await request(app)
      .post('/signup')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('Username or email already exists');
  });

  test('POST /login should login a user with valid credentials', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = [{ username: 'testuser', email: 'testuser@example.com', password: hashedPassword }];
    fs.writeFileSync(dbPath, JSON.stringify(users));

    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/');
  });

  test('POST /login should not login a user with invalid credentials', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = [{ username: 'testuser', email: 'testuser@example.com', password: hashedPassword }];
    fs.writeFileSync(dbPath, JSON.stringify(users));

    const res = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    expect(res.status).toBe(200);
    expect(res.text).toContain('Invalid username or password');
  });
});
