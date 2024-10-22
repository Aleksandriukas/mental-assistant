import {UserMetadata} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';

export const fetchUserData = async () => {
  const {
    data: {user},
  } = await supabase.auth.getUser();
  let metadata = user?.user_metadata;
  return metadata;
};
