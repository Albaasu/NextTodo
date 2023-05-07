import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function Register() {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
  }, []);

  const handleAddClick = async (e: any) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const user = auth.currentUser;
      const useRef = doc(db, 'users', user!.uid);
      await setDoc(useRef, {
        id: user!.uid,
      });
    } catch (error) {
      alert('正しく入力してください');
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>新規登録</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id='email'>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type='email'
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>パスワード</FormLabel>
              <Input
                type='password'
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Link color={'blue.400'} href='/Login'>
                  ログインはこちら
                </Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleAddClick}
              >
                登録
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
