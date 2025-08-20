import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup } = useAuth()
  const nav = useNavigate()
  const submit = async e => {
    e.preventDefault()
    await signup(name, email, password)
    nav('/')
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:360}}>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Create account</button>
    </form>
  )
}
