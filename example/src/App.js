import React from 'react'

import { useMyHook } from 'easy-form-hook'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
