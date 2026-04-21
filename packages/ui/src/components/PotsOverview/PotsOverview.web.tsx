import { SectionLink } from '../SectionLink/SectionLink.web'

import type { IPotsOverviewProps } from './PotsOverview'

/** Web implementation of the PotsOverview section component. */
export const PotsOverview = ({
  totalSaved,
  pots,
  onSeeDetails,
  icon,
}: IPotsOverviewProps) => (
  <section>
    {/* Header row */}
    <div className="flex flex-row justify-between items-center">
      <h3 className="text-base font-bold text-grey-900">Pots</h3>
      <SectionLink label="See Details" onPress={onSeeDetails} />
    </div>

    {/* Card */}
    <div className="bg-white rounded-xl p-5 mt-3">
      {/* Inner layout: stacked on mobile, side by side on desktop */}
      <div className="flex flex-col md:flex-row md:gap-5">
        {/* Total Saved box */}
        <div className="bg-beige-100 rounded-xl p-4 flex flex-row items-center gap-4 md:flex-1">
          {/* Icon area */}
          <div className="bg-grey-900 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            {icon ?? <span className="text-white font-bold text-base">$</span>}
          </div>

          {/* Total saved text */}
          <div>
            <p className="text-xs text-grey-500">Total Saved</p>
            <p className="text-2xl font-bold text-grey-900">{totalSaved}</p>
          </div>
        </div>

        {/* Pots grid — 2 columns */}
        <div className="grid grid-cols-2 gap-x-4 mt-4 md:mt-0 md:flex-1">
          {pots.map((pot) => (
            <div key={pot.name} className="py-2">
              <div
                className="pl-4"
                style={{
                  borderLeft: `4px solid var(--color-base-${pot.color}-default)`,
                }}
              >
                <p className="text-xs text-grey-500">{pot.name}</p>
                <p className="text-sm font-bold text-grey-900">{pot.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)
