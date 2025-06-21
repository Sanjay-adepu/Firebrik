// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Dashboard from "./PPT/PPT.jsx";
import Tv from "./Tv/AndroidTVController.jsx";
import Search from "./Search/Search.jsx";
import Policy from "./Policy/PrivacyPolicy.jsx";
import Terms from "./Terms/TermsConditions.jsx";
import Contact from "./Contact/Contact.jsx";
import Downloadppt from "./Downloadppt/Downloadppt.jsx";


const App = () => {
  return (
    <Router>
      <Routes>

  <Route path="/" element={<Home />} />
  <Route path="/Tv" element={<Tv />} />
  <Route path="/download" element={<Downloadppt/>} />
   <Route path="/contact" element={<Contact/>} />
  
    <Route path="/terms" element={<Terms/>} />
<Route path="/policy" element={<Policy/>} />


   


        <Route path="/dashboard" element={<Dashboard />} />

       <Route path="/search" element={<Search/>} />
    
     
      </Routes>
    </Router>
  );
};

export default App;