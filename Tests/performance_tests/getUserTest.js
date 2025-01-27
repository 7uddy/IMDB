import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const username = 'a';
  const url = `http://localhost:8000/api/user/${username}`;

  const res = http.get(url);

  check(res, {
    'status was 200': (r) => r.status === 200,
    'response time under 3000ms': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
