import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './hocs/ProtectedRoute';
import { Home,
  About,
  Cart,
  Account,
  Categories,
  Contact,
  Settings,
  ProductsPage,
  Login,
  Register,
  Activation,
  ActivationSuccess,
  Profile,
  ErrorPage,
  LandingPage,
  ProductDetail,
  DeliveryTerms,
  TermsOfUse,
  Checkout,
  Orders,
  ShippingCosts,
  OrderSuccess
 } from './pages'
import { Search } from './pages/Search';
import { PersistLogin } from './features/auth/PersistLogin';
import { ProfileNew } from './pages/Profile/ProfileNew/ProfileNew';


export const EcommerceRoutes = () => (
  <Routes>
    <Route path='*' element={<ErrorPage/>}/>
      <Route path='/' element={<Home/>}>
        <Route element={<PersistLogin />}>
          <Route index element={<LandingPage/>}/>
          <Route path='/categories/*' element={<Categories/>}/>
          <Route path='/categories/:slug/*' element={<Categories/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}>
            <Route path='payment' element={<ShippingCosts/>}/>
          </Route>
          <Route path='/order-success' element={<OrderSuccess/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/products/' element={<ProductsPage/>}/>
          <Route path='/products/:slug' element={<ProductsPage/>}/>
          {/* <Route path='/testproducts/' element={<ProductsPage/>}/> */}
          <Route path='/products/:slug/:slug' element={<ProductDetail/>}/>
          <Route path='/search/' element={<Search/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/orders/' element={<Orders/>}/>
          </Route>
          <Route path='/delivery-terms' element={<DeliveryTerms/>}/>
          <Route path='/terms-of-use' element={<TermsOfUse/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='profile' element={<Profile/>}>
              <Route path='create' element={<ProfileNew/>}/>
            </Route>
          </Route>
      </Route>
      <Route path='login' element={<Login/>}/>
      <Route path='sign-up' element={<Register/>}/>
      <Route path='activate/:user_id' element={<Activation/>}/>
      <Route path='activation-success/:uidb64' element={<ActivationSuccess/>}/>
    </Route>
  </Routes>
)
