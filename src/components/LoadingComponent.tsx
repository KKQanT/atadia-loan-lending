import { FC } from 'react'

export const LoadingComponent: FC = () => {
  return (
    <div className="w-40 h-40 border-t-4 border-b-4 border-violet-500 rounded-full animate-spin" role="status">
      <span className="visually-hidden"></span>
    </div>
  )
}