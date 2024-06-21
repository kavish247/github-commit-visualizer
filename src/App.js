import React, { useState } from 'react';
import { fetchCommits, fetchPullRequests } from './Api'; // Import the API functions
import SearchForm from './SearchForm';
import './App.css';

const App = () => {
  const [commits, setCommits] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [totalCommits, setTotalCommits] = useState(0);
  const [totalPullRequests, setTotalPullRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({ author: '', startDate: '', endDate: '' });
  const itemsPerPage = 30; // GitHub's default per_page value

  const handleSearch = async (author, startDate, endDate, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch commits
      const commitData = await fetchCommits(author, startDate, endDate, itemsPerPage, page);
      setCommits(commitData.items);
      setTotalCommits(commitData.total_count);

      // Fetch pull requests
      const prData = await fetchPullRequests(author, startDate, endDate, itemsPerPage, page);
      setPullRequests(prData.items);
      setTotalPullRequests(prData.total_count);

      setCurrentPage(page);
      setTotalPages(Math.ceil(commitData.total_count / itemsPerPage));
      setSearchParams({ author, startDate, endDate }); // Store search parameters
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(searchParams.author, searchParams.startDate, searchParams.endDate, newPage);
  };

  return (
    <div className="container">
      <h1>GitHub Activity Visualizer</h1>
      <SearchForm onSearch={(author, startDate, endDate) => handleSearch(author, startDate, endDate, 1)} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <p>Total Commits: {totalCommits}</p>
      <p>Total Pull Requests: {totalPullRequests}</p>
      <h2>Commits</h2>
      <ul>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
              {commit.commit.message}
            </a> by {commit.commit.author.name} on {new Date(commit.commit.author.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h2>Pull Requests</h2>
      <ul>
        {pullRequests.map((pr) => (
          <li key={pr.id}>
            <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
              {pr.title}
            </a> by {pr.user.login} on {new Date(pr.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
