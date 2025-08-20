import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()
  const submit = async e => {
    e.preventDefault()
    await login(email, password)
    nav('/')
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:360}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  )
}
