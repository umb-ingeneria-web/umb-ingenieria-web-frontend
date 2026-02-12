import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { changeMyPassword, loadSession, updateMyProfile } from '../features/auth/authSlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    if (!user) {
      dispatch(loadSession())
    }
  }, [dispatch, user])

  if (!user) {
    return (
      <div className="rounded-xl bg-[var(--color-surface)] p-6">
        <div className="text-sm text-[var(--color-text-muted)]">Cargando perfil...</div>
      </div>
    )
  }

  return <ProfileForm key={user.id} />
}

function ProfileForm() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault()

    try {
      await dispatch(
        updateMyProfile({
          fullName: fullName ? fullName : null,
          avatarUrl: avatarUrl ? avatarUrl : null,
        }),
      ).unwrap()
      toast.success('Perfil actualizado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible actualizar el perfil')
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault()

    try {
      await dispatch(changeMyPassword({ currentPassword, newPassword })).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      toast.success('Contraseña actualizada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible cambiar la contraseña')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Perfil</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Edita tu información de usuario
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-[var(--color-surface)] p-6">
          <h2 className="text-base font-semibold">Datos del perfil</h2>

          <form className="mt-4 space-y-4" onSubmit={onSaveProfile}>
            <div>
              <label className="mb-1 block text-sm">Nombre completo</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm">Avatar URL</label>
              <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </div>

            <Button type="submit">Guardar</Button>
          </form>
        </div>

        <div className="rounded-xl bg-[var(--color-surface)] p-6">
          <h2 className="text-base font-semibold">Cambiar contraseña</h2>

          <form className="mt-4 space-y-4" onSubmit={onChangePassword}>
            <div>
              <label className="mb-1 block text-sm">Contraseña actual</label>
              <Input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                required
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm">Nueva contraseña</label>
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit">Actualizar contraseña</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
