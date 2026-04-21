"use client"

import React from "react"
import { Cpu } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "")
  return !inline && match ? (
    <div className="my-2">
      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-white/5 px-1 rounded" {...props}>
      {children}
    </code>
  )
}

export default function AIMessage({ children }) {
  const text = typeof children === "string" || typeof children === "number" ? String(children) : null

  return (
    <div className="w-full flex justify-start">
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="rounded-full bg-white/5 p-2">
          <Cpu className="size-5 text-white" />
        </div>
        <div className="rounded-xl bg-slate-800 px-4 py-2 text-white break-words prose prose-invert max-w-full">
          {text ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
              {text}
            </ReactMarkdown>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  )
}
