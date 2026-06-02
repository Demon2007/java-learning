import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Play, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

const defaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, JavaQuest!");
    }
}`;

export default function CodeEditor({ initialCode = "", readOnly = false }) {
  const [code, setCode] = useState(initialCode || defaultCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const editorRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("// Compiling...\n");
    await new Promise(r => setTimeout(r, 800));
    // Simulate Java execution
    const lines = [];
    const printMatches = [...code.matchAll(/System\.out\.println\(([^)]+)\)/g)];
    if (printMatches.length) {
      printMatches.forEach(m => {
        let val = m[1].replace(/"/g, "").replace(/'/g, "");
        lines.push(val);
      });
      setOutput("// Output:\n" + lines.join("\n"));
    } else {
      setOutput("// Program executed successfully. No output.");
    }
    setRunning(false);
    toast.success("Code executed!");
  };

  const handleReset = () => {
    setCode(initialCode || defaultCode);
    setOutput("");
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-purple-primary/25" style={{ background: "#1e1e2e" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-purple-primary/20" style={{ background: "#1a1a2e" }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-gray-500 ml-2 font-mono">Main.java</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10">
            <Copy className="w-3.5 h-3.5" />
          </button>
          {!readOnly && (
            <Button size="xs" onClick={handleRun} loading={running} icon={Play}>
              Run
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <Editor
        height="300px"
        language="java"
        value={code}
        onChange={readOnly ? undefined : setCode}
        onMount={(editor) => { editorRef.current = editor; }}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          roundedSelection: true,
          automaticLayout: true,
          readOnly,
          padding: { top: 16, bottom: 16 },
          scrollbar: { verticalScrollbarSize: 6 },
        }}
      />

      {/* Output */}
      {output && (
        <div className="border-t border-purple-primary/20 p-4" style={{ background: "#12121e" }}>
          <p className="text-xs text-gray-500 font-mono mb-2">Console Output:</p>
          <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
