import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./components/Note";
import FoldersPage from "./components/FoldersPage";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import SignUp from "./pages/SignUp";
import PasswordReset from "./pages/PasswordReset";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<SignIn />}></Route>
        <Route path="/folders" element={<FoldersPage />} />
        <Route path="/note" element={<Note />} />
        <Route path="/signout" element={<SignOut />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/passwordreset" element={<PasswordReset />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
