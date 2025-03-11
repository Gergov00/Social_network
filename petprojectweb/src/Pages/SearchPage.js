import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchUsers } from '../Services/Api'; 
import { SearchResults } from '../Components/Search';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const query = useQuery();
    const searchQuery = query.get('query');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                const users = await searchUsers(searchQuery);
                setResults(users);
            } catch (err) {
                setError(err.message);
            }
        }
        if (searchQuery) {
            fetchUsers();
        }
    }, [searchQuery]);

    return (
        <SearchResults users={results} />
    );
};

export default SearchPage;
