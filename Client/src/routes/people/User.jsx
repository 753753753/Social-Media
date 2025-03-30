import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alluser from '../../components/ui/Alluser';
import { fetchAllProfiles } from '../../features/auth/userSlice';

function User() {
  const dispatch = useDispatch();
  const { profiles, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <div className="spinner"></div>
      </div>
  );
  }
  if (error) {
    return <div className="p-6 bg-black h-screen text-white">Error: {error}</div>;
  }

  return (
    <div className='md:p-6 bg-black h-screen'>
      <h1 className="text-3xl font-bold mb-4 bg-black p-4 shadow-md hidden md:block">All Users</h1>
      <Alluser users={profiles} />
    </div>
  );
}

export default User;
