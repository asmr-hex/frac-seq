import { createContext } from 'react'
import './monkey-patch'

export const audioContext = new AudioContext()
const context = createContext({ audioContext })

export default context
