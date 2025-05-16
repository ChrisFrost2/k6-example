import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');
const throughput = new Rate('throughput');

export const options = {
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 1,
            timeUnit: '1s',
            duration: '10s',
            preAllocatedVUs: 100
        },
    },
    thresholds: {
        'response_time': [
            { threshold: 'p(50) < 200', timeUnit: 'ms' },
            { threshold: 'p(95) < 400', timeUnit: 'ms' },
            { threshold: 'p(99) < 600', timeUnit: 'ms' },
        ]       
    },
    summaryTrendStats: ['p(50)', 'p(95)', 'p(99)'],
};

export default function () {
    const params = {
        headers: { 'x-api-key': 'reqres-free-v1' },
    };
    const res = http.get('https://reqres.in/api/users?page=1', params);
    const success = check(res, {
        'is status 200': (r) => r.status === 200,
    });
    responseTime.add(res.timings.duration);
    errorRate.add(!success);
    throughput.add(success);   
}

export function handleSummary(data) {
    return {
        "reports/summary.html": htmlReport(data),
    };
}