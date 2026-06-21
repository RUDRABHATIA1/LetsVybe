(async () => {
    const base = 'http://localhost:4000';
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Wait for server health
    console.log('Waiting for server to become healthy...');
    for (let i = 0; i < 60; i++) {
        try {
            const r = await fetch(`${base}/api/health`);
            if (r.ok) {
                console.log('Server is healthy.');
                break;
            }
        } catch (e) {
            // ignore
        }
        process.stdout.write('.');
        await sleep(1000);
    }

    const id = Date.now();
    const user = {
        name: 'Test User',
        email: `test${id}@example.com`,
        username: `test${id}`,
        password: 'password123'
    };

    try {
        console.log('\nSigning up test user...');
        let res = await fetch(`${base}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        let text = await res.text();
        console.log('Signup status:', res.status, text);

        let cookie = res.headers.get('set-cookie');
        if (!cookie) {
            console.log('No set-cookie header on signup, attempting signin...');
            res = await fetch(`${base}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, password: user.password })
            });
            text = await res.text();
            console.log('Signin status:', res.status, text);
            cookie = res.headers.get('set-cookie');
        }

        if (!cookie) {
            console.error('Failed to obtain authentication cookie. Stopping.');
            process.exit(1);
        }

        // Helper to send authenticated POST
        const authPost = async (path, body) => {
            const r = await fetch(`${base}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie
                },
                body: JSON.stringify(body || {})
            });
            return r;
        };

        console.log('\nPing before loan:');
        let pingRes = await authPost('/api/user/consumption/ping');
        console.log(await pingRes.text());

        console.log('\nTaking 5min loan:');
        let loanRes = await authPost('/api/user/consumption/loan', { loanType: '5min' });
        console.log(await loanRes.text());

        console.log('\nPing after loan:');
        pingRes = await authPost('/api/user/consumption/ping');
        console.log(await pingRes.text());

        console.log('\nTest script finished.');
    } catch (err) {
        console.error('Test script error:', err);
    }
})();
