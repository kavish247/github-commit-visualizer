// api.js
import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

const headers = {
  'Accept': 'application/vnd.github.cloak-preview',
  'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
};

export const fetchCommits = async (author, startDate, endDate, itemsPerPage, page) => {
  const response = await axios.get(
    `${GITHUB_API_URL}/search/commits?q=org:saltpay+author:${author}+committer-date:${startDate}..${endDate}&per_page=${itemsPerPage}&page=${page}`,
    { headers }
  );
  return response.data;
};

export const fetchPullRequests = async (author, startDate, endDate, itemsPerPage, page) => {
  const response = await axios.get(
    `${GITHUB_API_URL}/search/issues?q=type:pr+org:saltpay+author:${author}+created:${startDate}..${endDate}&per_page=${itemsPerPage}&page=${page}`,
    { headers: { ...headers, 'Accept': 'application/vnd.github.v3+json' } }
  );
  return response.data;
};
