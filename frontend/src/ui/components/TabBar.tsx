import { cva } from 'class-variance-authority'
import { useI18n } from '../i18n'
import { BoardsIcon } from '../icons/BoardsIcon'
import { SettingsIcon } from '../icons/SettingsIcon'
import { PencilIcon } from '../icons/PencilIcon'
import { IconButton } from './IconButton'

const tabsVariants = cva('fixed inset-x-0 bottom-0 z-tabbar flex items-end px-3 pt-4 pb-[max(16px,env(safe-area-inset-bottom,0px))] pointer-events-none')
const pillVariants = cva('mx-auto flex items-center gap-2 rounded-full glass bg-glass1 p-2 pointer-events-auto', {
  variants: {
    composer: {
      true: 'w-[min(22rem,92%)]',
      false: 'w-[50%]',
    },
  },
  defaultVariants: { composer: false },
})

export function TabBar(props: {
  boardsActive: boolean
  settingsActive: boolean
  onGoHome: () => void
  onOpenSettings: () => void
  onOpenComposer?: () => void
}) {
  const { t } = useI18n()
  return (
    <nav data-tabs="" class={tabsVariants()}>
      <div class={pillVariants({ composer: !!props.onOpenComposer })}>
        <IconButton
          size="xl"
          variant={props.boardsActive ? 'glass' : undefined}
          onClick={props.onGoHome}
          aria-label={t('ui.boards')}
        >
          <BoardsIcon width={24} height={24} />
        </IconButton>
        {props.onOpenComposer && (
          <div class="flex flex-1 justify-center">
            <IconButton size="xl" onClick={() => props.onOpenComposer?.()} aria-label={t('postForm.newMessage')}>
              <PencilIcon width={24} height={24} />
            </IconButton>
          </div>
        )}
        <div class="flex-1" />
        <IconButton
          size="xl"
          variant={props.settingsActive ? 'glass' : undefined}
          onClick={props.onOpenSettings}
          aria-label={t('ui.settings')}
        >
          <SettingsIcon width={24} height={24} />
        </IconButton>
      </div>
    </nav>
  )
}
