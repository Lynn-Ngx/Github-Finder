import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
    SEARCH_USERS,
    GET_USER,
    GET_REPOS,
    SET_LOADING,
    CLEAR_USERS,
} from '../types'

let githubClientId;
let githubClientSecret;

if(process.env.NODE_ENV !== 'production'){
    githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID
    githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET
}else{
    githubClientId = process.env.GITHUB_CLIENT_ID
    githubClientSecret = process.env.GITHUB_CLIENT_SECRET
}

const GithubState = props => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    const [state, dispatch] = useReducer(GithubReducer, initialState)

    // Search Github Users
    const searchUsers = async text => {
        setLoading()

        const res = await axios.get(
            `https://api.github.com/search/users?q=${text}`)

        dispatch({
            type: SEARCH_USERS,
            payload: res.data.items
        })

        // alertContext.removeAlert()
    }

    // Get single Github user
    const getUser = async (username) => {
        setLoading()

        const res = await axios.get(
            `https://api.github.com/users/${username}`)

        dispatch({
            type: GET_USER,
            payload: res.data
        })
    }

    // Get Repos
    const getUserRepos = async (username) => {
        setLoading()

        const per_page = '5';
        const sort_by = 'created:asc';

        const res = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=${per_page}&sort=${sort_by}`)

        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    }

    // Clear users from state
    const clearUsers = () => dispatch({ type: CLEAR_USERS})

    // Set Loading
    const setLoading = () =>{
        dispatch({ type: SET_LOADING})
    }

    return <GithubContext.Provider
        value = {{
            users: state.users,
            user: state.user,
            repos: state.repos,
            loading: state.loading,
            searchUsers,
            clearUsers,
            getUser,
            getUserRepos
        }}>{props.children}</GithubContext.Provider>
}

export default GithubState;