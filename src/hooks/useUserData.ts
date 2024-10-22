import {UserMetadata} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';

const useUserData = (): UserMetadata | undefined => {
  const [user, setUser] = useState<UserMetadata | undefined>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      let metadata = user?.user_metadata;
      setUser(metadata);
    };
    fetchUserData();
  }, []);

  return user;
};

export default useUserData;
