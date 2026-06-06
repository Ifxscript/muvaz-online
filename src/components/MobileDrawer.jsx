import { X, ChevronRight } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { cn } from '../lib/utils.js'

const NAV_ITEMS = [
  'Home',
  'Browse items',
  'List an item',
  'My profile',
  'Sign in / Sign up',
]

export default function MobileDrawer({ open, active, onClose, onNavigate }) {
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
          'fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto',
          'transition-transform duration-250',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white flex items-center h-14 px-4 border-b border-zinc-200 shrink-0">
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
        </nav>

        {/* Footer CTA card */}
        <div className="p-4 border-t border-zinc-100 shrink-0">
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-sm font-semibold text-white mb-0.5">Moving out?</p>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">We'll sell everything for you.</p>
            <Button
              size="sm"
              className="bg-white text-zinc-900 hover:bg-zinc-100 gap-1.5"
              onClick={() => { onNavigate?.('List an item'); onClose() }}
            >
              Book a pickup <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
