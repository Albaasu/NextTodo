import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';

import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const ListCard = () => {
  const [user] = useAuthState(auth);
  const [loginState, setLoginState] = useState<any>(null);
  const [todoList, setTodoList] = useState<any>([]);

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
    <Flex mt="4" justify="center" align="flex-start" wrap="wrap" >
    {todoList.map((todo: any) => (
      <Card key={todo.id} maxW="sm" mr={2} minW={300}>
        <CardBody>
          <Stack mt="6" spacing="3" >
            <Heading size="md" >{todo.title}</Heading>
            <Text>{todo.description}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button variant="solid" colorScheme="red">
              編集
            </Button>
            <Button variant="solid" colorScheme="blue">
              完了
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    ))}
    </Flex>
    </>
    );
};
