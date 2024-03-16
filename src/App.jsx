import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// import Homepage from "./pages/Homepage";
// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";

const Homepage = lazy(()=>import('./pages/Homepage'))
const Product = lazy(()=>import('./pages/Product'))
const Pricing = lazy(()=>import('./pages/Pricing'))
const Login = lazy(()=>import('./pages/Login'))
const AppLayout = lazy(()=>import('./pages/AppLayout'))
const PageNotFound = lazy(()=>import('./pages/PageNotFound'))



import SpinnerFullPage from './components/SpinnerFullPage'
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./Context/CitiesContext";
import { AuthProvider } from "./Context/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Suspense, lazy } from "react";
// import PageNav from "./components/PageNav"
function App() {
  return (
    <>
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />} >
          {/* <PageNav /> */}
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="form" element={<Form />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
      </AuthProvider>
    </>
  );
}

export default App;
