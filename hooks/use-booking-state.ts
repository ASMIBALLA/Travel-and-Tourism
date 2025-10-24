"use client"

import { useState, useCallback } from "react"

export interface Location {
  name: string
  lat: number
  lng: number
}

export interface BookingState {
  sourceLocation: Location | null
  destination: Location | null
  isMapOpen: boolean
  showTransportOptions: boolean
  selectedTransport: string | null
  bookingHistory: BookingRecord[]
  isMapMinimized: boolean
  isRouteDrawn: boolean
}

export interface BookingRecord {
  id: string
  sourceLocation: Location
  destination: Location
  transportType: string
  transportName: string
  fare: number
  bookedAt: Date
  status: "confirmed" | "completed" | "cancelled"
}

export function useBookingState() {
  const [state, setState] = useState<BookingState>({
    sourceLocation: null,
    destination: null,
    isMapOpen: false,
    showTransportOptions: false,
    selectedTransport: null,
    bookingHistory: [],
    isMapMinimized: false,
    isRouteDrawn: false,
  })

  const setSourceLocation = useCallback((location: Location | null) => {
    setState((prev) => ({ ...prev, sourceLocation: location }))
  }, [])

  const setDestination = useCallback((location: Location | null) => {
    setState((prev) => ({ ...prev, destination: location }))
  }, [])

  const openMap = useCallback(() => {
    setState((prev) => ({ ...prev, isMapOpen: true, isMapMinimized: false, isRouteDrawn: false }))
  }, [])

  const closeMap = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMapOpen: false,
      showTransportOptions: false,
      selectedTransport: null,
      isMapMinimized: false,
      isRouteDrawn: false,
    }))
  }, [])

  const onRouteDrawn = useCallback(() => {
    setState((prev) => ({ ...prev, isRouteDrawn: true }))
    // Minimize map and show transport options after route is drawn
    setTimeout(() => {
      setState((prev) => ({ ...prev, isMapMinimized: true }))
    }, 1000)
    setTimeout(() => {
      setState((prev) => ({ ...prev, showTransportOptions: true }))
    }, 1300)
  }, [])

  const toggleMapSize = useCallback(() => {
    setState((prev) => ({ ...prev, isMapMinimized: !prev.isMapMinimized }))
  }, [])

  const selectTransport = useCallback((transportId: string) => {
    setState((prev) => ({ ...prev, selectedTransport: transportId }))
  }, [])

  const addBookingRecord = useCallback((booking: Omit<BookingRecord, "id" | "bookedAt">) => {
    const newBooking: BookingRecord = {
      ...booking,
      id: `booking-${Date.now()}`,
      bookedAt: new Date(),
    }
    setState((prev) => ({
      ...prev,
      bookingHistory: [newBooking, ...prev.bookingHistory],
    }))
  }, [])

  const canProceed = state.sourceLocation && state.destination

  return {
    ...state,
    setSourceLocation,
    setDestination,
    openMap,
    closeMap,
    selectTransport,
    addBookingRecord,
    canProceed,
    onRouteDrawn,
    toggleMapSize,
  }
}
