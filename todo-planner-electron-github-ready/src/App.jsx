import React, { useEffect, useState } from 'react'
import TodoPlanner from './TodoPlanner'
import { THEMES } from './themes'

export default function App(){
  const [themeId, setThemeId] = useState(localStorage.getItem('theme') || 'india')
  const theme = THEMES[themeId] || THEMES.india

  useEffect(()=>{
    document.documentElement.style.setProperty('--accent', theme.accent || '#6366f1')
    localStorage.setItem('theme', themeId)
    // set background
    document.body.style.backgroundImage = `url(${theme.bg})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
  },[theme, themeId])

  return (
    <div className="app-shell">
      <div className="header">
        <h1>Todo Planner — Desktop</h1>
        <div className="controls">
          <select value={themeId} onChange={(e)=>setThemeId(e.target.value)}>
            {Object.values(THEMES).map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid">
        <TodoPlanner />
        <div className="card">
          <h3>Weekly Planner</h3>
          <WeeklyView />
        </div>
      </div>
    </div>
  )
}

function WeeklyView(){
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  // load tasks from localStorage
  const [tasksByDay, setTasksByDay] = useState(()=>{
    try{
      return JSON.parse(localStorage.getItem('tasksByDay')||'{}')
    }catch(e){return {}}
  })
  useEffect(()=> localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay)), [tasksByDay])

  return (
    <div className="week">
      {weekDays.map((d,i)=>(
        <div className="day" key={d}>
          <h4>{d}</h4>
          {(tasksByDay[i]||[]).map(t=>(
            <div key={t.id} style={{border:'1px solid #eee',padding:6,borderRadius:6,marginBottom:6}}>
              <div style={{fontWeight:600}}>{t.title}</div>
              <div className="small">{t.duration || '—'}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
