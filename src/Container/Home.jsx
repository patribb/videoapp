import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import {
  Navbar,
  Category,
  Feed,
  Create,
  Search,
  VideoPinDetail,
  Profile
} from "../Components";
import { categories } from "../data";

const Home = ({ user }) => {
  return (
    <>
    <Navbar user={user} />
    <Flex width={"full"}>
      <Flex
        direction={"column"}
        justifyContent="start"
        alignItems={"center"}
        width={20}
      >
        {categories &&
          categories?.map((data) => <Category key={data.id} data={data} />)}
      </Flex>
      <Flex width={"full"} justifyContent="center" alignItems="center" px={4}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/create" element={<Create />} />
          <Route path="/videoDetail/:videoId" element={<VideoPinDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </Flex>
    </Flex>
  </>
  );
};

export default Home;
