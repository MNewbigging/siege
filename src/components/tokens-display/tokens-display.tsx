import "./tokens-display.scss";

interface TokensDisplayProps {
  magicTokens?: number;
  strengthTokens?: number;
}

export function TokensDisplay({
  magicTokens,
  strengthTokens,
}: TokensDisplayProps) {
  if (!magicTokens && !strengthTokens) return null;

  return (
    <div className="tokens-display">
      <div className="tokens">
        {magicTokens &&
          Array.from({ length: magicTokens }, (_, index) => (
            <Token key={`magic-token-${index}`} type="magic" />
          ))}
      </div>
      <div className="tokens">
        {strengthTokens &&
          Array.from({ length: strengthTokens }, (_, index) => (
            <Token key={`strength-token-${index}`} type="strength" />
          ))}
      </div>
    </div>
  );
}

function Token({ type }: { type: "magic" | "strength" }) {
  return <div className={`token ${type}`}></div>;
}
