import { UpdateMode } from './update-mode.enum'

export interface IBaseState {
    readonly isLoading: boolean
    readonly errors?: string
    readonly updateMode: UpdateMode
}