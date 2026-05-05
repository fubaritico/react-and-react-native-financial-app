import { PotCard } from '@financial-app/features'
import { mockPots } from '@financial-app/shared'
import { Button, Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

export default function Pots() {
  const { t } = useTranslation()

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="page-title" as="h1">
          {t('pots.title')}
        </Typography>
        <Button
          title={t('pots.addNewPot')}
          onPress={noop}
          variant="primary"
          disabled
        />
      </div>

      {/* 2-col grid when content area >= 1100px */}
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-2">
        {mockPots.map((pot) => (
          <PotCard
            key={pot.id}
            name={pot.name}
            total={pot.total}
            target={pot.target}
            color={pot.theme}
            totalSavedLabel={t('pots.totalSaved')}
            targetOfLabel={t('pots.targetOf')}
            addMoneyLabel={t('pots.addMoney')}
            withdrawLabel={t('pots.withdraw')}
            editLabel={t('pots.editPot')}
            deleteLabel={t('pots.deletePot')}
          />
        ))}
      </div>
    </div>
  )
}
