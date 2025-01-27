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
  const movie_id = 9;
  const url = `http://localhost:8000/api/allreviews/${movie_id}`;
  
  const res = http.get(url);

  check(res, {
    'status was 200': (r) => r.status === 200,
    'response time under 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
