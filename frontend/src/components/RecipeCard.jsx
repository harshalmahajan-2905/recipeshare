import React from 'react'

export default function RecipeCard({ recipe }){
  return (
    <div style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
      {recipe.imageUrl && <img src={`http://localhost:5000${recipe.imageUrl}`} alt="" style={{width:'100%', height:140, objectFit:'cover', borderRadius:8}}/>}
      <h3 style={{marginTop:8}}>{recipe.title}</h3>
      <p style={{fontSize:14, color:'#555'}}>{recipe.description?.slice(0,100)}...</p>
      <div style={{fontSize:12}}>⭐ {recipe.ratings?.length ? (Math.round((recipe.ratings.reduce((a,r)=>a+r.value,0)/recipe.ratings.length)*10)/10) : 0}</div>
    </div>
  )
}
