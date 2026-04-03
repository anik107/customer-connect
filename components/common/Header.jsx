import { BarChart3, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* EBL Logo */}
        <div className="h-10 sm:h-12 w-auto flex-shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm p-1.5">
          <Image
            src="/ebl-logo.jpg"
            alt="EBL Logo"
            width={600}
            height={300}
            className="h-full w-auto object-contain"
            priority
            unoptimized
          />
        </div>
        {/* Divider */}
        <div className="hidden sm:block h-10 w-px bg-slate-300 dark:bg-slate-600" />
        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            EBL Connect
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Social Media Analytics
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-700"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};
export default Header;
