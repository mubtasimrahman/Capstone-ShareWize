import { GoogleOAuthProvider } from '@react-oauth/google'
//import React from 'react'
import Google from '../../components/GoogleAuth/Google'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { RootState } from '../../App/store/store';

export default function LogInPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="container-fluid" style={{color: 'white'}}>
        <div className="row intro">
          <div className="col">
            <a style={{color:'white'}}>
                login
            </a>
            <GoogleOAuthProvider clientId="****************************************">
              <Google />
            </GoogleOAuthProvider>
          </div>
        </div>
        {user?.sub}
      </div>
  )
}
