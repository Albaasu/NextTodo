import { signOut } from 'firebase/auth';
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
import { addDoc, collection } from 'firebase/firestore';

import { LinkIcon } from '@chakra-ui/icons';

const Todo = () => {
  const user = auth.currentUser;

  const router = useRouter();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && router.push('/Login');
    });
    return () => unSub();
  }, [router]);

  //ログアウト処理
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/Login');
  };

  //インプットの値を取得
  const [todoTitle, setTodotitle] = useState('');
  const [todoDetail, setTodoDetail] = useState('');

  //todoを追加
  const addTodo = async () => {
    const todoRef = collection(db, 'users', user!.uid, 'todos');

    if (todoTitle === '' || todoDetail === '') {
      alert('空欄の項目があります');
      return;
    }

    await addDoc(todoRef, {
      title: todoTitle,
      detail: todoDetail,
      isDone: false,
    });
    setTodoDetail('');
    setTodotitle('');
  };

  return (
    <>
      <Box bg={'gray.50'} h={'100vh'}>
        <h1 className='text-2xl text-center py-5 '>Todo追加</h1>
        <Flex justify={'center'}>
          <Input
            placeholder='タスクを入力してください'
            w={400}
            value={todoTitle}
            onChange={(e) => setTodotitle(e.target.value)}
          />
        </Flex>
        <Flex justify={'center'}>
          <Textarea
            w={400}
            mt={5}
            placeholder='詳細'
            value={todoDetail}
            onChange={(e) => setTodoDetail(e.target.value)}
          ></Textarea>
        </Flex>
        <Flex justify={'center'}>
          <Button ml={3} mt={3} onClick={addTodo}>
            追加
          </Button>
        </Flex>
        <Button onClick={handleLogout}>ログアウト</Button>
        <Link color={'blue.400'} href='/TodoList'>
          TodoList
        </Link>
      </Box>
    </>
  );
};

export default Todo;
