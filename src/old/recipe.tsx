// src/components/PrescriptionPage.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface Drug {
  id: string
  name: string
  dosage: string
  quantity: number
  instructions: string
  unitPrice: number
}
export interface Session {
    id: string
    label: string    // e.g. "2025-04-21 14:30"
    drugs: Drug[]
  }
type Sessions = Record<string, Drug[]>

export const PrescriptionPage: React.FC = () => {
  const today = new Date().toISOString().slice(0,10)
  const [sessions, setSessions] = useState<Sessions>({})
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [selectedDay, setSelectedDay] = useState<string>(today)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editDrug, setEditDrug] = useState<Drug|null>(null)
  const [deleteDrug, setDeleteDrug] = useState<Drug|null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('prescriptionSessions')
    if (stored) setSessions(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('prescriptionSessions', JSON.stringify(sessions))
  }, [sessions])

  const loadSession = useCallback((day: string) => {
    setSelectedDay(day)
    setDrugs(sessions[day] || [])
  }, [sessions])

  useEffect(() => { loadSession(today) }, [sessions, today, loadSession])

  const confirmPrescription = () => {
    setSessions(prev => ({ ...prev, [selectedDay]: drugs }))
    alert('✅ Session saved for ' + selectedDay)
  }

  
// build a local “YYYY-MM-DD hh:mm AM/PM” string
const getDefaultLabel = () => {
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    let hours = now.getHours()
    const ampm  = hours < 12 ? 'AM' : 'PM'
    hours = hours % 12 || 12   // convert 0→12, 13→1…
    return [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate())
    ].join('-') + ' ' + [
      pad(hours),
      pad(now.getMinutes())
    ].join(':') + ` ${ampm}`
  }
  
  const createNewSession = () => {
    const defaultLabel = getDefaultLabel()
    const label = prompt(
      'Enter new session date & time (YYYY-MM-DD hh:mm AM/PM):',
      defaultLabel
    )
    if (!label) return   // user cancelled
  
    // match “2025-04-21 02:30 PM”
    const dtRegex = /^\d{4}-\d{2}-\d{2} (0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/i
  
    if (!dtRegex.test(label)) {
      alert('Invalid format. Please use YYYY-MM-DD hh:mm AM/PM')
      return
    }
  
    setSessions(prev => ({
      ...prev,
      [label]: prev[label] || []
    }))
    loadSession(label)
  }
  

  const handleDelete = (id: string) => {
    setDrugs(ds => ds.filter(d => d.id !== id))
    setDeleteDrug(null)
  }
  const handleUpdate = (d: Drug) => {
    setDrugs(ds => ds.map(x => x.id === d.id ? d : x))
    setEditDrug(null)
  }
  const handleCreate = (d: Omit<Drug,'id'>) => {
    setDrugs(ds => [...ds, { ...d, id: uuidv4() }])
    setShowAddModal(false)
  }

  const total = drugs.reduce((sum, d) => sum + d.quantity*d.unitPrice, 0)

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Prescription for {selectedDay}</h2>

      <div className="mb-4 flex items-center space-x-3">
        <label className="font-medium">View day:</label>
        <select
          className="p-2 border rounded"
          value={selectedDay}
          onChange={e => loadSession(e.target.value)}
        >
          {Object.keys(sessions).sort((a,b) => b.localeCompare(a)).map(day =>
            <option key={day} value={day}>{day}</option>
          )}
          <option value={today}>Today</option>
        </select>
        <button
          onClick={createNewSession}
          className="px-3 py-1 bg-green-200 hover:bg-green-300 rounded"
        >＋ New Session</button>
      </div>

      <table className="min-w-full table-auto mb-6">
        <thead className="bg-blue-50">
          <tr>
            {['Drug','Dosage','Qty','Instructions','Unit Price','Total','Actions'].map(h =>
              <th key={h} className="px-3 py-2 text-left text-sm font-medium">{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {drugs.map(d => (
            <tr key={d.id} className="border-b">
              <td className="px-3 py-2 text-sm">{d.name}</td>
              <td className="px-3 py-2 text-sm">{d.dosage}</td>
              <td className="px-3 py-2 text-sm">{d.quantity}</td>
              <td className="px-3 py-2 text-sm">{d.instructions}</td>
              <td className="px-3 py-2 text-sm">${d.unitPrice.toFixed(2)}</td>
              <td className="px-3 py-2 text-sm">${(d.quantity*d.unitPrice).toFixed(2)}</td>
              <td className="px-3 py-2 space-x-2">
                <button
                  onClick={() => setEditDrug(d)}
                  className="px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded"
                  title="Edit"
                >✎</button>
                <button
                  onClick={() => setDeleteDrug(d)}
                  className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
                  title="Delete"
                >🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded"
        >＋ Add Another Drug</button>

        <div className="text-right">
          <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
          <button
            onClick={confirmPrescription}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >Confirm Prescription</button>
        </div>
      </div>

      {showAddModal && (
        <DrugModal
          title="Add New Drug"
          onClose={() => setShowAddModal(false)}
          onSave={handleCreate}
        />
      )}
      {editDrug && (
        <DrugModal
          title="Edit Drug"
          initial={editDrug}
          onClose={() => setEditDrug(null)}
          onSave={data => handleUpdate({ ...data, id: editDrug.id })}
        />
      )}
      {deleteDrug && (
        <ConfirmModal
          message={`Delete "${deleteDrug.name}"?`}
          onCancel={() => setDeleteDrug(null)}
          onConfirm={() => handleDelete(deleteDrug.id)}
        />
      )}
    </div>
  )
}

// ... keep DrugModal and ConfirmModal unchanged ...


/** Reusable modal props */
interface DrugModalProps {
  title: string
  initial?: Drug
  onSave: (d: Omit<Drug,'id'>) => void
  onClose: () => void
}

/** Create & Edit Modal */
const DrugModal: React.FC<DrugModalProps> = ({ title, initial, onSave, onClose }) => {
  const [name, setName] = useState(initial?.name || '')
  const [dosage, setDosage] = useState(initial?.dosage || '')
  const [quantity, setQuantity] = useState(initial?.quantity.toString() || '1')
  const [instructions, setInstructions] = useState(initial?.instructions || '')
  const [unitPrice, setUnitPrice] = useState(initial?.unitPrice.toFixed(2) || '0.00')

  const handleSubmit = () => {
    onSave({
      name, dosage,
      quantity: Number(quantity),
      instructions,
      unitPrice: Number(unitPrice),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Drug Name</label>
            <input
              className="w-full p-2 border rounded"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Dosage</label>
            <input
              className="w-full p-2 border rounded"
              value={dosage}
              onChange={e => setDosage(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Instructions</label>
            <input
              className="w-full p-2 border rounded"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Unit Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={unitPrice}
              onChange={e => setUnitPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >Save</button>
        </div>
      </div>
    </div>
  )
}


/** Confirm Delete Modal */
interface ConfirmModalProps {
  message: string
  onCancel: () => void
  onConfirm: () => void
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >Cancel</button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >Delete</button>
      </div>
    </div>
  </div>
)
