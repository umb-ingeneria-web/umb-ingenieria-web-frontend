import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchUsers, setUserEnabled, setUserRoles } from '../features/adminUsers/adminUsersSlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import MultiSelect from '../components/ui/MultiSelect'
import Select from '../components/ui/Select'
import Switch from '../components/ui/Switch'
import { FilterIcon, SearchIcon, WhatsappIcon } from '../components/icons/Icons.component'

export default function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const { users, loading, page, size, totalPages, rolesByUserId } = useAppSelector(
    (s) => s.adminUsers,
  )

  const [pageSize, setPageSize] = useState(size)
  const [savingRolesById, setSavingRolesById] = useState<Record<string, boolean>>({})

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled' | 'admin' | 'user'>('all')

  const myRoles = useAppSelector((s) => s.auth.user?.roles ?? [])

  const roleOptions = useMemo(() => {
    const set = new Set<string>(['USER', 'ADMIN', ...myRoles])
    for (const u of users) {
      const roles = rolesByUserId[u.id]
      if (roles) roles.forEach((r) => set.add(r))
    }
    return Array.from(set)
  }, [myRoles, rolesByUserId, users])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()

    return users.filter((u) => {
      const roles = rolesByUserId[u.id] ?? u.roles ?? []
      const isAdmin = roles.includes('ADMIN')

      const matchesSearch =
        q.length === 0 ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.fullName ?? '').toLowerCase().includes(q)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'enabled' && u.enabled) ||
        (filter === 'disabled' && !u.enabled) ||
        (filter === 'admin' && isAdmin) ||
        (filter === 'user' && !isAdmin)

      return matchesSearch && matchesFilter
    })
  }, [filter, rolesByUserId, search, users])

  useEffect(() => {
    dispatch(fetchUsers({ page: 0, size: pageSize }))
  }, [dispatch, pageSize])

  async function onToggleEnabled(id: string, enabled: boolean) {
    try {
      await dispatch(setUserEnabled({ id, enabled })).unwrap()
      toast.success('Estado actualizado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible actualizar el estado')
    }
  }

  async function onUpdateRoles(id: string, roles: string[]) {
    try {
      setSavingRolesById((prev) => ({ ...prev, [id]: true }))
      await dispatch(setUserRoles({ id, roles })).unwrap()
      toast.success('Roles actualizados')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible actualizar roles')
    } finally {
      setSavingRolesById((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Gestiona estado y roles de los usuarios
          </p>
        </div>

        <Button type="button" className="h-10 rounded-xl px-5">
          Crear usuario
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--color-text-muted)]">
            <SearchIcon className="h-5 w-5" />
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="h-12 rounded-xl pl-12"
          />
        </div>

        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--color-text-muted)]">
            <FilterIcon className="h-5 w-5" />
          </div>

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="h-12 rounded-xl pl-12 pr-12"
          >
            <option value="all">Todos los usuarios</option>
            <option value="enabled">Activos</option>
            <option value="disabled">Inactivos</option>
            <option value="admin">Administradores</option>
            <option value="user">No administradores</option>
          </Select>
        </div>

        <div className="hidden w-[70px] sm:block">
          <Select
            value={String(pageSize)}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-10 rounded-xl max-w-[70px]"
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[rgba(17,24,39,0.03)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3 2">Usuario</th>
                <th className="px-4 py-3 text-center">Telefono</th>
                <th className="px-4 py-3 text-center">Roles</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right w-25">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-[rgba(17,24,39,0.06)]">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-[var(--color-text)]">
                        {u.fullName || 'Sin nombre'}
                      </div>
                      <div className="truncate text-xs text-[var(--color-text-muted)]">{u.email}</div>
                    </div>
                  </td>
                    <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center justify-center gap-2 truncate text-[var(--color-text)]">
                        {u.phoneNumber && <a href={`https://wa.me/${u.phoneCountryCode}${u.phoneNumber}`} target="_blank" rel="noopener noreferrer"><WhatsappIcon className='text-green-500' /></a>} {u.phoneCountryCode ? `+${u.phoneCountryCode}` : ''} {u.phoneNumber || 'Sin teléfono'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <MultiSelect
                        options={roleOptions
                          .slice()
                          .sort()
                          .map((r) => ({ value: r, label: r }))}
                        value={rolesByUserId[u.id] ?? u.roles ?? []}
                        disabled={loading || !!savingRolesById[u.id]}
                        onApply={(next) => onUpdateRoles(u.id, next)}
                      />
                      {savingRolesById[u.id] && (
                        <div className="text-xs text-[var(--color-text-muted)]">Guardando...</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 pt-5 flex items-end justify-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${u.enabled
                        ? 'bg-[rgba(22,162,73,0.12)] text-[rgb(22,162,73)]'
                        : 'bg-[rgba(239,68,68,0.12)] text-[rgb(239,68,68)]'
                        }`}
                    >
                      {u.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end mr-2">
                      <Switch
                        checked={u.enabled}
                        onChange={(next) => onToggleEnabled(u.id, next)}
                        disabled={loading}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm text-[var(--color-text-muted)]" colSpan={4}>
                    No hay usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[rgba(17,24,39,0.06)] p-4">
          <div className="text-sm text-[var(--color-text-muted)]">
            Página {page + 1} de {Math.max(totalPages, 1)}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={loading || page <= 0}
              onClick={() => dispatch(fetchUsers({ page: page - 1, size: pageSize }))}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              disabled={loading || totalPages === 0 || page >= totalPages - 1}
              onClick={() => dispatch(fetchUsers({ page: page + 1, size: pageSize }))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
