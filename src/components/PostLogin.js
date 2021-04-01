import {Link} from 'react-router-dom'
import axios from 'axios'
import { useAuth0 } from "@auth0/auth0-react";

import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'

import {useEffect} from 'react'

import { readFromCache, deleteCache } from '../cache.js'



const PostLogin = ({user, isLoading, isAuthenticated, backend_url, updateBox}) => {
    
    useEffect(() => {

        const createUser = async () => {
            await axios.post(`${backend_url}`, {userId: user.sub})
            .catch(error => {console.log(error.message)})
            
          }

        if(isAuthenticated){
            if(user["https://berry-team-builder.azurewebsites.net/isNew"]){ //if it is a new user
                createUser()
            }
        } 
    }, [user])

    const { logout } = useAuth0();

    const import_data = async () => {
        var data = {}
        data.guestTeam = readFromCache("guest_team") || []
        data.guestBox = readFromCache("guest_box") || []
        console.log(data)
        const userId = user.sub.replace('|', '_')
        await axios.put(`${backend_url}/${userId}/import`, data)
        .then(res => {
            updateBox(res.data)
        })
        .catch(error => {console.log(error.message)})

        delete_data_from_local_storage()
    }

    const delete_data_from_local_storage = () => {
        deleteCache("guest_box")
        deleteCache("guest_team")
    }

    
    if (isLoading) {
        return <div>Loading ...</div>;
    }
    else{
        return (
            isAuthenticated && (
            <Container>
                <h2>Welcome {user.name}!</h2>
                <p>Would you like to import your data from your Guest session into your account?</p>
                <p>Note: Logging in will clear your guest session and it's data regardless.</p>


                <Link onClick={() => import_data()} to='/'> Yes, import data.</Link>
                <Link onClick={() => delete_data_from_local_storage()} to='/'> No, leave data behind.</Link>
                <Link onClick={() => logout()} to='/'> Stay Logged Out.</Link>

            </Container>
            )
        )
    }
}

export default PostLogin