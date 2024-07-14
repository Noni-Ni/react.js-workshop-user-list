import Search from "../search/Search";
import Pagination from "../pagination/Pagination";
import UserList from "./user-list/UserList";
import { useEffect, useState } from "react";
import UserAdd from "./user-add/UserAdd";
import UserDetails from "./user-details/UserDetails";
import UserDelete from "./user-delete/UserDelete";

const baseUrl = 'http://localhost:3030/jsonstore'

export default function UserSection(props) {

    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showUserById, setShowUserById] = useState(null);
    const [showDeleteUserById, setShowDeleteUserById] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState({
        searchText: '',
        criteria: 'Not selected'
    });

    useEffect(() => {
        (async function getUsers() {
            try {
                const response = await fetch(`${baseUrl}/users`);
                const result = await response.json();

                const data = Object.values(result);
                setUsers(data);

            } catch (error) {
                alert(error.message)
            } finally {
                setIsLoading(false);
            }

        })();
    }, [search.searchText]);

    const addUserClickHandler = () => {
        setShowAddUser(true);
    }

    const addUserCloseHandler = () => {
        setShowAddUser(false);
    }

    const showUserDetailsClickHandler = (userId) => {

        setShowUserById(userId)

    }

    const userDeleteClickHandler = (userId) => {
        console.log(userId)
        setShowDeleteUserById(userId)

    }
    const userDeleteCloseHandler = (userId) => {
        console.log(userId)
        setShowDeleteUserById(null)

    }

    const userDeleteHandler = async (userId) => {
        console.log(userId)

        const response = await fetch(`${baseUrl}/users/${userId}`, { method: 'DELETE', })

        setUsers(oldUsers => oldUsers.filter(user => user._id !== userId))

        setShowDeleteUserById(null)
    }

    const formHandler = (event) => {

        event.preventDefault();

        setUsers(oldUsers => oldUsers.filter(user => (user[search.criteria]).includes(search.searchText)))



    }

    const deleteSearch = () => {
        setSearch({
            searchText: '',
            criteria: 'Not selected'
        })

        
    }

    const onChangeHandler = (event) => {

        setSearch(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }))

    }


    const addUserSaveHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const userData = {
            ...Object.fromEntries(formData),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const responseData = await response.json();

        setUsers(oldUsers => [...oldUsers, responseData]);
        setShowAddUser(false);

    }

    return (
        <section className="card users-container">

            <Search searchValue={search.searchText} searchCriteria={search.criteria} onChangeHandler={onChangeHandler} formHandler={formHandler} deleteSearch={deleteSearch} />

            <UserList users={users} showUserDetailsClickHandler={showUserDetailsClickHandler} userDeleteClickHandler={userDeleteClickHandler} isLoading={isLoading} />

            {showAddUser && <UserAdd onClose={addUserCloseHandler} onSave={addUserSaveHandler} />}

            {showUserById && <UserDetails user={users.find(user => user._id == showUserById)} onClose={() => setShowUserById(null)} />}

            {showDeleteUserById && <UserDelete onClose={userDeleteCloseHandler} onUserDelete={() => userDeleteHandler(showDeleteUserById)} />}

            <button className="btn-add btn" onClick={addUserClickHandler}>Add new user</button>

            <Pagination />
        </section>
    )
}