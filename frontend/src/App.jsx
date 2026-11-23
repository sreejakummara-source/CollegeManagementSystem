import { useEffect, useMemo, useState } from 'react'
import { createStudent, deleteStudent, getStudents, updateStudent } from './api'

const emptyForm = { name: '', email: '', department: '', year: '1' }

export default function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadStudents() {
    try {
      setError('')
      setStudents(await getStudents())
    } catch {
      setError('Could not load students. Check that the Java backend and MySQL are running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const filtered = useMemo(() => students.filter(s =>
    [s.name, s.email, s.department].some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  ), [students, search])

  async function submit(e) {
    e.preventDefault()
    try {
      setError('')
      const payload = { ...form, year: Number(form.year) }
      if (editingId) await updateStudent(editingId, payload)
      else await createStudent(payload)
      setForm(emptyForm)
      setEditingId(null)
      await loadStudents()
    } catch {
      setError('Could not save student. Check required fields and backend connection.')
    }
  }

  function edit(student) {
    setEditingId(student.id)
    setForm({ name: student.name, email: student.email, department: student.department, year: String(student.year) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remove(id) {
    if (!window.confirm('Delete this student record?')) return
    try {
      await deleteStudent(id)
      await loadStudents()
    } catch {
      setError('Could not delete this student.')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">C</span><div><b>CampusDesk</b><small>COLLEGE PORTAL</small></div></div>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active">▦ <span>Dashboard</span></div>
        <div className="nav-item">♙ <span>Students</span></div>
        <div className="nav-item">▤ <span>Faculty</span></div>
        <div className="nav-item">◷ <span>Attendance</span></div>
        <div className="nav-item">＄ <span>Fees</span></div>
        <div className="nav-item">▣ <span>Courses</span></div>
        <div className="sidebar-bottom">College Management System<br/><small>Academic administration</small></div>
      </aside>

      <main className="main">
        <header className="topbar"><div><span className="crumb">Workspace /</span> <b>Dashboard</b></div><div className="profile"><span className="avatar">A</span><span><b>Administrator</b><small>System Admin</small></span></div></header>
        <section className="welcome"><div><p className="eyebrow">OVERVIEW</p><h1>College Dashboard</h1><p className="muted">Manage your college operations in one place.</p></div><div className="date-chip">● &nbsp; Academic Portal</div></section>

        <section className="stats">
          <div className="stat-card"><div className="stat-top"><span>Total Students</span><span className="stat-icon blue">♙</span></div><strong>{students.length}</strong><small>Registered student records</small></div>
          <div className="stat-card"><div className="stat-top"><span>Departments</span><span className="stat-icon purple">▦</span></div><strong>{new Set(students.map(s => s.department).filter(Boolean)).size}</strong><small>Departments represented</small></div>
          <div className="stat-card"><div className="stat-top"><span>Academic Years</span><span className="stat-icon orange">▣</span></div><strong>{new Set(students.map(s => s.year).filter(Boolean)).size}</strong><small>Years represented</small></div>
        </section>

        {error && <div className="error">{error}</div>}
        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading"><div><h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2><p className="muted">Enter student information below.</p></div><span className="panel-symbol">＋</span></div>
            <form onSubmit={submit}>
              <label>Student Name<input required value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Asha Kumar"/></label>
              <label>Email Address<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="student@college.edu"/></label>
              <label>Department<input required value={form.department} onChange={e => setForm({...form, department:e.target.value})} placeholder="e.g. Computer Science"/></label>
              <label>Academic Year<select value={form.year} onChange={e => setForm({...form, year:e.target.value})}><option value="1">First Year</option><option value="2">Second Year</option><option value="3">Third Year</option><option value="4">Fourth Year</option></select></label>
              <div className="form-actions"><button className="primary" type="submit">{editingId ? 'Save Changes' : '＋ Add Student'}</button>{editingId && <button className="secondary" type="button" onClick={() => {setEditingId(null);setForm(emptyForm)}}>Cancel</button>}</div>
            </form>
          </div>

          <div className="panel list-panel">
            <div className="panel-heading list-heading"><div><h2>Student Directory</h2><p className="muted">View and manage student records.</p></div><span className="count">{students.length} records</span></div>
            <input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Search name, email or department..."/>
            {loading ? <p className="empty">Loading students...</p> : filtered.length === 0 ? <p className="empty">No students found. Add a student using the form.</p> :
              <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>DEPARTMENT</th><th>YEAR</th><th>ACTIONS</th></tr></thead><tbody>
                {filtered.map(s => <tr key={s.id}><td><div className="student-cell"><span className="student-avatar">{s.name?.[0]?.toUpperCase()}</span><span><b>{s.name}</b><small>{s.email}</small></span></div></td><td>{s.department}</td><td><span className="year-pill">Year {s.year}</span></td><td><button className="text-btn" onClick={() => edit(s)}>Edit</button><button className="text-btn danger" onClick={() => remove(s.id)}>Delete</button></td></tr>)}
              </tbody></table></div>
            }
          </div>
        </section>
        <footer>CampusDesk · College Management System <span>React + Spring Boot + MySQL</span></footer>
      </main>
    </div>
  )
}
