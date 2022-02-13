import './App.css';
import { useState, useRef, useEffect } from "react";
import { Routes, Route, NavLink, Outlet, useParams, useNavigate, Link, useRoutes, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

/*======================================================================================================================*/

const data = [
  { id: 1, name: "Mouse" },
  { id: 2, name: "Monitor" },
  { id: 3, name: "Keyboard" },
  { id: 4, name: "Mobile" },
  { id: 5, name: "Tablet" },
  { id: 6, name: "Speaker" },
  { id: 7, name: "Handsfree" },
  { id: 8, name: "Adaptor" },
  { id: 9, name: "Battery" },
  { id: 10, name: "Case" },
]

/*======================================================================================================================*/


function App() {

  const location = useLocation();

  const Custom = CustomRoutes();
  let decoded;

  if (JSON.parse(localStorage.getItem("data"))?.accessToken) {
    decoded = jwt_decode(JSON.parse(localStorage.getItem("data")).accessToken);
  }

  return (
    <div className="App">

      <div style={{ width: "30%", display: "flex", justifyContent: "space-evenly", alignItems: "center", marginBottom: "20px" }}>
        <NavLink style={({ isActive }) => isActive ? { color: "blue", fontWeight: "600" } : { color: "black" }} to="/">Home</NavLink>
        {JSON.parse(localStorage.getItem("data"))?.accessToken && <NavLink style={({ isActive }) => isActive ? { color: "blue", fontWeight: "600" } : { color: "black" }} to="/product">Product</NavLink>}
        <NavLink style={({ isActive }) => isActive ? { color: "blue", fontWeight: "600" } : { color: "black" }} to="/contactus">Contact Us</NavLink>
        {JSON.parse(localStorage.getItem("data"))?.accessToken ? <></> : <NavLink style={({ isActive }) => isActive ? { color: "blue", fontWeight: "600" } : { color: "black" }} to="/login">Login</NavLink>}
        {localStorage.getItem("data") && location.pathname !== "/login" && <h3>{decoded?.name}</h3>}
      </div>

      <CustomRoutes />

    </div >
  );
}

export default App;


/*======================================================================================================================*/



const Home = () => {

  return (

    <h1>Home Page</h1>

  )

}


/*======================================================================================================================*/


const Product = () => {

  return (

    <div style={{ width: "30%" }}>
      <h1>Product Page</h1>
      <Outlet />
    </div>

  )

}

/*======================================================================================================================*/


const ProductList = () => {

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {

    if (localStorage.getItem("data")) {
      const localstorage = JSON.parse(localStorage.getItem("data"));

      const config = {
        headers: {
          'authorization': `bearer ${localstorage.accessToken}`
        }
      }

      console.log(localstorage.accessToken)

      await axios.get("http://localhost:5000/products", config).then(data => {
        setProducts(data.data);
      }).catch(err => {
        navigate("/login");
        localStorage.clear();
      });

    }
    else {
      navigate("/login");
      localStorage.clear();
    }
  }, []);


  return (

    <ul style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      {
        products.map(item => (
          <li onClick={() => navigate(`/product/${item.id}`)} key={item.id}>{item.name}</li>
        ))
      }
    </ul>

  )

}


/*======================================================================================================================*/


const ProductDetail = () => {

  const { id } = useParams();

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(async () => {

    if (localStorage.getItem("data")) {
      const localstorage = JSON.parse(localStorage.getItem("data"));

      const config = {
        headers: {
          'authorization': `bearer ${localstorage.accessToken}`
        }
      }

      await axios.get("http://localhost:5000/products", config).then(data => {
        setProducts(data.data);
      }).catch((err) => {
        navigate("/login");
        localStorage.clear();
      });

    }
    else {
      navigate("/login");
      localStorage.clear();
    }
  }, []);

  const item = products.find(item => +id === item.id);

  return (

    <>
      <h3>Product Detail</h3>
      <p>{item?.name}</p>
      <button onClick={() => navigate("/product")}>go back</button>
    </>

  )

}

/*======================================================================================================================*/


const ContactUs = () => {

  return (

    <h1>Contact Us</h1>

  )

}


/*======================================================================================================================*/


const Login = () => {

  const navigate = useNavigate();

  const nameRef = useRef();
  const userNameRef = useRef();

  const login = async () => {

    const data = {
      "username": userNameRef.current.value,
      "name": nameRef.current.value,
    }

    const res = await axios.post("http://localhost:4000/login", data);
    localStorage.setItem("data", JSON.stringify(res.data));
    navigate("/");
  }

  return (

    <div>
      <h1>Login</h1>

      <div>
        <input ref={nameRef} type="text" placeholder='Enter Your Name !' />
        <br />
        <br />
        <input ref={userNameRef} type="text" placeholder='Enter Your UserName !' />
        <br />
        <br />
        <button onClick={login}>Submit</button>
      </div>
    </div>

  )

}


/*======================================================================================================================*/


const CustomRoutes = () => {

  const [products, setProducts] = useState(data);


  const Custom = useRoutes([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/contactus",
      element: <ContactUs />
    },
    {
      path: "/product",
      element: <Product />,
      children: [
        {
          index: true,
          element: <ProductList products={products} />
        },
        {
          path: ":id",
          element: <ProductDetail products={products} />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "*",
      element: <Navigate to="/" />
    }
  ])

  return Custom;

}