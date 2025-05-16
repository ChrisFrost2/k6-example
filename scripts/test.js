import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import operations from "../utils/parametersAndOperations.js"

const responseTime = new Trend('response_time');
const errorRate = new Rate('error_rate');

export default function () {
    let response = operations.get(`https://reqres.in/api/users?page=1`, `Fetches a user list`);
    let success = check(response, {
        "status equals 200": response => response.status === 200,
    });   
    responseTime.add(response.timings.duration);
    errorRate.add(!success);  
}

export function handleSummary(data) {    
}