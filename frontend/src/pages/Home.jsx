import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import RecipeCard from '../components/RecipeCard.jsx'

export default function Home(){
  const [recipes, setRecipes] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => { api('/api/recipes').then(setRecipes).catch(console.error) }, [])

  const filtered = recipes.filter(r => r.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <input placeholder="Search recipes..." value={q} onChange={e=>setQ(e.target.value)} style={{padding:8, width:'100%', maxWidth:400}}/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16, marginTop:16}}>
        {filtered.map(r => <Link key={r._id} to={`/recipe/${r._id}`}><RecipeCard recipe={r}/></Link>)}
      </div>
    </div>
  )
}
