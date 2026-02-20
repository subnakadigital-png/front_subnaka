
# Project Blueprint

## Overview

This project is a real estate platform in Laos. The goal is to provide a user-friendly interface for browsing and managing property listings.

## Features

### Implemented

*   **Firebase Integration:** The project is connected to Firebase for backend services.
*   **Split-View Interface:** A modern split-view layout with a scrollable property list on the left and a full-screen interactive map on the right.
*   **Interactive Map:** Uses MapLibre GL + deck.gl (ScatterplotLayer) with CARTO Positron style. Features smooth flyTo animations and dynamic marker styling.
*   **Design System:** Navy (#1e3a5f) and Gold (#d4af37) color scheme with Noto Sans Lao typography.

## Technical Implementation and Style Guide

### Interactive Map

*   **Technology Stack:**
    *   `react-map-gl/maplibre` (v7) for map rendering.
    *   `deck.gl` (v9) for high-performance data visualization.
    *   `ScatterplotLayer` for property markers (Navy default, Gold when selected).
    *   **Style:** `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`.
*   **Client-Side Rendering:**
    *   To prevent server-side rendering (SSR) errors with WebGL-dependent components, a `ClientOnly` wrapper component is used.
    *   The `ClientOnly` component utilizes `useEffect` to ensure that its children (e.g., the `MapComponent`) are only rendered on the client-side after the component has mounted.
    *   This approach is the standard solution for "Cannot read properties of undefined (reading 'maxTextureDimension2D')" and other SSR-related runtime errors.
*   **API Integration:**
    *   Property location data is fetched from the `/api/properties` endpoint.
    *   The map component gracefully handles the loading state of the data.

### Linting and Code Quality

*   **Custom Hooks for Local Storage:** A `useLocalStorage` custom hook has been implemented to manage state synchronization with `localStorage`. This avoids common `react-hooks/set-state-in-effect` linting errors and centralizes the logic, making components cleaner.
*   **Derived State:** Instead of using `useEffect` to update state that depends on other state (e.g., updating a list of districts when a province changes), the state is derived directly during rendering. This improves performance and simplifies state management.

## Plan

### Completed Tasks

1.  **Create `blueprint.md`:** Established a single source of truth for project architecture and features.
2.  **Create `Map.tsx` Component:** Encapsulated all map-related logic.
3.  **Integrate Map into Homepage:** Imported and rendered the `Map.tsx` component in `src/app/page.tsx`.
4.  **Create API Endpoint:** Set up a new API route to serve property data.
5.  **Fetch and Display Data:** Used `deck.gl` to fetch and visualize data.
6.  **Resolve Build & Runtime Errors:**
    *   Fixed `Module not found` errors by specifying compatible versions of `react-map-gl` and `maplibre-gl` in `package.json` and ensuring correct import paths (`react-map-gl/maplibre`).
    *   Fixed `ENOSPC: no space left on device` error by clearing build caches and reinstalling dependencies.
    *   Fixed SSR `TypeError: maxTextureDimension2D` by implementing a `ClientOnly` wrapper component.
    *   Resolved `maxTextureDimension2D` runtime error by disabling `reactStrictMode` in `next.config.mjs` and updating `DeckGL` props to use `deviceProps` instead of deprecated `glOptions`.
    *   Improved LCP performance by adding `priority` to the hero image in `page.tsx`.
    *   Resolved all outstanding ESLint errors for cleaner, more efficient code.
