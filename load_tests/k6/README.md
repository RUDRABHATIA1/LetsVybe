# Vybe k6 Load Test Setup

This folder contains the k6 script for load testing the Vybe backend.

## What it tests

- Health endpoint and root health response
- Sign-in load
- Authenticated reads: posts, loops, current user, suggested users, stories, following list, notifications, message history, profile lookup
- Write actions when IDs are provided: follow, like post, like loop, comment on post, comment on loop, story view

## Base URL

Use the backend, not the frontend:

- Production backend: `https://letsvybe.onrender.com`

## Run examples

Smoke test:

```bash
k6 run -e BASE_URL=https://letsvybe.onrender.com d:/MajorProjectFinal/Vybe/load_tests/k6/vybe_k6_script.txt
```

Auth read test with login credentials:

```bash
k6 run \
  -e BASE_URL=https://letsvybe.onrender.com \
  -e USERNAME=your_username \
  -e PASSWORD=your_password \
  d:/MajorProjectFinal/Vybe/load_tests/k6/vybe_k6_script.txt
```

Test specific write/read targets:

```bash
k6 run \
  -e BASE_URL=https://letsvybe.onrender.com \
  -e USERNAME=your_username \
  -e PASSWORD=your_password \
  -e TARGET_USERNAME=target_user \
  -e TARGET_USER_ID=66xxxxxxxxxxxxxxxxxxxxxx \
  -e POST_ID=66xxxxxxxxxxxxxxxxxxxxxx \
  -e LOOP_ID=66xxxxxxxxxxxxxxxxxxxxxx \
  -e STORY_ID=66xxxxxxxxxxxxxxxxxxxxxx \
  -e RECEIVER_ID=66xxxxxxxxxxxxxxxxxxxxxx \
  d:/MajorProjectFinal/Vybe/load_tests/k6/vybe_k6_script.txt
```

Windows Command Prompt example with HTML and JSON output files:

```bat
k6 run -e BASE_URL=https://letsvybe.onrender.com -e USERNAME=your_username -e PASSWORD=your_password --out json=d:/MajorProjectFinal/Vybe/load_tests/k6/results.json d:/MajorProjectFinal/Vybe/load_tests/k6/vybe_k6_script.txt
```

100k-scale all-API sweep from Command Prompt:

```bat
k6 run -e BASE_URL=https://letsvybe.onrender.com -e USERNAME=your_username -e PASSWORD=your_password -e TARGET_USERNAME=target_user -e TARGET_USER_ID=66xxxxxxxxxxxxxxxxxxxxxx -e POST_ID=66xxxxxxxxxxxxxxxxxxxxxx -e LOOP_ID=66xxxxxxxxxxxxxxxxxxxxxx -e STORY_ID=66xxxxxxxxxxxxxxxxxxxxxx -e RECEIVER_ID=66xxxxxxxxxxxxxxxxxxxxxx -e OTP=1234 --out json=d:/MajorProjectFinal/Vybe/load_tests/k6/results_100k.json d:/MajorProjectFinal/Vybe/load_tests/k6/vybe_100k_all_apis.txt
```

You can raise the pressure by setting these environment values:

- `HEALTH_VUS=200`
- `SIGNIN_VUS=1000`
- `READ_VUS=5000`
- `WRITE_VUS=1000`
- `OTP_VUS=500`

If you need a true 100k concurrent-user experiment, run k6 in distributed/cloud mode because one laptop will not hold 100k active VUs reliably.

If you want a human-readable summary from the raw JSON, keep the JSON output and then open it in Grafana or convert it with your own parser.

## Notes

- `signin` returns a token in the JSON response, and the script reuses it as `Authorization: Bearer <token>`.
- File upload endpoints are not included here because they need multipart file fixtures; add them later if you want upload benchmarking.
- Socket.IO is not covered by k6 HTTP tests; use a dedicated websocket load script for realtime traffic.
- The post, loop, story, and messaging read routes are authenticated in Vybe, so the k6 script logs in before calling them.
- The plain-text `.txt` script is valid as long as you point `k6 run` at it directly.
- The `vybe_100k_all_apis.txt` file is the aggressive all-endpoint script.
