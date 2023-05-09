import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { Button } from '@chakra-ui/react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { log } from 'console';

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

  const [loginUser, setLoginUser] = useState<any>(null);

  //firebaseからログイン状態を取得
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      setLoginState(loginUser);
    });
    return unsubscribe;
  }, []);

  const [todoList, setTodoList] = useState<any>([]);
  //データベースからデータを取得
  const getTodo = async () => {
    const todoRef = collection(db, 'users', user!.uid, 'todos');
    const snapshot = await getDocs(todoRef);
    const listTodo = snapshot.docs.map((doc) => doc.data());
    setTodoList(listTodo);
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <>
      <div>TodoList</div>
      <div>{user?.email}</div>
      <div>
        {todoList.map((todo: any) => (
          <div key={todo.id}>
            <div>{todo.title}</div>
            <div>{todo.detail}</div>
          </div>
        ))}
      </div>

      <Button onClick={handleLogout}>ログアウト</Button>
    </>
  );
};

export default TodoList;
