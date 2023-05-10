import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function AddTodoModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDetail, setTodoDetail] = useState('');
  const user = auth.currentUser;

  //Todoを追加
  const addTodo = async () => {
    const todoRef = collection(db, 'users', user!.uid, 'todos');

    if (todoTitle === '' || todoDetail === '') {
      alert('空欄の項目があります');
      return;
    }

    const docRef = await addDoc(todoRef, {
      title: todoTitle,
      detail: todoDetail,
      isDone: false,
    });
    await updateDoc(doc(docRef.parent, docRef.id), { id: docRef.id });
    setTodoDetail('');
    setTodoTitle('');
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Todoを追加</Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Todoを作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Todoタイトル</FormLabel>
              <Input
                ref={initialRef}
                placeholder='Todoタイトルを入力'
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>詳細</FormLabel>
              <Textarea
                placeholder='詳細を入力'
                value={todoDetail}
                onChange={(e) => setTodoDetail(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={addTodo}>
              追加
            </Button>
            <Button onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTodoModal;
