import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { Button } from '@chakra-ui/react';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const TodoList = () => {
  const router = useRouter();
  const [loginState, setLoginState] = useState<any>(null);
  const [todoList, setTodoList] = useState<any>([]);
  const [user] = useAuthState(auth);
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

  //データベースからデータを取得
  const getTodo = async (user: any) => {
    //データ取得これまじで大事
    if (!user) return;
    const todoRef = collection(db, 'users', user!.uid, 'todos');
    const snapshot = await getDocs(todoRef);
    const listTodo = snapshot.docs.map((doc) => doc.data());
    setTodoList(listTodo);
  };

  useEffect(() => {
    getTodo(user!);
  }, [user]);

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
