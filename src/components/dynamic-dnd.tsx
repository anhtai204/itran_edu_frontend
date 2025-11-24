"use client"

import dynamic from "next/dynamic"

// Dynamically import DragDropContext, Droppable, and Draggable with SSR disabled
export const DragDropContext = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.DragDropContext), {
  ssr: false,
})

export const Droppable = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.Droppable), { ssr: false })

export const Draggable = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.Draggable), { ssr: false })

