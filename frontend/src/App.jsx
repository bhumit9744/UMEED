import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FamilyFolder from "./pages/family_folder";
import NcdFollowups from "./pages/NcdFollowups";
import AddFamily from "./pages/AddFamily";
import Esanjeevni from "./pages/eSanjeevni";
import Learn from "./pages/learn";




function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/families" element={<FamilyFolder />} />
  <Route path="/ncd-followup" element={<NcdFollowups />} />
  <Route path="/add-family" element={<AddFamily />} />
  <Route path="/esanjeevni" element={<Esanjeevni />} />
  <Route path="/learn" element={<Learn />} />

  
</Routes>
    </Router>
  );
}

export default App;