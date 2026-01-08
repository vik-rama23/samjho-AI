import api from './api';

export async function fetchJobs() {
    const res = await api.get('/jobs');
    return res.data || [];
}