import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import Home from "./pages/Home";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      
      <BrowserRouter>
        {/* Navbar */}
        <Navbar />
        {/* Main section body of app */}
        <main className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element= {<Dashboard />} />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
