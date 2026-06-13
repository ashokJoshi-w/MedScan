const Spinner = ({ size = 'sm' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }
  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-white border-t-transparent`} />
  )
}

export default Spinner