import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Providers } from "./providers";
import { Header } from "@/components/index";
import {
  Home,
  CreateListing,
  MyListings,
  Listing,
  FulfilListing,
  MyOrders,
  ViewOrder,
  Disputes,
  ViewDispute,
} from "@/pages/index";

function App() {
  return (
    <>
      <Router>
        <Providers>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/my-listings/fulfil/:id" element={<FulfilListing />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:id" element={<ViewOrder />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/disputes/:id" element={<ViewDispute />} />
          </Routes>
        </Providers>
      </Router>
    </>
  );
}

export default App;
