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
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      
      <BrowserRouter>
        {/* Navbar */}
        <div className="flex items-start justify-start h-screen">
          <Sidebar />
          {/* Main section body of app */}
          <main className="min-h-screen bg-gray-50 h-screen overflow-auto flex-1 flex flex-col px-2">
            <Navbar />
            <div className="">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element= {<Dashboard />} />
                <Route path="/contribute" element= {<Contribute />} />
                <Route path="/:team_name/:projectId" element= {<ManageProject />} />
                <Route path="/team-code-login" element={<LoginWithTeamCode />} />
                <Route path="*" element={<Page404 />} />
              </Routes>              
            </div>
          </main>
          <Toaster position="top-center" />
        </div>
        {/* Footer */}
        {/* <Footer /> */}
      </BrowserRouter>
    </>
  )
}

export default App
