import { CloseButton, Input, InputGroup } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { HiSearch } from "react-icons/hi"

interface SearchInputProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
  delay?: number
}

const SearchInput = ({
  delay = 1000,
  placeholder,
  value,
  onSearch,
}: SearchInputProps) => {
  const [search, setSearch] = useState(value)

  useEffect(() => {
    if (value) {
      setSearch(value)
    } else {
      setSearch("")
      onSearch("")
    }
  }, [value, onSearch])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search) {
        onSearch(search)
      } else {
        setSearch("")
        onSearch("")
      }
    }, delay)

    return () => clearTimeout(handler)
  }, [search, delay, onSearch])

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setSearch("")
        onSearch("")
      }}
      me="-2"
    />
  ) : (
    <HiSearch color="gray.300" />
  )

  return (
    <InputGroup width={200} endElement={endElement}>
      <Input
        size="sm"
        placeholder={placeholder ?? "Search..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )
}

export default SearchInput
