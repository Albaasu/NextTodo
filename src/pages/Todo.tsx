import {
  getAuth,
  onAuthStateChanged,
  onIdTokenChanged,
  signOut,
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import {
  Box,
  Button,
  Flex,
  Input,
  LinkBox,
  List,
  Textarea,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import { LinkIcon } from '@chakra-ui/icons';
import AddTodoModal from '@/components/AddModal';

const Todo = () => {
  const user = auth.currentUser;
  const [loginState, setLoginState] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      !user && router.push('/Login');
    });
    return () => unSub();
  }, [router]);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user: any) => {
      setLoginState(user);
    });
    return unsubscribe;
  }, []);

  //ログアウト処理
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/Login');
  };

  //インプットの値を取得
  const [todoTitle, setTodotitle] = useState('');
  const [todoDetail, setTodoDetail] = useState('');

  return (
    <>
      <Box bg={'gray.50'} h={'100vh'}>
        <h1 className='text-2xl text-center py-5 '>Todo追加</h1>
        <Flex justify={'center'}>
          <AddTodoModal />
          <Button onClick={handleLogout} mx={4}>
            ログアウト
          </Button>
          <Link color={'blue.400'} href='/TodoList'>
            TodoList
          </Link>
        </Flex>
      </Box>
    </>
  );
};

export default Todo;
