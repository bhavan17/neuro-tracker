import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Brain, ArrowLeft, Cpu, User, LayoutDashboard, MemoryStick, HardDrive, Zap, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface AIModelsPageProps {
  userName: string;
  userEmail: string;
  onBack: () => void;
  onViewDashboard: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

interface SystemConfig {
  cpu: string;
  gpu: string;
  ram: number;
  vram: number;
  storage: number;
}

interface AIModel {
  name: string;
  size: string;
  minVRAM: number;
  minRAM: number;
  performance: string;
  category: string;
}

export function AIModelsPage({ 
  userName, 
  userEmail, 
  onBack, 
  onViewDashboard, 
  onViewProfile, 
  onLogout 
}: AIModelsPageProps) {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    cpu: "Unknown",
    gpu: "Unknown",
    ram: 8,
    vram: 4,
    storage: 256,
  });

  // Attempt to detect system configuration
  useEffect(() => {
    const detectSystem = async () => {
      const detected: Partial<SystemConfig> = {};

      // Detect CPU cores
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency;
        detected.cpu = `${cores}-Core Processor`;
      }

      // Detect RAM (approximate)
      if ('deviceMemory' in navigator) {
        detected.ram = (navigator as any).deviceMemory;
      }

      // Try to get GPU info
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            detected.gpu = renderer;
            
            // Estimate VRAM based on GPU name
            if (renderer.includes('4090')) detected.vram = 24;
            else if (renderer.includes('4080')) detected.vram = 16;
            else if (renderer.includes('4070')) detected.vram = 12;
            else if (renderer.includes('3090')) detected.vram = 24;
            else if (renderer.includes('3080')) detected.vram = 10;
            else if (renderer.includes('3070')) detected.vram = 8;
            else if (renderer.includes('3060')) detected.vram = 12;
            else if (renderer.includes('AMD') || renderer.includes('Radeon')) {
              if (renderer.includes('7900')) detected.vram = 20;
              else if (renderer.includes('7800')) detected.vram = 16;
              else if (renderer.includes('6900')) detected.vram = 16;
              else if (renderer.includes('6800')) detected.vram = 16;
              else detected.vram = 8;
            }
            else if (renderer.includes('Intel')) detected.vram = 0; // Integrated graphics
          }
        }
      } catch (e) {
        console.log('GPU detection not available');
      }

      // Try to estimate storage
      if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
        try {
          const estimate = await (navigator as any).storage.estimate();
          if (estimate.quota) {
            detected.storage = Math.round(estimate.quota / (1024 * 1024 * 1024)); // Convert to GB
          }
        } catch (e) {
          console.log('Storage detection not available');
        }
      }

      // Load saved config from localStorage or use detected values
      const savedConfig = localStorage.getItem('neurotracker_system_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setSystemConfig(parsed);
      } else {
        const newConfig = { ...systemConfig, ...detected };
        setSystemConfig(newConfig);
      }
    };

    detectSystem();
  }, []);

  // Calculate compatibility score (0-100)
  const compatibilityScore = useMemo(() => {
    let score = 0;
    
    // VRAM contribution (40%)
    if (systemConfig.vram >= 24) score += 40;
    else if (systemConfig.vram >= 16) score += 35;
    else if (systemConfig.vram >= 12) score += 30;
    else if (systemConfig.vram >= 8) score += 25;
    else if (systemConfig.vram >= 6) score += 15;
    else score += 8;
    
    // RAM contribution (30%)
    if (systemConfig.ram >= 64) score += 30;
    else if (systemConfig.ram >= 32) score += 25;
    else if (systemConfig.ram >= 16) score += 18;
    else score += 10;
    
    // GPU type contribution (20%)
    if (systemConfig.gpu.includes("4090") || systemConfig.gpu.includes("4080")) score += 20;
    else if (systemConfig.gpu.includes("4070") || systemConfig.gpu.includes("3090")) score += 18;
    else if (systemConfig.gpu.includes("3080") || systemConfig.gpu.includes("3070")) score += 15;
    else if (systemConfig.gpu.includes("3060") || systemConfig.gpu.includes("AMD")) score += 12;
    else score += 8;
    
    // Storage contribution (10%)
    if (systemConfig.storage >= 2000) score += 10;
    else if (systemConfig.storage >= 1000) score += 8;
    else if (systemConfig.storage >= 500) score += 6;
    else score += 4;
    
    return Math.min(100, score);
  }, [systemConfig]);

  // Generate parabola curve data points
  const parabolaData = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 100; x += 2) {
      // Inverted parabola: y = -a(x - 50)^2 + 100
      const a = 0.04; // Controls the width of the parabola
      const y = -a * Math.pow(x - 50, 2) + 100;
      points.push({ x, y: Math.max(0, y) });
    }
    return points;
  }, []);

  // Convert data points to SVG path
  const parabolaPath = useMemo(() => {
    const width = 400;
    const height = 200;
    
    return parabolaData.map((point, index) => {
      const x = (point.x / 100) * width;
      const y = height - (point.y / 100) * height;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  }, [parabolaData]);

  // Calculate user's position on the curve
  const userPosition = useMemo(() => {
    const width = 400;
    const height = 200;
    const x = (compatibilityScore / 100) * width;
    const a = 0.04;
    const y = -a * Math.pow(compatibilityScore - 50, 2) + 100;
    const yPos = height - (Math.max(0, y) / 100) * height;
    return { x, y: yPos };
  }, [compatibilityScore]);

  // Get rating text based on score
  const getRating = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "text-green-500" };
    if (score >= 60) return { text: "Good", color: "text-blue-500" };
    if (score >= 40) return { text: "Fair", color: "text-orange-500" };
    return { text: "Limited", color: "text-red-500" };
  };

  const rating = getRating(compatibilityScore);

  // AI Models database
  const allModels: AIModel[] = [
    { name: "Llama 3.2 1B", size: "1B", minVRAM: 2, minRAM: 4, performance: "Fast", category: "Small" },
    { name: "Llama 3.2 3B", size: "3B", minVRAM: 4, minRAM: 8, performance: "Fast", category: "Small" },
    { name: "Phi-3 Mini", size: "3.8B", minVRAM: 4, minRAM: 8, performance: "Fast", category: "Small" },
    { name: "Gemma 2B", size: "2B", minVRAM: 3, minRAM: 6, performance: "Fast", category: "Small" },
    { name: "Llama 3.1 8B", size: "8B", minVRAM: 6, minRAM: 12, performance: "Balanced", category: "Medium" },
    { name: "Mistral 7B", size: "7B", minVRAM: 6, minRAM: 12, performance: "Balanced", category: "Medium" },
    { name: "Gemma 7B", size: "7B", minVRAM: 6, minRAM: 12, performance: "Balanced", category: "Medium" },
    { name: "Llama 3.1 70B", size: "70B", minVRAM: 24, minRAM: 48, performance: "High Quality", category: "Large" },
    { name: "Mixtral 8x7B", size: "47B", minVRAM: 20, minRAM: 40, performance: "High Quality", category: "Large" },
    { name: "GPT-4 Vision", size: "API", minVRAM: 0, minRAM: 4, performance: "Cloud-based", category: "API" },
  ];

  // Filter compatible models
  const compatibleModels = allModels.filter(
    model => model.minVRAM <= systemConfig.vram && model.minRAM <= systemConfig.ram
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="tracking-wider font-[Bungee_Inline] text-[20px]">NEUROTRACKER</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onViewDashboard}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl">AI Models</h2>
              <p className="text-xl text-muted-foreground mt-2">
                System compatibility and recommended models
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* System Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 p-6">
              <h3 className="font-medium text-2xl mb-6">System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm">Processor</span>
                  </div>
                  <p className="font-medium">{systemConfig.cpu}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm">Graphics Card</span>
                  </div>
                  <p className="font-medium">{systemConfig.gpu}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MemoryStick className="h-4 w-4" />
                    <span className="text-sm">RAM / VRAM</span>
                  </div>
                  <p className="font-medium">{systemConfig.ram}GB / {systemConfig.vram}GB</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HardDrive className="h-4 w-4" />
                    <span className="text-sm">Storage</span>
                  </div>
                  <p className="font-medium">{systemConfig.storage}GB SSD</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Compatibility Score with Parabola Curve */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 p-8">
              <h3 className="font-medium text-2xl mb-6">Compatibility Score</h3>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Score Display */}
                <div className="text-center lg:text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl font-bold">{compatibilityScore}</div>
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">out of 100</div>
                        <div className={`text-xl font-medium ${rating.color}`}>{rating.text}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs mt-4">
                      Your system is rated {rating.text.toLowerCase()} for running AI models locally. 
                      The score is based on GPU VRAM, system RAM, and processing power.
                    </p>
                  </div>
                </div>

                {/* Parabola Curve Visualization */}
                <div className="w-full max-w-md">
                  <div className="bg-muted/30 rounded-lg p-6 border">
                    <div className="text-sm text-muted-foreground mb-4 text-center">
                      Performance Rating Curve
                    </div>
                    <svg width="100%" viewBox="0 0 400 200" className="overflow-visible">
                      {/* Grid lines */}
                      <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                      <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.1" strokeDasharray="4" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.1" strokeDasharray="4" />
                      <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.1" strokeDasharray="4" />
                      <line x1="0" y1="0" x2="400" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                      
                      {/* Y-axis labels */}
                      <text x="-5" y="205" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">0</text>
                      <text x="-5" y="105" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">50</text>
                      <text x="-5" y="5" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">100</text>
                      
                      {/* Parabola curve */}
                      <path
                        d={parabolaPath}
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        opacity="0.6"
                      />
                      
                      {/* User's position marker */}
                      <circle
                        cx={userPosition.x}
                        cy={userPosition.y}
                        r="8"
                        fill="hsl(var(--primary))"
                        className="animate-pulse"
                      />
                      <circle
                        cx={userPosition.x}
                        cy={userPosition.y}
                        r="12"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        opacity="0.5"
                      />
                      
                      {/* Vertical line to score */}
                      <line
                        x1={userPosition.x}
                        y1={userPosition.y}
                        x2={userPosition.x}
                        y2="200"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                        strokeDasharray="4"
                        opacity="0.5"
                      />
                      
                      {/* X-axis labels */}
                      <text x="0" y="220" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="start">Low</text>
                      <text x="200" y="220" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="middle">Optimal</text>
                      <text x="400" y="220" fontSize="10" fill="currentColor" opacity="0.5" textAnchor="end">High</text>
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recommended AI Models */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-2 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-2xl">Recommended AI Models</h3>
                <Badge variant="secondary">
                  {compatibleModels.length} Compatible
                </Badge>
              </div>

              <div className="space-y-4">
                {compatibleModels.map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-lg">{model.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {model.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>{model.performance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" />
                            <span>VRAM: {model.minVRAM}GB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            <span>RAM: {model.minRAM}GB</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                        Compatible
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              {compatibleModels.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Cpu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No compatible models found for your system configuration.</p>
                  <p className="text-sm mt-2">Consider upgrading your hardware for better AI model support.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}