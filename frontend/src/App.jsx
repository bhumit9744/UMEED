import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FamilyFolder from "./pages/family_folder";
import NcdFollowups from "./pages/NcdFollowups";
import AddFamily from "./pages/AddFamily";


function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/families" element={<FamilyFolder />} />
  <Route path="/ncd-followups" element={<NcdFollowups />} />
  <Route path="/add-family" element={<AddFamily />} />
</Routes>
    </Router>
  );
}

export default App;