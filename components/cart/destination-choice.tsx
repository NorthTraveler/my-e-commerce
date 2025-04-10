"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { province,city } from "@/lib/place"

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [cityCode,setCityCode] =React.useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? province.find((province) => province.code === value)?.name
            : "选择一个省份"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜索省份" />
          <CommandList>
            <CommandEmpty>没有找到相关省份</CommandEmpty>
            <CommandGroup>
              {province.map((province) => (
                <CommandItem
                  key={province.code}
                  value={province.code}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {province.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === province.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {value ? 
      <>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? city.find((city) => city.code === cityCode && value === city.provinceCode)?.name
            : "查询城市..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>没有城市找到.</CommandEmpty>
            <CommandGroup>
              {city.map((city) => (
                <CommandItem
                  key={city.code}
                  value={city.name}
                  onSelect={(currentValue) => {
                    setCityCode(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {city.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      cityCode === city.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
      </>:<></>}

    </Popover>
  )
}
