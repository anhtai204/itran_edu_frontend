// import { Node, mergeAttributes } from "@tiptap/core"
// import { ReactNodeViewRenderer } from "@tiptap/react"
// import { KatexNodeView } from "./katex-node-view"

// export interface KatexOptions {
//   HTMLAttributes: Record<string, any>
// }

// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     katex: {
//       insertKatex: (formula: string) => ReturnType
//     }
//   }
// }

// export const Katex = Node.create<KatexOptions>({
//   name: "katex",

//   group: "inline",

//   inline: true,

//   atom: true,

//   addOptions() {
//     return {
//       HTMLAttributes: {},
//     }
//   },

//   addAttributes() {
//     return {
//       formula: {
//         default: "",
//         parseHTML: (element) => element.getAttribute("data-formula"),
//         renderHTML: (attributes) => {
//           return {
//             "data-formula": attributes.formula,
//           }
//         },
//       },
//       inline: {
//         default: true,
//         parseHTML: (element) => element.getAttribute("data-inline") === "true",
//         renderHTML: (attributes) => {
//           return {
//             "data-inline": attributes.inline.toString(),
//           }
//         },
//       },
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: "span[data-katex]",
//       },
//     ]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-katex": "" })]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(KatexNodeView)
//   },

//   addCommands() {
//     return {
//       insertKatex:
//         (formula: string) =>
//         ({ commands }) => {
//           return commands.insertContent({
//             type: this.name,
//             attrs: {
//               formula,
//             },
//           })
//         },
//     }
//   },
// })

import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { KatexNodeView } from "./katex-node-view"

export interface KatexOptions {
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    katex: {
      insertKatex: (formula: string) => ReturnType
      insertInlineKatex: (formula: string) => ReturnType
    }
  }
}

export const Katex = Node.create<KatexOptions>({
  name: "katex",

  group: "inline",

  inline: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      formula: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-formula"),
        renderHTML: (attributes) => {
          return {
            "data-formula": attributes.formula,
          }
        },
      },
      inline: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-inline") === "true",
        renderHTML: (attributes) => {
          return {
            "data-inline": attributes.inline.toString(),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "span[data-katex]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-katex": "" })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(KatexNodeView)
  },

  addCommands() {
    return {
      insertKatex:
        (formula: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              formula,
              inline: false,
            },
          })
        },
      insertInlineKatex:
        (formula: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              formula,
              inline: true,
            },
          })
        },
    }
  },
})
