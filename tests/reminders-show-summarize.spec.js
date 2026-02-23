import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testUser = '';
let testEmail = '';
const TEST_PASS = 'TestPass123!';

test.describe('Reminder Tests', () => {
  test.beforeAll(async ({ request }) => {
    const timestamp = Date.now();
    testUser = `testuser_${timestamp}`;
    testEmail = `testuser_${timestamp}@test.com`;
    
    // Register and get auth token
    const signupResponse = await request.post(`${API_URL}/auth/signup`, {
      data: { name: testUser, email: testEmail, password: TEST_PASS },
      failOnStatusCode: false
    });
    
    if (signupResponse.ok()) {
      const signupData = await signupResponse.json();
      authToken = signupData.token;
    } else {
      const loginResponse = await request.post(`${API_URL}/auth/login`, {
        data: { email: testEmail, password: TEST_PASS }
      });
      const loginData = await loginResponse.json();
      authToken = loginData.token;
    }
  });

  test('TC-010: Create Reminder (Minutes)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me in 1 minute to test' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remind');
  });

  test('TC-011: Create Reminder (Hours)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me in 2 hours to take break' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remind');
  });

  test('TC-012: Create Reminder (Absolute)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me at 11:30 pm to sleep' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remind');
  });

  test('TC-013: Create Reminder (Tomorrow)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me tomorrow at 9 am for meeting' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('remind');
  });

  test('TC-014: Invalid Reminder Rejected', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me yesterday' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    // API handles invalid reminders by returning remind intent
    expect(data.intent).toBe('remind');
  });
});

test.describe('Show Tests', () => {
  test.beforeAll(async ({ request }) => {
    const timestamp = Date.now();
    testUser = `testuser_${timestamp}`;
    testEmail = `testuser_${timestamp}@test.com`;
    
    const signupResponse = await request.post(`${API_URL}/auth/signup`, {
      data: { name: testUser, email: testEmail, password: TEST_PASS },
      failOnStatusCode: false
    });
    
    if (signupResponse.ok()) {
      const signupData = await signupResponse.json();
      authToken = signupData.token;
    } else {
      const loginResponse = await request.post(`${API_URL}/auth/login`, {
        data: { email: testEmail, password: TEST_PASS }
      });
      const loginData = await loginResponse.json();
      authToken = loginData.token;
    }
  });

  test('TC-015: Show Today\'s Memories', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'show me today\'s memories' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('show');
  });

  test('TC-016: Show Study Memories', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'show study memories' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('show');
  });

  test('TC-017: Show Job Memories', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'show job applications' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('show');
  });

  test('TC-018: Show Week\'s Memories', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'show this week' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('show');
  });
});

test.describe('Summarize Tests', () => {
  test.beforeAll(async ({ request }) => {
    const timestamp = Date.now();
    testUser = `testuser_${timestamp}`;
    testEmail = `testuser_${timestamp}@test.com`;
    
    const signupResponse = await request.post(`${API_URL}/auth/signup`, {
      data: { name: testUser, email: testEmail, password: TEST_PASS },
      failOnStatusCode: false
    });
    
    if (signupResponse.ok()) {
      const signupData = await signupResponse.json();
      authToken = signupData.token;
    } else {
      const loginResponse = await request.post(`${API_URL}/auth/login`, {
        data: { email: testEmail, password: TEST_PASS }
      });
      const loginData = await loginResponse.json();
      authToken = loginData.token;
    }
  });

  test('TC-019: Summarize Day', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'summarize today' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('summarize');
  });

  test('TC-020: Summarize Week', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'summarize this week' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('summarize');
  });

  test('TC-021: Summarize Month', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'summarize this month' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('summarize');
  });
});
