import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AddRecipe from './pages/AddRecipe.jsx'
import EditRecipe from './pages/EditRecipe.jsx'
import MyFavorites from './pages/MyFavorites.jsx'
import { useAuth } from './context/AuthContext.jsx'

const Nav = () => {
  const { user, logout } = useAuth()
  return (
    <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
      <Link to="/">RecipeShare</Link>
      <Link to="/">Home</Link>
      {user && <Link to="/add">Add Recipe</Link>}
      {user && <Link to="/favorites">My Favorites</Link>}
      <span style={{marginLeft:'auto'}}>
        {user ? (<>
          <span style={{marginRight:8}}>Hi, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>) : (<>
          <Link to="/login">Login</Link>
          <Link style={{marginLeft:8}} to="/signup">Signup</Link>
        </>)}
      </span>
    </nav>
  )
}

const Private = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div>
      <Nav/>
      <div style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/recipe/:id" element={<RecipeDetail/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/add" element={<Private><AddRecipe/></Private>} />
          <Route path="/edit/:id" element={<Private><EditRecipe/></Private>} />
          <Route path="/favorites" element={<Private><MyFavorites/></Private>} />
        </Routes>
      </div>
    </div>
  )
}
