import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function LessonContent({ content }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ borderRadius: "0.75rem", margin: "1rem 0", fontSize: "0.875rem", border: "1px solid rgba(124,58,237,0.25)" }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-purple-primary/20 text-purple-bright px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-2xl font-black text-white mb-4 mt-6 gradient-text">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-6 border-b border-purple-primary/20 pb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-purple-bright mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="space-y-1.5 mb-4 ml-4">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-1.5 mb-4 ml-4 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300 flex gap-2"><span className="text-purple-bright mt-1">•</span><span>{children}</span></li>,
          table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse text-sm">{children}</table></div>,
          th: ({ children }) => <th className="bg-purple-primary/20 border border-purple-primary/30 px-4 py-2 text-left text-purple-bright font-semibold">{children}</th>,
          td: ({ children }) => <td className="border border-purple-primary/20 px-4 py-2 text-gray-300">{children}</td>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-primary pl-4 my-4 text-gray-400 italic">{children}</blockquote>,
          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
