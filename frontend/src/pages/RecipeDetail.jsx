import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext.jsx'

export default function RecipeDetail(){
  const { id } = useParams()
  const [r, setR] = useState(null)
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const { token, user } = useAuth()
  const nav = useNavigate()

  const load = ()=> api(`/api/recipes/${id}`).then(setR)
  useEffect(()=>{ load().catch(console.error) }, [id])

  const addComment = async ()=>{
    await api(`/api/recipes/${id}/comments`, { method:'POST', body:{ text }, token })
    setText(''); load()
  }
  const rate = async ()=>{
    await api(`/api/recipes/${id}/ratings`, { method:'POST', body:{ value: Number(rating) }, token })
    load()
  }
  const favorite = async ()=>{
    await api(`/api/recipes/${id}/favorite`, { method:'POST', token })
    alert('Toggled favorite'); // minimal UX
  }
  const del = async ()=>{
    if (!confirm('Delete this recipe?')) return
    await api(`/api/recipes/${id}`, { method:'DELETE', token })
    nav('/')
  }

  if (!r) return <div>Loading...</div>
  const isOwner = user && r.author === user.id

  return (
    <div>
      {r.imageUrl && <img src={`http://localhost:5000${r.imageUrl}`} alt="" style={{width:'100%', maxWidth:720, borderRadius:12}}/>}
      <h1>{r.title}</h1>
      <p>{r.description}</p>
      <div><strong>Ingredients</strong><ul>{r.ingredients?.map((i,idx)=><li key={idx}>{i}</li>)}</ul></div>
      <div><strong>Steps</strong><ol>{r.steps?.map((s,idx)=><li key={idx}>{s}</li>)}</ol></div>
      <div>Average Rating: {r.ratings?.length ? (Math.round((r.ratings.reduce((a,x)=>a+x.value,0)/r.ratings.length)*10)/10) : 0}</div>
      {user && <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        <button onClick={favorite}>❤ Favorite</button>
        <select value={rating} onChange={e=>setRating(e.target.value)}>
          {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={rate}>Rate</button>
        {isOwner && <Link to={`/edit/${r._id}`}><button>Edit</button></Link>}
        {isOwner && <button onClick={del}>Delete</button>}
      </div>}
      <h3>Comments</h3>
      <ul>
        {r.comments?.map(c => <li key={c._id}>{c.text}</li>)}
      </ul>
      {user && <div style={{marginTop:8}}>
        <input placeholder="Add a comment" value={text} onChange={e=>setText(e.target.value)} />
        <button onClick={addComment}>Post</button>
      </div>}
    </div>
  )
}
