import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Note from "./components/Note";
import Dashboard from "./components/Dashboard";
import FoldersPage from "./components/FoldersPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/note" element={<Note />} />
        <Route path="/folders" element={<FoldersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
