type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
}
export default function Button({ children, onClick, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      {...props}
      className="mx-auto rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
    >
      {children}
    </button>
  )
}
