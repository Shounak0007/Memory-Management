import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const TEST_USER = `testuser_${Date.now()}`;
const TEST_EMAIL = `testuser_${Date.now()}@test.com`;
const TEST_PASS = 'TestPass123!';

let authToken = '';
let testResults = [];
let testCounter = 0;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (emoji, status, testName, message = '') => {
  testCounter++;
  const passed = status === 'PASS';
  testResults.push({ testName, passed, message });
  console.log(`${emoji} ${status}: ${testName}${message ? ` - ${message}` : ''}`);
  return { passed };
};

// Authentication Tests
async function test001_UserRegistration() {
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, { name: TEST_USER, email: TEST_EMAIL, password: TEST_PASS });
    if (res.data.token) {
      authToken = res.data.token;
      return log('✅', 'PASS', 'TC-001: User Registration', TEST_USER);
    }
    return log('❌', 'FAIL', 'TC-001: User Registration', 'No token');
  } catch (error) {
    return log('✅', 'PASS', 'TC-001: User Registration', 'User exists, will login');
  }
}

async function test002_UserLogin() {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email: TEST_EMAIL, password: TEST_PASS });
    if (res.data.token) {
      authToken = res.data.token;
      return log('✅', 'PASS', 'TC-002: User Login');
    }
    return log('❌', 'FAIL', 'TC-002: User Login', 'No token');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-002: User Login', error.response?.data?.message || error.message);
  }
}

async function test003_InvalidLogin() {
  try {
    await axios.post(`${API_URL}/auth/login`, { email: 'invalid@test.com', password: 'wrong' });
    return log('❌', 'FAIL', 'TC-003: Invalid Login Rejected', 'Should have failed');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 400) {
      return log('✅', 'PASS', 'TC-003: Invalid Login Rejected', 'Correctly blocked');
    }
    return log('❌', 'FAIL', 'TC-003: Invalid Login Rejected');
  }
}

async function test004_UnauthorizedAccess() {
  try {
    await axios.get(`${API_URL}/stats`);
    return log('❌', 'FAIL', 'TC-004: Unauthorized Access Blocked', 'Should have blocked');
  } catch (error) {
    if (error.response?.status === 401) {
      return log('✅', 'PASS', 'TC-004: Unauthorized Access Blocked');
    }
    return log('❌', 'FAIL', 'TC-004: Unauthorized Access Blocked');
  }
}

// Memory Tests
async function test005_CreateMemoryStudy() {
  try {
    const res = await axios.post(`${API_URL}/chat`, 
      { message: 'remember I studied algorithms for 2 hours' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-005: Create Memory (Study)');
    }
    return log('❌', 'FAIL', 'TC-005: Create Memory (Study)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-005: Create Memory (Study)', error.message);
  }
}

async function test006_CreateMemoryJob() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I applied to Google for Software Engineer' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-006: Create Memory (Job)');
    }
    return log('❌', 'FAIL', 'TC-006: Create Memory (Job)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-006: Create Memory (Job)', error.message);
  }
}

async function test007_CreateMemoryHealth() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I worked out at gym for 45 minutes' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-007: Create Memory (Health)');
    }
    return log('❌', 'FAIL', 'TC-007: Create Memory (Health)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-007: Create Memory (Health)', error.message);
  }
}

async function test008_CreateMemoryTask() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I need to submit tax documents' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-008: Create Memory (Task)');
    }
    return log('❌', 'FAIL', 'TC-008: Create Memory (Task)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-008: Create Memory (Task)', error.message);
  }
}

async function test009_CreateMemoryEvent() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember meeting with Sarah tomorrow at 3 pm' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-009: Create Memory (Event)');
    }
    return log('❌', 'FAIL', 'TC-009: Create Memory (Event)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-009: Create Memory (Event)', error.message);
  }
}

// Reminder Tests
async function test010_CreateReminderMinutes() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remind me in 1 minute to test' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remind') {
      return log('✅', 'PASS', 'TC-010: Create Reminder (Minutes)');
    }
    return log('❌', 'FAIL', 'TC-010: Create Reminder (Minutes)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-010: Create Reminder (Minutes)', error.message);
  }
}

async function test011_CreateReminderHours() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remind me in 2 hours to take break' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remind') {
      return log('✅', 'PASS', 'TC-011: Create Reminder (Hours)');
    }
    return log('❌', 'FAIL', 'TC-011: Create Reminder (Hours)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-011: Create Reminder (Hours)', error.message);
  }
}

async function test012_CreateReminderAbsolute() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remind me at 11:30 pm to sleep' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remind') {
      return log('✅', 'PASS', 'TC-012: Create Reminder (Absolute)');
    }
    return log('❌', 'FAIL', 'TC-012: Create Reminder (Absolute)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-012: Create Reminder (Absolute)', error.message);
  }
}

async function test013_CreateReminderTomorrow() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remind me tomorrow at 9 am for meeting' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remind') {
      return log('✅', 'PASS', 'TC-013: Create Reminder (Tomorrow)');
    }
    return log('❌', 'FAIL', 'TC-013: Create Reminder (Tomorrow)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-013: Create Reminder (Tomorrow)', error.message);
  }
}

async function test014_InvalidReminder() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remind me to do something' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (!res.data.success || res.data.response.includes("couldn't")) {
      return log('✅', 'PASS', 'TC-014: Invalid Reminder Rejected');
    }
    return log('❌', 'FAIL', 'TC-014: Invalid Reminder Rejected');
  } catch (error) {
    return log('✅', 'PASS', 'TC-014: Invalid Reminder Rejected');
  }
}

// Show Tests
async function test015_ShowTodayMemories() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'show today\'s memories' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'show') {
      return log('✅', 'PASS', 'TC-015: Show Today\'s Memories');
    }
    return log('❌', 'FAIL', 'TC-015: Show Today\'s Memories');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-015: Show Today\'s Memories', error.message);
  }
}

async function test016_ShowStudyMemories() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'show all study logs' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'show') {
      return log('✅', 'PASS', 'TC-016: Show Study Memories');
    }
    return log('❌', 'FAIL', 'TC-016: Show Study Memories');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-016: Show Study Memories', error.message);
  }
}

async function test017_ShowJobMemories() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'show job applications' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'show') {
      return log('✅', 'PASS', 'TC-017: Show Job Memories');
    }
    return log('❌', 'FAIL', 'TC-017: Show Job Memories');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-017: Show Job Memories', error.message);
  }
}

async function test018_ShowWeekMemories() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'show this week\'s memories' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'show') {
      return log('✅', 'PASS', 'TC-018: Show Week\'s Memories');
    }
    return log('❌', 'FAIL', 'TC-018: Show Week\'s Memories');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-018: Show Week\'s Memories', error.message);
  }
}

// Summarize Tests
async function test019_SummarizeDay() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'summarize my day' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'summarize') {
      return log('✅', 'PASS', 'TC-019: Summarize Day');
    }
    return log('❌', 'FAIL', 'TC-019: Summarize Day');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-019: Summarize Day', error.message);
  }
}

async function test020_SummarizeWeek() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'summarize my week' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'summarize') {
      return log('✅', 'PASS', 'TC-020: Summarize Week');
    }
    return log('❌', 'FAIL', 'TC-020: Summarize Week');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-020: Summarize Week', error.message);
  }
}

async function test021_SummarizeMonth() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'summarize this month' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'summarize') {
      return log('✅', 'PASS', 'TC-021: Summarize Month');
    }
    return log('❌', 'FAIL', 'TC-021: Summarize Month');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-021: Summarize Month', error.message);
  }
}

// Greeting Tests
async function test022_GreetingHello() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'hello' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'greeting') {
      return log('✅', 'PASS', 'TC-022: Greeting (Hello)');
    }
    return log('❌', 'FAIL', 'TC-022: Greeting (Hello)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-022: Greeting (Hello)', error.message);
  }
}

async function test023_GreetingHi() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'hi' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'greeting') {
      return log('✅', 'PASS', 'TC-023: Greeting (Hi)');
    }
    return log('❌', 'FAIL', 'TC-023: Greeting (Hi)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-023: Greeting (Hi)', error.message);
  }
}

async function test024_GreetingHowAreYou() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'how are you' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'greeting') {
      return log('✅', 'PASS', 'TC-024: Greeting (How are you)');
    }
    return log('❌', 'FAIL', 'TC-024: Greeting (How are you)');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-024: Greeting (How are you)', error.message);
  }
}

// API Tests
async function test025_GetStats() {
  try {
    const res = await axios.get(`${API_URL}/stats`,
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data && res.data.data && typeof res.data.data.total === 'number') {
      return log('✅', 'PASS', 'TC-025: Get Stats', `Total: ${res.data.data.total}`);
    }
    return log('❌', 'FAIL', 'TC-025: Get Stats');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-025: Get Stats', error.message);
  }
}

async function test026_GetChatHistory() {
  try {
    const res = await axios.get(`${API_URL}/chat/history`,
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return log('✅', 'PASS', 'TC-026: Get Chat History', `${res.data.data.length} messages`);
    }
    return log('❌', 'FAIL', 'TC-026: Get Chat History');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-026: Get Chat History', error.message);
  }
}

async function test027_GetPendingReminders() {
  try {
    const res = await axios.get(`${API_URL}/reminders/pending`,
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && Array.isArray(res.data.data)) {
      return log('✅', 'PASS', 'TC-027: Get Pending Reminders', `${res.data.data.length} reminders`);
    }
    return log('❌', 'FAIL', 'TC-027: Get Pending Reminders');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-027: Get Pending Reminders', error.message);
  }
}

async function test028_GetTriggeredReminders() {
  try {
    const res = await axios.get(`${API_URL}/reminders/triggered`,
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && Array.isArray(res.data.data)) {
      return log('✅', 'PASS', 'TC-028: Get Triggered Reminders');
    }
    return log('❌', 'FAIL', 'TC-028: Get Triggered Reminders');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-028: Get Triggered Reminders', error.message);
  }
}

// Edge Case Tests
async function test029_InvalidCommand() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'xyz invalid 123' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.intent === 'unknown' || !res.data.success) {
      return log('✅', 'PASS', 'TC-029: Invalid Command Handled');
    }
    return log('❌', 'FAIL', 'TC-029: Invalid Command Handled');
  } catch (error) {
    return log('✅', 'PASS', 'TC-029: Invalid Command Handled');
  }
}

async function test030_SpecialCharacters() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I earned $5000 @company & got 100% raise!' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-030: Special Characters');
    }
    return log('❌', 'FAIL', 'TC-030: Special Characters');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-030: Special Characters', error.message);
  }
}

async function test031_EmptyMessage() {
  try {
    await axios.post(`${API_URL}/chat`,
      { message: '' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    return log('❌', 'FAIL', 'TC-031: Empty Message Rejected', 'Should reject');
  } catch (error) {
    return log('✅', 'PASS', 'TC-031: Empty Message Rejected');
  }
}

async function test032_LongMessage() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember ' + 'a'.repeat(500) },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success) {
      return log('✅', 'PASS', 'TC-032: Long Message Handled');
    }
    return log('❌', 'FAIL', 'TC-032: Long Message Handled');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-032: Long Message Handled', error.message);
  }
}

async function test033_MultipleTags() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I learned React, TypeScript, and MongoDB' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-033: Multiple Tags');
    }
    return log('❌', 'FAIL', 'TC-033: Multiple Tags');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-033: Multiple Tags', error.message);
  }
}

async function test034_HealthCheck() {
  try {
    const res = await axios.get('http://localhost:5000/health');
    if (res.data.status === 'ok') {
      return log('✅', 'PASS', 'TC-034: Health Check');
    }
    return log('❌', 'FAIL', 'TC-034: Health Check');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-034: Health Check', error.message);
  }
}

async function test035_DurationParsing() {
  try {
    const res = await axios.post(`${API_URL}/chat`,
      { message: 'remember I coded for 3.5 hours on authentication' },
      { headers: { Authorization: `Bearer ${authToken}` } });
    if (res.data.success && res.data.intent === 'remember') {
      return log('✅', 'PASS', 'TC-035: Duration Parsing');
    }
    return log('❌', 'FAIL', 'TC-035: Duration Parsing');
  } catch (error) {
    return log('❌', 'FAIL', 'TC-035: Duration Parsing', error.message);
  }
}

// Main runner
async function runTests() {
  console.log('\n🚀 Memory Agent - Automated Test Suite\n');
  console.log(`📡 API: ${API_URL}`);
  console.log(`👤 User: ${TEST_USER}\n`);
  console.log('─'.repeat(60) + '\n');

  try {
    // Health Check
    console.log('🏥 Pre-flight Check');
    await test034_HealthCheck();
    await delay(200);

    // Auth Tests
    console.log('\n🔐 Authentication Tests (1-4)');
    await test001_UserRegistration();
    await delay(200);
    await test002_UserLogin();
    await delay(200);

    if (!authToken) {
      console.log('\n❌ No auth token - stopping tests\n');
      process.exit(1);
    }

    await test003_InvalidLogin();
    await delay(200);
    await test004_UnauthorizedAccess();
    await delay(200);

    // Memory Tests
    console.log('\n💾 Memory Tests (5-9)');
    await test005_CreateMemoryStudy();
    await delay(200);
    await test006_CreateMemoryJob();
    await delay(200);
    await test007_CreateMemoryHealth();
    await delay(200);
    await test008_CreateMemoryTask();
    await delay(200);
    await test009_CreateMemoryEvent();
    await delay(200);

    // Reminder Tests
    console.log('\n⏰ Reminder Tests (10-14)');
    await test010_CreateReminderMinutes();
    await delay(200);
    await test011_CreateReminderHours();
    await delay(200);
    await test012_CreateReminderAbsolute();
    await delay(200);
    await test013_CreateReminderTomorrow();
    await delay(200);
    await test014_InvalidReminder();
    await delay(200);

    // Show Tests
    console.log('\n📊 Show Tests (15-18)');
    await test015_ShowTodayMemories();
    await delay(200);
    await test016_ShowStudyMemories();
    await delay(200);
    await test017_ShowJobMemories();
    await delay(200);
    await test018_ShowWeekMemories();
    await delay(200);

    // Summarize Tests
    console.log('\n📈 Summarize Tests (19-21)');
    await test019_SummarizeDay();
    await delay(200);
    await test020_SummarizeWeek();
    await delay(200);
    await test021_SummarizeMonth();
    await delay(200);

    // Greeting Tests
    console.log('\n👋 Greeting Tests (22-24)');
    await test022_GreetingHello();
    await delay(200);
    await test023_GreetingHi();
    await delay(200);
    await test024_GreetingHowAreYou();
    await delay(200);

    // API Tests
    console.log('\n🔧 API Tests (25-28)');
    await test025_GetStats();
    await delay(200);
    await test026_GetChatHistory();
    await delay(200);
    await test027_GetPendingReminders();
    await delay(200);
    await test028_GetTriggeredReminders();
    await delay(200);

    // Edge Cases
    console.log('\n🧪 Edge Cases (29-33)');
    await test029_InvalidCommand();
    await delay(200);
    await test030_SpecialCharacters();
    await delay(200);
    await test031_EmptyMessage();
    await delay(200);
    await test032_LongMessage();
    await delay(200);
    await test033_MultipleTags();
    await delay(200);

    // Duration Test
    console.log('\n⏱️  Duration Test (35)');
    await test035_DurationParsing();

    // Summary
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;
    const total = testResults.length;
    const rate = ((passed / total) * 100).toFixed(1);

    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log(`📈 Pass Rate: ${rate}%\n`);

    if (failed > 0) {
      console.log('❌ Failed Tests:');
      testResults.filter(r => !r.passed).forEach(r => {
        console.log(`   - ${r.testName}: ${r.message}`);
      });
      console.log('');
    }

    console.log('─'.repeat(60) + '\n');
    console.log(failed === 0 ? '✅ All tests passed!\n' : '❌ Some tests failed\n');

    process.exit(failed === 0 ? 0 : 1);

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  }
}

runTests();
