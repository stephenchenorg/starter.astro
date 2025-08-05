import { sequence } from 'astro:middleware'
import { auth } from './auth'
import { guest } from './guest'
import { originCheck } from './originCheck'

export const onRequest = sequence(
  originCheck,
  guest,
  auth,
)
