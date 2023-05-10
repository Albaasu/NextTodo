import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';

import { useRouter } from 'next/router';
import { auth, db } from '../../firebase';

export const ListCard = () => {
  const [user] = useAuthState(auth);
  const [loginState, setLoginState] = useState<any>(null);
  const [todoList, setTodoList] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const router = useRouter();
  const [selectedTodoId, setSelectedTodoId] = useState<any>(null);

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

 // Todoの削除
 const deleteTodo = async (id:any) => {
  const todoRef = doc(db, 'users', user!.uid, 'todos', id);
  await deleteDoc(todoRef);
  onClose();
  getTodo(user);
};

const handleDeleteClick = (id:any) => {
  setSelectedTodoId(id);
  onOpen();
};


  return (
    <>
      <Flex justify='center'>
        <Text fontSize={25}>TodoList一覧</Text>
      </Flex>
      <Flex
        mt='4'
        justify='center'
        align='flex-start'
        flexWrap='wrap'
        maxW='1200px'
        mx='auto'
      >
        {todoList.map((todo: any) => (
          <Card
            key={todo.id}
            flexBasis={{
              base: '100%',
              sm: 'calc(60% - 10px)',
              md: 'calc(20% - 10px)',
            }}
            maxW='sm'
            minW={250}
            minH={250}
            mx={5}
            mb={4}
          >
            <CardBody>
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{todo.title}</Heading>
                <Text>{todo.detail}</Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing='2'>
                <Button variant='solid' colorScheme='pink'>
                  編集
                </Button>
                <Button variant='solid' colorScheme='blue'>
                  完了
                </Button>
                <Button variant='solid' colorScheme='red' onClick={()=>handleDeleteClick(todo.id)}>
                  削除
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>本当に削除しますか？</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={()=>deleteTodo(selectedTodoId)}>
                はい
              </Button>
              <Button onClick={onClose}>いいえ</Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Link href='/Todo'>Todoを追加</Link>
    </>
  );
};
