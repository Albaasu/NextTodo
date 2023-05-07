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
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [user, setUser] = useState('');

  const router = useRouter();

  const handleLoginClick = async (e: any) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      onAuthStateChanged(auth, (currentUser:any) => {
        setUser(currentUser);
      });
      router.push('/Todo');
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
          <Heading fontSize={'4xl'}>ログイン</Heading>
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
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>パスワード</FormLabel>
              <Input
                type='password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Link color={'blue.400'} href='/Register'>
                  新規登録はこちら
                </Link>
              </Stack>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleLoginClick}
              >
                ログイン
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
