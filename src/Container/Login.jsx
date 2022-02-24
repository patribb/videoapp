import { Button, Flex, HStack, Image } from "@chakra-ui/react";
import MusicBg from "../images/musicbg.jpeg";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const firebaseAuth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const firebaseDb = getFirestore(firebaseApp);

  const login = async () => {
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { refreshToken, providerData } = user;
    localStorage.setItem("user", JSON.stringify(providerData));
    localStorage.setItem("accessToken", JSON.stringify(refreshToken));

    await setDoc(
      doc(firebaseDb, "users", providerData[0].uid),
      providerData[0]
    );

    navigate("/", { replace: true });
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"100vw"}
      height={"100vh"}
      position={"relative"}
    >
      <Image
        src={MusicBg}
        alt="Video Music App"
        objectFit="cover"
        width={"full"}
        height={"full"}
      />
      <Flex
        position={"absolute"}
        width={"100vw"}
        height={"100vh"}
        bg={"blackAlpha.600"}
        top={0}
        left={0}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <HStack>
          <Button
            onClick={() => login()}
            colorScheme="whiteAlpha"
            shadow={"lg"}
            color='#f1f1f1'
            leftIcon={<FcGoogle fontSize={40} />}
          >
            Sign In Whit Google
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Login;
