import api from './api';

export async function fetchJobs() {
    const res = await api.get('/jobs');
    console.log(res)
    return res.data || [];
}