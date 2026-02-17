// Native fetch is available in Node 18+

const BASE_URL = 'http://localhost:5000';
const ADMIN_CREDENTIALS = {
    username: 'hariom',
    password: 'hari@123'
};

async function runTest() {
    console.log('🚀 Starting End-to-End API Test...\n');

    // 1. LOGIN
    console.log('1️⃣  Logging in...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ADMIN_CREDENTIALS)
    });

    if (!loginRes.ok) {
        throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log('✅ Login successful! Token received.');

    // 2. GENERATE SERVICE WITH AI
    console.log('\n2️⃣  Testing AI Auto-Fill (Satyanarayan Puja)...');
    const aiRes = await fetch(`${BASE_URL}/api/ai/generate-service`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: 'Satyanarayan Puja' })
    });

    if (!aiRes.ok) {
        const err = await aiRes.text();
        throw new Error(`AI generation failed: ${aiRes.status} - ${err}`);
    }

    const aiData = await aiRes.json();
    console.log('✅ AI Generation successful!');
    console.log('   Title:', aiData.title);
    console.log('   Price:', aiData.priceRange);
    console.log('   Description:', aiData.description.substring(0, 50) + '...');

    // 3. CREATE SERVICE
    console.log('\n3️⃣  Creating Service in Database...');
    const serviceData = {
        ...aiData,
        image: '/images/default-service.jpg' // Placeholder
    };

    const createRes = await fetch(`${BASE_URL}/api/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
    });

    if (!createRes.ok) {
        const err = await createRes.text();
        throw new Error(`Service creation failed: ${createRes.status} - ${err}`);
    }

    const newService = await createRes.json();
    console.log('✅ Service created successfully!');
    console.log('   ID:', newService.id);

    // 4. VERIFY IT EXISTS
    console.log('\n4️⃣  Verifying Public Availability...');
    const listRes = await fetch(`${BASE_URL}/api/services`);
    const listData = await listRes.json();

    const found = listData.find(s => s.id === newService.id);
    if (found) {
        console.log('✅ Verified! Service is live and listed.');
    } else {
        throw new Error('Service created but not found in list!');
    }

    console.log('\n🎉 ALL TESTS PASSED!');
}

runTest().catch(err => {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
});
