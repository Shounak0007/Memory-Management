import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testUser = '';
let testEmail = '';
const TEST_PASS = 'TestPass123!';

test.describe('Authentication Tests', () => {
  test.beforeAll(() => {
    const timestamp = Date.now();
    testUser = `testuser_${timestamp}`;
    testEmail = `testuser_${timestamp}@test.com`;
  });

  test('TC-001: User Registration', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { 
        name: testUser, 
        email: testEmail, 
        password: TEST_PASS 
      },
      failOnStatusCode: false
    });
    
    const data = await response.json();
    
    if (response.ok()) {
      expect(data.token).toBeTruthy();
      authToken = data.token;
    } else {
      // User already exists, try login
      expect(response.status()).toBe(400);
    }
  });

  test('TC-002: User Login', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: { 
        email: testEmail, 
        password: TEST_PASS 
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.token).toBeTruthy();
    authToken = data.token;
  });

  test('TC-003: Invalid Login Rejected', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/login`, {
      data: { 
        email: 'invalid@test.com', 
        password: 'wrong' 
      },
      failOnStatusCode: false
    });
    
    expect([400, 401]).toContain(response.status());
  });

  test('TC-004: Unauthorized Access Blocked', async ({ request }) => {
    const response = await request.get(`${API_URL}/stats`, {
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(401);
  });
});

test.describe('Memory Tests', () => {
  test.beforeAll(() => {
    const timestamp = Date.now();
    testUser = `testuser_${timestamp}`;
    testEmail = `testuser_${timestamp}@test.com`;
  });

  test.beforeEach(async ({ request }) => {
    // Ensure we have a valid auth token
    if (!authToken) {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: { 
          email: testEmail, 
          password: TEST_PASS 
        },
        failOnStatusCode: false
      });
      
      if (response.ok()) {
        const data = await response.json();
        authToken = data.token;
      } else {
        // Register first
        const signupResponse = await request.post(`${API_URL}/auth/signup`, {
          data: { 
            name: testUser, 
            email: testEmail, 
            password: TEST_PASS 
          }
        });
        const signupData = await signupResponse.json();
        authToken = signupData.token;
      }
    }
  });

  test('TC-005: Create Memory (Study)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember I studied algorithms for 2 hours' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remember');
  });

  test('TC-006: Create Memory (Job)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember I applied to Google for Software Engineer' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remember');
  });

  test('TC-007: Create Memory (Health)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember I worked out at gym for 45 minutes' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remember');
  });

  test('TC-008: Create Memory (Task)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember I need to submit tax documents' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remember');
  });

  test('TC-009: Create Memory (Event)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember meeting with Sarah tomorrow at 3 pm' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remember');
  });
});
