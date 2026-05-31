Vybe JMeter Test Plan (instructions)

Place all files in: `d:/MajorProjectFinal/Vybe/load_tests`

1) `users.csv` (already created)
- Columns: `username,password`
- Example rows: `loaduser1,Password123` etc.

2) Open JMeter GUI and build this Test Plan (or use it as a checklist):

Test Plan
- Thread Group (name: AuthReadGroup)
  - Number of Threads (users): start with 10 for smoke
  - Ramp-Up Period (seconds): 10
  - Loop Count: 50 (or as needed)

Config Elements (under Thread Group)
- HTTP Request Defaults
  - Server Name or IP: ${__P(server,lets-vybe.vercel.app)}
  - Protocol: ${__P(protocol,https)}
  - Port Number: leave blank
- CSV Data Set Config
  - Filename: ${__P(csvfile,load_tests/users.csv)}
  - Variable Names: username,password
  - Recycle on EOF: True
  - Stop thread on EOF: False
- HTTP Header Manager
  - Content-Type: application/json
  - Accept: application/json
- HTTP Cookie Manager (defaults)

Samplers (in order)
1) HTTP Request — SignIn
  - Method: POST
  - Path: /api/auth/signin
  - Body Data (raw):
{
  "username": "${username}",
  "password": "${password}"
}
  - Post-Processor: JSON Extractor
    - Variable name: authToken
    - JSON Path: $.token
    - Default: NOT_FOUND

2) HTTP Request — GetCurrentUser
  - Method: GET
  - Path: /api/user/current
  - Header: Authorization: Bearer ${authToken}

3) HTTP Request — Suggested Users
  - GET /api/user/suggested
  - Header: Authorization: Bearer ${authToken}

4) HTTP Request — Get All Stories
  - GET /api/story/getAll
  - Header: Authorization: Bearer ${authToken}

5) HTTP Request — Get Profile
  - GET /api/user/getProfile/${username}
  - Header: Authorization: Bearer ${authToken}

Listeners
- Summary Report
- Aggregate Report
- Simple Data Writer -> results.jtl (path: load_tests/results.jtl)
- (View Results Tree only for debugging)

3) Running JMeter non-GUI (recommended for load)

Smoke test (10 users):

```bash
jmeter -n -t d:/MajorProjectFinal/Vybe/load_tests/vybe_testplan.jmx -Jserver=lets-vybe.vercel.app -Jprotocol=https -l d:/MajorProjectFinal/Vybe/load_tests/results_10.jtl
```

Larger run (100 users — edit Thread Group or use property substitution if configured):

```bash
jmeter -n -t d:/MajorProjectFinal/Vybe/load_tests/vybe_testplan.jmx -Jserver=lets-vybe.vercel.app -Jprotocol=https -l d:/MajorProjectFinal/Vybe/load_tests/results_100.jtl
```

Notes and tips
- Vercel app is HTTPS; cookies set with `secure` won't be sent over plain HTTP, so the JSON `token` extraction and `Authorization` header method is recommended.
- Monitor backend metrics (CPU, memory, MongoDB) during tests.
- For Socket.IO testing use `socket_load.js`:

```bash
cd d:/MajorProjectFinal/Vybe/load_tests
npm init -y
npm install socket.io-client
node socket_load.js 200 https://lets-vybe.vercel.app
```

Want me to generate a ready-to-import `.jmx` file you can open directly in JMeter? I can create it next.