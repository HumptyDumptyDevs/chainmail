import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Providers } from "./providers";
import { Header } from "@/components/index";
import { Home, CreateListing } from "@/pages/index";

function App() {
  return (
    <>
      <Router>
        <Providers>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Routes>
        </Providers>
      </Router>
    </>
  );
}

export default App;
