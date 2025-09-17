import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            CryptoBotX
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() =>
              window.open(
                "https://cryptobotx-backend-production.up.railway.app/api/test",
                "_blank"
              )
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            API Status
          </button>
          <button
            onClick={() =>
              document
                .querySelector(".trading-dashboard")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Coinbase wallet connect (OnchainKit) */}
          <ConnectWallet disconnectedLabel="Connect Wallet" />

          {/* Keep your existing buttons (optional) */}
          <Button
            variant="outline"
            onClick={() =>
              document
                .querySelector(".trading-dashboard")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Sign In
          </Button>
          <Button
            variant="hero"
            onClick={() =>
              document
                .querySelector(".trading-dashboard")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Trading
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
