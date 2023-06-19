import { ListContext } from "@/context/ListContext"
import { useContext } from "react"

const useList = () => {
  return useContext(ListContext)
}

export default useList;