import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Providers } from "./providers";
import Header from "@/lib/components/Header";
import Home from "@/pages/Home";

function App() {
  return (
    <>
      <Router>
        <Providers>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Providers>
      </Router>
    </>
  );
}

export default App;
