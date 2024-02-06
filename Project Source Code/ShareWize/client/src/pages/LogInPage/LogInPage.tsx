import { GoogleOAuthProvider } from '@react-oauth/google'
//import React from 'react'
import Google from '../../components/GoogleAuth/Google'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { RootState } from '../../App/store/store';

export default function LogInPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="container-fluid" style={{ color: 'white', textAlign: 'center' }}>
      <div className="row intro">
        <div className="col">
          <h1 style={{ color: 'white' }}>Login</h1>
          <div style={{ display: 'inline-block' }}>
            <GoogleOAuthProvider clientId="507009074308-bal2u8rup2p4154mp623sg8v197sn23n.apps.googleusercontent.com">
              <Google />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
      {user?.sub}
    </div>
  )
}
