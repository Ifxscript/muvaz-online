import { X, ChevronRight } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { cn } from '../lib/utils.js'
import P5PeteAvatar from './P5PeteAvatar.jsx'

export default function MobileDrawer({ open, active, onClose, onNavigate, currentUser, onSignOut }) {
  const isAdmin = currentUser?.role === 'ADMIN'
  const NAV_ITEMS = currentUser
    ? ['Home', 'Browse items', 'List an item', 'My profile', ...(isAdmin ? ['Admin panel'] : [])]
    : ['Home', 'Browse items', 'List an item', 'Sign in / Sign up']
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-250',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-[#faf9f5] flex flex-col overflow-y-auto',
          'transition-transform duration-250',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#faf9f5] flex items-center h-14 px-4 border-b border-zinc-200 shrink-0">
          <span className="font-extrabold text-xl tracking-tight text-zinc-900 select-none">
            muvaz<span className="text-zinc-300">.</span>
          </span>
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center w-8 h-8 rounded-md hover:bg-zinc-100 transition-colors"
          >
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        {/* Logged-in user tile */}
        {currentUser && (
          <div className="px-4 py-3 border-b border-zinc-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50">
              <P5PeteAvatar displaySize={48} userId={currentUser?.id ?? currentUser?.email} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 leading-none truncate">{currentUser.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Flat nav */}
        <nav className="flex-1 px-2 py-3">
          {NAV_ITEMS.map(label => {
            const isActive = label === active
            return (
              <button
                key={label}
                onClick={() => { onNavigate?.(label); onClose() }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-3 rounded-md mb-0.5 text-[15px] transition-colors text-left',
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-normal'
                )}
              >
                {label}
                {isActive && <ChevronRight size={14} className="text-zinc-400 shrink-0" />}
              </button>
            )
          })}

          {/* Sign out — only when logged in */}
          {currentUser && (
            <button
              onClick={() => { onSignOut?.(); onClose() }}
              className="w-full flex items-center px-3 py-3 rounded-md mt-2 text-[15px] text-red-500 hover:bg-red-50 transition-colors text-left font-normal"
            >
              Sign out
            </button>
          )}
        </nav>

        {/* Footer CTA card */}
        <div className="p-4 border-t border-zinc-100 shrink-0">
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm font-semibold text-white mb-0.5">Have items you want to sell?</p>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">List it and reach buyers.</p>
            <Button
              size="sm"
              className="bg-[#D97757] hover:bg-[#c96848] text-white border-0 gap-1.5"
              onClick={() => { onNavigate?.('List an item'); onClose() }}
            >
              List an item <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
