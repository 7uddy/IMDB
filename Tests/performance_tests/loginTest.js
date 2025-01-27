import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let url = 'http://localhost:8000/api/login';
  let payload = JSON.stringify({
    email: 'test@user.com',
    password: 'password123',
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'status was 200': (r) => r.status === 200,
    'response time under 5000ms': (r) => r.timings.duration < 5000,
  });

  sleep(1);
}
