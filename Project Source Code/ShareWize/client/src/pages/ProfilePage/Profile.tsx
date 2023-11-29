import React, { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../../App/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../App/store/actions/authActions';
import axios from 'axios';

interface UserProfileProps {
    googleId: string;
  }


interface userObject {
    UserId: number, 
    GoogleId: string, 
    DisplayName: string, 
    Email: string,
}

//const dispatch = useDispatch();
  
// function UserProfile({ googleId } : UserProfileProps) {
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const fetchUser = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8000/getUser/${googleId}`);
//             const user = response.data;

//             // Dispatch action to update Redux store with user information
//             console.log(user);
//             // dispatch(loginSuccess(user)); // Use your action creator here
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//         };

//         fetchUser();
//     }, [dispatch, googleId]);
// }


export default function Profile() {
    const googleId = useSelector((state: RootState) => state.auth.user?.sub);
    const image = useSelector((state: RootState) => state.auth.user?.picture)
    const [currentUser, setCurrentUser] = useState<userObject>();
    const dispatch = useDispatch();
    

    useEffect(() => {
        if (googleId) {
          // Move the logic directly into this useEffect
          const fetchUser = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/getUser/${googleId}`);
              setCurrentUser(response.data);
              console.log(currentUser);
              // Dispatch action to update Redux store with user information
              //dispatch(loginSuccess(user)); // Use your action creator here
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
    
          fetchUser();
        } else {
          console.log("Error: googleId is undefined");
        }
      }, [googleId]);

  return (
    
    
    <div className='container-fluid' style={{color:'white'}}>
        Profile
        <div style={{color: 'white'}}>
            <div>
                <a>
                    <div>
                        {image}
                    </div>
                    <img src={image}/>
                </a>
                <div>
                    {currentUser?.DisplayName}    
                </div>
                <div>
                    {currentUser?.Email}    
                </div>
                <div>
                    {currentUser?.GoogleId}  
                </div>
                <div>
                    {currentUser?.UserId}                    
                </div>
            </div>
        </div>
    </div>
  )
}
