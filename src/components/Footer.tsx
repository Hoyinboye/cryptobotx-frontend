import { Bot, Twitter, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                CryptoBotX
              </span>
            </div>
            <p className="text-muted-foreground">
              AI-powered cryptocurrency trading automation platform. Trade smarter, not harder.
            </p>
            <div className="flex gap-4">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-foreground cursor-pointer transition-colors">Features</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Strategies</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Pricing</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">API</div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-foreground cursor-pointer transition-colors">Documentation</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Help Center</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Community</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Contact</div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Risk Disclosure</div>
              <div className="hover:text-foreground cursor-pointer transition-colors">Security</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CryptoBotX. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            ⚠️ Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;