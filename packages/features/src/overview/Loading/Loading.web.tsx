import { Card, Skeleton } from '@financial-app/ui'

/**
 * Web implementation of the LoadingView section component.
 */
export const Loading = () => {
  return (
    <div className="p-6 lg:p-10">
      <Skeleton variant="line" height="h-9" width="w-[120px]" rounded />
      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
        <div className="md:flex-1">
          <Card>
            <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            <Skeleton variant="line" height="h-10" width="w-[180px]" rounded />
          </Card>
        </div>
        <div className="md:flex-1">
          <Card>
            <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            <Skeleton variant="line" height="h-10" width="w-[180px]" rounded />
          </Card>
        </div>
        <div className="md:flex-1">
          <Card>
            <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            <Skeleton variant="line" height="h-10" width="w-[180px]" rounded />
          </Card>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card>
            <div className={'flex-row justify-between items-center mb-3'}>
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            </div>
            <div className="p-4 flex-row items-center gap-4">
              <Skeleton
                variant="rectangle"
                height="h-[183px]"
                width="w-[283px]"
                rounded
              />
              <div className="flex mt-4 gap-4">
                <div className="flex flex-col w-1/2 py-2 gap-2">
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                </div>
                <div className="flex flex-col w-1/2 py-2 gap-2">
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                </div>
                <div className="flex flex-col w-1/2 py-2 gap-2">
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                </div>
                <div className="flex flex-col w-1/2 py-2 gap-2">
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                </div>
                <div className="flex flex-col w-1/2 py-2 gap-2">
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                  <Skeleton
                    variant="line"
                    height="h-4"
                    width="w-full"
                    rounded
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className={'flex-row justify-between items-center mb-3'}>
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            </div>
            <div className="p-4 flex-row items-center gap-4"></div>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <div className={'flex-row justify-between items-center mb-3'}>
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            </div>
            <div className="p-4 flex-row items-center gap-4"></div>
          </Card>
          <Card>
            <div className={'flex-row justify-between items-center mb-3'}>
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
              <Skeleton variant="line" height="h-4" width="w-[100px]" rounded />
            </div>
            <div className="p-4 flex-row items-center gap-4"></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
