import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Container/Home';
import Login from './Container/Login';
import { userAccessToken, fetchUser } from './utils/fetchUser'

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = userAccessToken();
    if(!accessToken) {
      navigate('/login', { replace: true })
    } else {
        const [userInfo] = fetchUser();
        setUser(userInfo);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
 
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/*' element={<Home user={user} />} />
    </Routes>
  );
}

export default App;
