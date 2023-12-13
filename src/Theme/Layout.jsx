import { useMediaQuery } from 'react-responsive'

export const useLargeScreen = () =>
  useMediaQuery({ query: '(min-width: 1824px)' })

export const useDesktop = () =>
  useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1823px)' })

export const useMobileOrTablet = () =>
  useMediaQuery({ query: '(max-width: 1279px)' })

export const useTablet = () =>
  useMediaQuery({ query: '(min-width: 768px) and (max-width: 1279px)' })

export const useMobile = () =>
  useMediaQuery({ query: '(max-width: 767px)' })