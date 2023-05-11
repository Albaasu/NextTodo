/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Input,
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Edit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user] = useAuthState(auth);
  const [todoList, setTodoList] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const [selectedTodoId, setSelectedTodoId] = useState<any>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDetail, setTodoDetail] = useState('');

  const fetchTodo = async () => {
    if (!user) return;

    const todoRef = collection(db, 'users', user.uid, 'todos');
    const snapshot = await getDocs(todoRef);
    const matchingTodos = snapshot.docs
      .map((doc) => doc.data())
      .filter((todo) => todo.id === id);
    const selectedTodo = matchingTodos[0];
    if (selectedTodo) {
      setTodoTitle(selectedTodo.title);
      setTodoDetail(selectedTodo.detail);
    }
    setTodoList(matchingTodos);
  };

  useEffect(() => {
    fetchTodo();
  }, [user, id]);

  //Todo更新
  const updateTodo = async () => {
    if (!user) return;

    const todoRef = doc(db, 'users', user.uid, 'todos', selectedTodoId);
    await updateDoc(todoRef, {
      title: todoTitle,
      detail: todoDetail,
    });
    fetchTodo();
    onClose();
  };

  const handleEditButtonClick = (todoId: any) => {
    setSelectedTodoId(todoId);

    const selectedTodo = todoList.find((todo: any) => todo.id === todoId);
    if (selectedTodo) {
      setTodoTitle(selectedTodo.title);
      setTodoDetail(selectedTodo.detail);
      onOpen();
    }
  };

  //完了でリストへ戻る
  const handleComplete = () => {
    router.push('/TodoList');
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
                <Button
                  w={100}
                  variant='solid'
                  colorScheme='orange'
                  onClick={() => handleEditButtonClick(todo.id)}
                >
                  編集
                </Button>
                <Button
                  variant='solid'
                  colorScheme='blue'
                  w={100}
                  onClick={handleComplete}
                >
                  編集完了
                </Button>
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))}
      </Flex>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Todoの編集</ModalHeader>
          <ModalCloseButton />
          <Stack my='2' spacing='3' p={2}>
            <Input
              ref={initialRef}
              placeholder='Todoタイトルを入力'
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
            ></Input>
            <Textarea
              placeholder='詳細を入力'
              value={todoDetail}
              onChange={(e) => setTodoDetail(e.target.value)}
            ></Textarea>
          </Stack>
          <ModalBody pb={6}>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={updateTodo}>
                更新
              </Button>
              <Button onClick={onClose}>キャンセル</Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Link href='/Todo'>Todoを追加</Link>
    </>
  );
};

export default Edit;
