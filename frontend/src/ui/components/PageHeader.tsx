import { Show, type JSX } from 'solid-js'
import { cva } from 'class-variance-authority'
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon'
import { IconButton } from './IconButton'
import { Capsule } from './Capsule'
import { useI18n } from '../i18n'

const headerVariants = cva('glass-fade sticky top-0 z-nav relative flex h-15 w-full items-center pl-[1.4375rem] pr-[1.375rem] pt-[env(safe-area-inset-top,0px)] max-[899px]:pl-[1.125rem] max-[899px]:pr-[1.125rem]')
const capsuleVariants = cva('min-w-0 flex-1')
const rowVariants = cva('grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2')
const startVariants = cva('relative z-10 flex shrink-0 items-center justify-start')
const endVariants = cva('relative z-10 flex shrink-0 items-center justify-end')
const titleBlockVariants = cva('flex min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden px-1')
const headerTitleVariants = cva('w-full min-w-0 truncate text-center text-xl font-semibold leading-none')
const headerSubVariants = cva('w-full min-w-0 truncate text-center text-sm leading-none text-secondary')

export function PageHeader(props: {
  title: JSX.Element
  subtitle?: JSX.Element
  onBack?: () => void
  trailing?: JSX.Element
  below?: JSX.Element
}) {
  const { t } = useI18n()
  return (
    <div data-page-header="" class={headerVariants()}>
      <Capsule class={capsuleVariants()}>
        <div class={rowVariants()}>
          <div class={startVariants()}>
            <Show when={props.onBack}>
              {(onBack) => (
                <IconButton size="lg" aria-label={t('ui.back')} onClick={() => onBack()()}>
                  <ChevronLeftIcon width={24} height={24} />
                </IconButton>
              )}
            </Show>
          </div>
          <div class={titleBlockVariants()}>
            <h1 class={headerTitleVariants()}>{props.title}</h1>
            <Show when={props.subtitle}>
              <div class={headerSubVariants()}>{props.subtitle}</div>
            </Show>
          </div>
          <div class={endVariants()}>{props.trailing}</div>
        </div>
      </Capsule>
      {props.below}
    </div>
  )
}