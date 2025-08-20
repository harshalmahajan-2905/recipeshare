import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api'

export default function EditRecipe(){
  const { id } = useParams()
  const { token } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', ingredients:'', steps:'' })
  const [image, setImage] = useState(null)

  useEffect(()=>{
    api(`/api/recipes/${id}`).then(r => setForm({
      title:r.title, description:r.description,
      ingredients:(r.ingredients||[]).join('\n'),
      steps:(r.steps||[]).join('\n')
    }))
  }, [id])

  const submit = async e => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k,v])=> fd.append(k, v))
    if (image) fd.append('image', image)
    await api(`/api/recipes/${id}`, { method:'PUT', isForm:true, body:fd, token })
    nav(`/recipe/${id}`)
  }
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:640}}>
      <h2>Edit Recipe</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} />
      <textarea name="description" placeholder="Short description" value={form.description} onChange={onChange} />
      <textarea name="ingredients" placeholder="Ingredients (one per line)" value={form.ingredients} onChange={onChange} />
      <textarea name="steps" placeholder="Steps (one per line)" value={form.steps} onChange={onChange} />
      <input type="file" onChange={e=>setImage(e.target.files[0])} />
      <button>Save</button>
    </form>
  )
}
