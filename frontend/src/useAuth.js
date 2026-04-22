import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.user) {
          setUser(data.user)
        } else {
          window.location.href = '/'
        }
      })
      .finally(() => setChecking(false))
  }, [])

  return { user, checking }
}
