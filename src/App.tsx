import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import Home from "./pages/Home";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginWithTeamCode from "./pages/LoginWithTeamCode";
import { Toaster } from "react-hot-toast";
import Contribute from "./pages/Contribute";
import ManageProject from "./pages/manage_project";
import Page404 from "./pages/404page";

function App() {
  return (
    <>
      
      <BrowserRouter>
        {/* Navbar */}
        <Navbar />
        {/* Main section body of app */}
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element= {<Dashboard />} />
            <Route path="/contribute" element= {<Contribute />} />
            <Route path="/:team_name/:projectId" element= {<ManageProject />} />
            <Route path="/team-code-login" element={<LoginWithTeamCode />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
          <Toaster position="top-center" />
        </main>
        {/* Footer */}
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
