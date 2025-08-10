import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from './utils/uuid';

export default function TodoPlanner(){
  const [tasks, setTasks] = useState(()=> {
    try { return JSON.parse(localStorage.getItem('tasks')||'[]') } catch(e){return []}
  });
  const [title,setTitle] = useState('');
  const [duration,setDuration] = useState(30); // minutes
  const [dayIndex,setDayIndex] = useState( (new Date()).getDay() );

  useEffect(()=> localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);

  useEffect(()=>{
    const t = setInterval(()=>{
      setTasks(prev=> prev.map(task=>{
        if(task.running && task.remaining>0){
          return {...task, remaining: Math.max(0, task.remaining-1)}
        }
        return task
      }))
    },1000);
    return ()=>clearInterval(t)
  },[])

  function addTask(e){
    e && e.preventDefault();
    if(!title.trim()) return;
    const id = uuidv4();
    const newTask = {
      id, title: title.trim(), duration: Number(duration)||0, remaining: (Number(duration)||0)*60,
      running:false, day: Number(dayIndex)
    };
    setTasks(prev=> [newTask, ...prev]);
    setTitle('');
  }

  function toggleStart(id){
    setTasks(prev=> prev.map(t=> t.id===id? {...t, running: !t.running} : t))
  }
  function resetTimer(id){
    setTasks(prev=> prev.map(t=> t.id===id? {...t, remaining: t.duration*60, running:false} : t))
  }
  function deleteTask(id){ setTasks(prev=> prev.filter(t=> t.id!==id)) }

  function assignToDay(id, d){
    setTasks(prev=> prev.map(t=> t.id===id? {...t, day:d}:t))
    // also save in tasksByDay for weekly view
    const tasksByDay = JSON.parse(localStorage.getItem('tasksByDay')||'{}')
    tasksByDay[d] = tasksByDay[d]||[]
    const task = tasks.find(x=>x.id===id)
    if(task){
      // avoid duplicates
      tasksByDay[d] = tasksByDay[d].filter(x=>x.id!==id)
      tasksByDay[d].push({id:task.id,title:task.title,duration:task.duration})
      localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay))
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Create Task</h3>
        <form onSubmit={addTask} style={{display:'flex',flexDirection:'column',gap:8}}>
          <input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
          <div style={{display:'flex',gap:8}}>
            <input type="number" min="0" value={duration} onChange={e=>setDuration(e.target.value)} />
            <select value={dayIndex} onChange={e=>setDayIndex(e.target.value)}>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      <div style={{marginTop:12}} className="card">
        <h3>Tasks</h3>
        {tasks.length===0 && <div className="small">No tasks yet</div>}
        {tasks.map(t=>(
          <div key={t.id} className="task">
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{t.title}</div>
              <div className="small">Day: {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.day]}</div>
              <div style={{marginTop:6}}>
                <div className="progress"><i style={{width: `${Math.round(100*(1 - (t.remaining/(t.duration*60 || 1))))}%`}}></i></div>
                <div className="small">{formatTime(t.remaining)} remaining — {t.duration} min</div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6,marginLeft:12}}>
              <button onClick={()=>toggleStart(t.id)}>{t.running? 'Pause':'Start'}</button>
              <button onClick={()=>resetTimer(t.id)}>Reset</button>
              <select value={t.day} onChange={e=>assignToDay(t.id, Number(e.target.value))}>
                <option value="0">Sun</option><option value="1">Mon</option><option value="2">Tue</option><option value="3">Wed</option><option value="4">Thu</option><option value="5">Fri</option><option value="6">Sat</option>
              </select>
              <button onClick={()=>deleteTask(t.id)} style={{color:'red'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(sec){
  if(sec<=0) return '0:00'
  const m = Math.floor(sec/60); const s = sec%60
  return `${m}:${s.toString().padStart(2,'0')}`
}
