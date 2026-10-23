import { For, Show } from 'solid-js'
import { cva } from 'class-variance-authority'
import { useI18n } from '../../i18n'
import { IconButton } from '../IconButton'
import { FlagIcon } from '../../icons/FlagIcon'
import { ScanQrCodeIcon } from '../../icons/ScanQrCodeIcon'
import { BroomIcon } from '../../icons/BroomIcon'
import type { RoleKind, RoleOption } from '../../../core/intent/roles'

/** мобилка: колонка на всю ширину; ПК: горизонтальный ряд чипов справа */
const metaStackVariants = cva(
  'flex w-full min-w-0 flex-col gap-1.5 max-[899px]:grid max-[899px]:grid-cols-3 max-[899px]:gap-1 min-[900px]:w-auto min-[900px]:flex-row min-[900px]:flex-wrap min-[900px]:items-center min-[900px]:justify-end',
)
/** select: запас справа под нативный шеврон */
const chipSelectVariants = cva(
  'h-9 min-w-0 w-full cursor-pointer appearance-none rounded-full border-0 bg-panel2 bg-[length:12px_12px] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-8 text-left text-[15px] text-fg outline-none transition-colors hover:bg-hover max-[899px]:px-2 max-[899px]:pr-6 max-[899px]:text-[13px] min-[900px]:w-auto',
)
const chipNoHatVariants = cva(
  'h-9 min-w-0 w-full cursor-pointer appearance-none rounded-full border-0 bg-panel2 bg-[length:12px_12px] bg-[right_0.75rem_center] bg-no-repeat px-3 pr-8 text-left text-[15px] text-fg outline-none transition-colors hover:bg-hover max-[899px]:px-2 max-[899px]:pr-6 max-[899px]:text-[13px] min-[900px]:w-auto',
)
const chipNameVariants = cva(
  'h-9 min-w-0 w-full rounded-full border-0 bg-panel2 px-3 text-left text-[15px] text-fg outline-none transition-colors placeholder:text-secondary hover:bg-hover max-[899px]:px-2 min-[900px]:w-[8.25rem]',
)
export interface OptionsPanelProps {
  isEdit: boolean
  name: string
  onNameChange: (v: string) => void
  sendAsKind: RoleKind
  onSendAsKindChange: (k: RoleKind) => void
  roles: RoleOption[]
  isThread: boolean
  withFlag: boolean
  onWithFlagChange: (value: boolean) => void
  stripExifOn: boolean
  onStripExifChange: (value: boolean) => void
  selfAdmin: boolean
  onSelfAdminChange: (value: boolean) => void
}

export function OptionsPanel(props: OptionsPanelProps) {
  const { t } = useI18n()

  return (
    <Show when={!props.isEdit}>
      <div class={metaStackVariants()}>
        <div class="flex w-full min-w-0 items-center gap-1.5 max-[899px]:contents min-[900px]:w-auto min-[900px]:flex-none">
          <div class={`flex flex-none items-center gap-1 max-[899px]:col-span-3 ${props.isThread ? 'thread-special-actions' : ''}`}>
            <IconButton
              size="md"
              title={t('postForm.withFlag')}
              aria-label={t('postForm.withFlag')}
              aria-pressed={props.withFlag}
              onClick={() => props.onWithFlagChange(!props.withFlag)}
            >
              <FlagIcon
                width={24}
                height={24}
                class={props.withFlag ? 'text-fg transition-colors' : 'text-secondary transition-colors'}
              />
            </IconButton>
            <IconButton
              size="md"
              title={t('postForm.stripExif')}
              aria-label={t('postForm.stripExif')}
              aria-pressed={props.stripExifOn}
              onClick={() => props.onStripExifChange(!props.stripExifOn)}
            >
              <ScanQrCodeIcon
                width={24}
                height={24}
                class={props.stripExifOn ? 'text-fg transition-colors' : 'text-secondary transition-colors'}
              />
            </IconButton>
            <Show when={props.isThread}>
              <IconButton
                size="md"
                title={t('postForm.becomeAdmin')}
                aria-label={t('postForm.becomeAdmin')}
                aria-pressed={props.selfAdmin}
                onClick={() => props.onSelfAdminChange(!props.selfAdmin)}
              >
                <BroomIcon
                  width={24}
                  height={24}
                  class={props.selfAdmin ? 'text-fg transition-colors' : 'text-secondary transition-colors'}
                />
              </IconButton>
            </Show>
          </div>
          <select class={chipNoHatVariants()} style={{ 'background-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` }} value="" aria-label={t('postForm.noHat')}>
            <option value="">{t('postForm.noHat')}</option>
          </select>
        </div>
        <input
          class={chipNameVariants()}
          value={props.name}
          onInput={(e) => props.onNameChange(e.currentTarget.value)}
          placeholder={t('postForm.name')}
        />
        <select
          class={chipSelectVariants()}
          style={{ 'background-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b8b8b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")` }}
          value={props.sendAsKind}
          onInput={(e) => props.onSendAsKindChange(e.currentTarget.value as RoleKind)}
          aria-label={t('postForm.name')}
        >
          <For each={props.roles}>
            {(option) => (
              <option value={option.kind} title={option.addressHex}>
                {t(option.labelKey)}
              </option>
            )}
          </For>
        </select>
      </div>
    </Show>
  )
}
