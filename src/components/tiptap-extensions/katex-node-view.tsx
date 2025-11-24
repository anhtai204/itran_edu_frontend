// "use client"

// import type React from "react"
// import { useState, useEffect, useRef } from "react"
// import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"
// import katex from "katex"
// import "katex/dist/katex.min.css"

// export function KatexNodeView({ node, updateAttributes, editor }: NodeViewProps) {
//   const formula = node.attrs.formula
//   const inline = node.attrs.inline
//   const [isEditing, setIsEditing] = useState(false)
//   const [localFormula, setLocalFormula] = useState(formula)
//   const textareaRef = useRef<HTMLTextAreaElement>(null)

//   useEffect(() => {
//     setLocalFormula(formula)
//   }, [formula])

//   useEffect(() => {
//     if (isEditing && textareaRef.current) {
//       textareaRef.current.focus()
//       textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
//     }
//   }, [isEditing])

//   const renderKatex = () => {
//     try {
//       return {
//         __html: katex.renderToString(formula || "", {
//           throwOnError: false,
//           displayMode: !inline,
//         }),
//       }
//     } catch (error: any) {
//       return { __html: `<span style="color: red;">Error: ${error.message}</span>` }
//     }
//   }

//   const renderPreview = () => {
//     try {
//       return {
//         __html: katex.renderToString(localFormula || "", {
//           throwOnError: false,
//           displayMode: !inline,
//         }),
//       }
//     } catch (error: any) {
//       return { __html: `<span style="color: red;">Error: ${error.message}</span>` }
//     }
//   }

//   const handleDoubleClick = () => {
//     if (!editor.isEditable) return
//     setIsEditing(true)
//   }

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       updateAttributes({ formula: localFormula })
//       setIsEditing(false)
//     }

//     if (e.key === "Escape") {
//       e.preventDefault()
//       setLocalFormula(formula)
//       setIsEditing(false)
//     }
//   }

//   return (
//     <NodeViewWrapper className="katex-node">
//       {isEditing ? (
//         <div className="katex-editor">
//           <textarea
//             ref={textareaRef}
//             className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
//             value={localFormula}
//             onChange={(e) => setLocalFormula(e.target.value)}
//             onKeyDown={handleKeyDown}
//             onBlur={() => {
//               updateAttributes({ formula: localFormula })
//               setIsEditing(false)
//             }}
//             rows={3}
//           />
//           <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Press Enter to save, Escape to cancel</div>
//           <div className="flex justify-between mt-2">
//             <div className="text-xs text-blue-500">
//               {localFormula ? (
//                 <span>Preview:</span>
//               ) : (
//                 <span>
//                   Enter LaTeX formula (e.g. \frac{"a"}
//                   {"b"})
//                 </span>
//               )}
//             </div>
//             <button
//               className="text-xs bg-primary text-white px-2 py-1 rounded"
//               onClick={() => {
//                 updateAttributes({ formula: localFormula })
//                 setIsEditing(false)
//               }}
//             >
//               Save
//             </button>
//           </div>
//           {localFormula && (
//             <div className="mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-900">
//               <div dangerouslySetInnerHTML={renderPreview()} />
//             </div>
//           )}
//         </div>
//       ) : (
//         <div
//           className={`katex-rendered ${formula ? "" : "katex-empty"} cursor-pointer`}
//           onDoubleClick={handleDoubleClick}
//           data-formula={formula}
//           data-inline={inline.toString()}
//         >
//           {formula ? (
//             <div dangerouslySetInnerHTML={renderKatex()} />
//           ) : (
//             <div className="text-gray-400 p-2 border border-dashed border-gray-300 rounded-md dark:border-gray-600">
//               Double-click to add math formula
//             </div>
//           )}
//         </div>
//       )}
//     </NodeViewWrapper>
//   )
// }



"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import katex from "katex"
import "katex/dist/katex.min.css"

export function KatexNodeView({ node, updateAttributes, editor }: NodeViewProps) {
  const formula = node.attrs.formula
  const inline = node.attrs.inline
  const [isEditing, setIsEditing] = useState(false)
  const [localFormula, setLocalFormula] = useState(formula)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalFormula(formula)
  }, [formula])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length)
    }
    console.log('>>>isEditing: ', isEditing);
  }, [isEditing])

  const renderKatex = () => {
    try {
      return {
        __html: katex.renderToString(formula || "", {
          throwOnError: false,
          displayMode: !inline,
        }),
      }
    } catch (error: any) {
      return { __html: `<span style="color: red;">Error: ${error.message}</span>` }
    }
  }

  const renderPreview = () => {
    try {
      return {
        __html: katex.renderToString(localFormula || "", {
          throwOnError: false,
          displayMode: !inline,
        }),
      }
    } catch (error: any) {
      return { __html: `<span style="color: red;">Error: ${error.message}</span>` }
    }
  }

  const handleDoubleClick = () => {
    if (!editor.isEditable) return
    setIsEditing(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      updateAttributes({ formula: localFormula })
      setIsEditing(false)
    }

    if (e.key === "Escape") {
      e.preventDefault()
      setLocalFormula(formula)
      setIsEditing(false)
    }
  }

  return (
    <NodeViewWrapper className="katex-node inline-block">
      {isEditing ? (
        <div className="katex-editor">
          <textarea
            ref={textareaRef}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={localFormula}
            onChange={(e) => setLocalFormula(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              updateAttributes({ formula: localFormula })
              setIsEditing(false)
            }}
            rows={inline ? 1 : 3}
          />
          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">Press Enter to save, Escape to cancel</div>
          <div className="flex justify-between mt-2">
            <div className="text-xs text-blue-500">
              {localFormula ? (
                <span>Preview:</span>
              ) : (
                <span>
                  Enter LaTeX formula (e.g. \frac{"a"}
                  {"b"})
                </span>
              )}
            </div>
            <button
              className="text-xs bg-primary text-white px-2 py-1 rounded"
              onClick={() => {
                updateAttributes({ formula: localFormula })
                setIsEditing(false)
              }}
            >
              Save
            </button>
          </div>
          {localFormula && (
            <div className="mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-900">
              <div dangerouslySetInnerHTML={renderPreview()} />
            </div>
          )}
        </div>
      ) : (
        <span
          className={`katex-rendered ${formula ? "" : "katex-empty"} cursor-pointer ${inline ? 'inline-block' : 'block'}`}
          onDoubleClick={handleDoubleClick}
          data-formula={formula}
          data-inline={inline.toString()}
        >
          {formula ? (
            <span dangerouslySetInnerHTML={renderKatex()} />
          ) : (
            <span className="text-gray-400 p-1 border border-dashed border-gray-300 rounded-md dark:border-gray-600">
              Formula
            </span>
          )}
        </span>
      )}
    </NodeViewWrapper>
  )
}