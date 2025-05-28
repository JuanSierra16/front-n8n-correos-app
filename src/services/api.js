import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://example.com/api/emails'
export const fetchEmails = () => axios.get(BASE_URL)