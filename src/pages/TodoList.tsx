import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { Button } from '@chakra-ui/react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { get } from 'http';
import { getAuth, onIdTokenChanged } from 'firebase/auth';

const TodoList = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [loginState, setLoginState] = useState(false);

  //ログアウト処理
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/Login');
  };

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && router.push('/Login');
    });
    return () => unSub();
  }, [router]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setLoginState(user);
    });
    return unsubscribe;
  }, []);
  
  return (
    <>
      <div>TodoList</div>
      <div>{user?.email}</div>
      

      <Button onClick={handleLogout}>ログアウト</Button>
    </>
  );
};

export default TodoList;
