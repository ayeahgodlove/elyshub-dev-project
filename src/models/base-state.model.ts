import { UpdateMode } from './update-mode.enum'

export interface IBaseState {
    readonly isLoading: boolean
    readonly errors?: any
    readonly updateMode: UpdateMode
}