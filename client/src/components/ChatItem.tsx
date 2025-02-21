import { useAuth } from "../AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Function to extract text & code blocks
function extractCodeFromString(message: string) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g; // Capture optional language + code
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(message)) !== null) {
    const [fullMatch, lang, code] = match;
    const language = lang || "plaintext"; // Default to plaintext if no language is specified

    // Add preceding text
    if (match.index > lastIndex) {
      result.push({ type: "text", content: message.slice(lastIndex, match.index) });
    }

    // Add code block
    result.push({ type: "code", content: code.trim(), language });
    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match
  if (lastIndex < message.length) {
    result.push({ type: "text", content: message.slice(lastIndex) });
  }

  return result.length > 0 ? result : [{ type: "text", content: message }];
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return (
    <div
      className={`flex p-4 gap-4 rounded-lg my-2 ${
        role === "assistant" ? "bg-gray-400 text-black" : "bg-zinc-900 text-white"
      }`}
    >
      {/* Profile Icon */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full">
        {role === "assistant" ? (
          <img src="/bot-image.png" alt="alphabot" className="w-full h-full rounded-full" />
        ) : (
          <div className="bg-gray-200 text-black rounded-full w-10 h-10 flex items-center justify-center text-xl font-semibold">
            {auth?.user?.name
              ? auth.user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "?"}
          </div>
        )}
      </div>

      {/* Chat Content */}
      <div className="w-10/12 flex flex-col">
        {messageBlocks.map((block, index) =>
          block.type === "code" ? (
            <div key={index} className="rounded-lg overflow-hidden my-2">
              <SyntaxHighlighter
                language={block.language}
                style={coldarkDark}
                wrapLongLines
              >
                {block.content}
              </SyntaxHighlighter>
            </div>
          ) : (
            <p key={index} className="text-lg whitespace-pre-wrap">{block.content.trim()}</p>
          )
        )}
      </div>
    </div>
  );
};

export default ChatItem;
