# ReconAudit System - Frontend

## Overview
This is the client-side application for the ReconAudit System, built with **React** and **Vite**. It provides a premium, responsive interface for users to upload financial data, trigger reconciliations, and view audit trails.

## Tech Stack
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Routing**: React Router v7

## Project Structure
*   `src/components`: Reusable UI components (e.g., `Layout`, `DataTable`, `FileUpload`).
*   `src/pages`: Main view definitions (`Dashboard`, `UploadPage`, `ReconciliationPage`, `Auth`).
*   `src/context`: React Context providers (`AuthContext`) for global state management.

## Setup & Run
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the root of the client directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Key Features
*   **Dashboards**: Visual overview of upload stats and reconciliation accuracy.
*   **Drag & Drop Upload**: Intuitive file upload interface with validation.
*   **Interactive Tables**: Filterable and paginated data tables for reviewing reconciliation results.
*   **Responsive Design**: Mobile-friendly layout with a collapsible sidebar and adaptative grids.

## Roles & Permissions
The interface adapts based on the logged-in user's role:
*   **Admin**: Full access to all features, including system-wide audit logs and all uploads.
*   **Analyst**: Operational access to upload files and trigger reconciliation jobs.
*   **Viewer**: Read-only access to dashboards, reports, and audit timelines. Cannot modify data.
