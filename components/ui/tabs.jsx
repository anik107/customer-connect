"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)

  if (!context) {
    throw new Error("Tabs components must be used within a Tabs root")
  }

  return context
}

function toSafeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-")
}

function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : internalValue

  const setActiveValue = React.useCallback(
    (nextValue) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }

      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: setActiveValue }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  children,
  ...props
}) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "bg-muted text-muted-foreground inline-flex min-h-10 w-fit items-stretch justify-center rounded-lg p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}) {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value
  const triggerId = `tabs-trigger-${toSafeId(value)}`
  const contentId = `tabs-content-${toSafeId(value)}`

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={contentId}
      id={triggerId}
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex min-h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-2 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({
  value,
  className,
  children,
  ...props
}) {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value
  const triggerId = `tabs-trigger-${toSafeId(value)}`
  const contentId = `tabs-content-${toSafeId(value)}`

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      aria-labelledby={triggerId}
      id={contentId}
      hidden={!isActive}
      data-state={isActive ? "active" : "inactive"}
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
