import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'
import RecipeCard from '../components/RecipeCard.jsx'

export default function MyFavorites(){
  const { token } = useAuth()
  const [list, setList] = useState([])
  useEffect(()=>{ api('/api/recipes/favorites', { token }).then(setList) }, [])
  return (
    <div>
      <h2>My Favorites</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginTop:16}}>
        {list.map(r => <Link key={r._id} to={`/recipe/${r._id}`}><RecipeCard recipe={r}/></Link>)}
      </div>
    </div>
  )
}
