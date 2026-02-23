import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testUser = '';
let testEmail = '';
const TEST_PASS = 'TestPass123!';

test.describe('Greeting Tests', () => {
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

  test('TC-022: Greeting (Hello)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'hello' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('greeting');
  });

  test('TC-023: Greeting (Hi)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'hi' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('greeting');
  });

  test('TC-024: Greeting (How are you)', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'how are you' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.intent).toBe('greeting');
  });
});

test.describe('API Tests', () => {
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

  test('TC-025: Get Stats', async ({ request }) => {
    const response = await request.get(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.data).toBeTruthy();
    expect(typeof data.data.total).toBe('number');
  });

  test('TC-026: Get Chat History', async ({ request }) => {
    const response = await request.get(`${API_URL}/chat/history`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('TC-027: Get Pending Reminders', async ({ request }) => {
    const response = await request.get(`${API_URL}/reminders/pending`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('TC-028: Get Triggered Reminders', async ({ request }) => {
    const response = await request.get(`${API_URL}/reminders/triggered`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});

test.describe('Edge Cases', () => {
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

  test('TC-029: Invalid Command Handled', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'xyz123abc' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    // API returns response even for invalid commands
    expect(data).toBeTruthy();
  });

  test('TC-030: Special Characters', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember meeting @ 3pm with John & Jane!' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('TC-031: Empty Message Rejected', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: '' },
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false
    });
    
    expect(response.status()).toBe(400);
  });

  test('TC-032: Long Message Handled', async ({ request }) => {
    const longMessage = 'remember ' + 'word '.repeat(100);
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: longMessage },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('TC-033: Multiple Tags', async ({ request }) => {
    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remember meeting about project deadline #work #important #urgent' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

test.describe('Health Check', () => {
  test('TC-034: Health Check', async ({ request }) => {
    const response = await request.get('http://localhost:5000/health');
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeTruthy();
  });

  test('TC-035: Duration Parsing', async ({ request }) => {
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

    const response = await request.post(`${API_URL}/chat`, {
      data: { message: 'remind me in 30 seconds to check' },
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    // API responds to reminder request
    expect(data).toBeTruthy();
    expect(data.intent).toBe('remind');
  });
});
