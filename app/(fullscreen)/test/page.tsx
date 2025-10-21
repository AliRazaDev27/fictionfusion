"use client"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula as dark } from "react-syntax-highlighter/dist/esm/styles/prism"
// dark,funky, okaidia, tomorrow,twilight,a11ydark,
const data = {
    "type": "debug",
    "question": "Why isn't this component re-rendering when the `items` prop changes?",
    "code": "import React from 'react';\n\nfunction ItemList({ items }) {\n  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;\n}\n\nconst MemoedList = React.memo(ItemList);\n\n// Parent component usage:\nfunction Parent() {\n  const [items, setItems] = useState([1, 2]);\n\n  const addItem = () => {\n    items.push(3); // Mutating the prop directly\n    setItems(items);\n  };\n\n  return <MemoedList items={items} />;\n}",
    "options": [
      "`React.memo` is being used incorrectly.",
      "The `items` array is being mutated directly.",
      "The `key` prop is incorrect.",
      "The `addItem` function is not passed as a prop."
    ],
    "answer": "The `items` array is being mutated directly.",
    "explanation": "`React.memo` performs a shallow comparison of props. By mutating the `items` array with `.push()` and then calling `setItems(items)`, the *reference* to the array remains the same. React and `React.memo` see the same prop value and do not re-render. You must create a new array: `setItems([...items, 3])`."
}
export default function Page(){
  return(
    <div className="max-w-7xl w-full mx-auto border grid grid-cols-2">
      <div>
        <h1>{data.question}</h1>
        <div className="min-h-[70vh] bg-black">
          <SyntaxHighlighter style={dark} showLineNumbers language="jsx">{data.code}</SyntaxHighlighter>
        </div>
      </div>
      <div>
        <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic ab placeat exercitationem quibusdam numquam minima quas, mol</h1>

      </div>
    </div>

  )
}