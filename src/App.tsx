import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./components/Note";
import FoldersPage from "./components/FoldersPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FoldersPage />} />
        <Route path="/note" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
