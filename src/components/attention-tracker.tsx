import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Brain, ArrowLeft, Eye, User, LayoutDashboard, MoveVertical, Settings, MoveHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";

interface AttentionTrackerProps {
  userName: string;
  userEmail: string;
  onBack: () => void;
  onViewDashboard: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export function AttentionTracker({ 
  userName, 
  userEmail, 
  onBack, 
  onViewDashboard, 
  onViewProfile, 
  onLogout 
}: AttentionTrackerProps) {
  const [selectedCamera, setSelectedCamera] = useState("camera1");
  const [pitchMin, setPitchMin] = useState(-64.6);
  const [pitchMax, setPitchMax] = useState(41.1);
  const [strictness, setStrictness] = useState(5.0);
  const [yawMin, setYawMin] = useState(-35.0);
  const [yawMax, setYawMax] = useState(35.0);
  const [eyeThreshold, setEyeThreshold] = useState(0.15);
  
  // Live tracking data
  const [status, setStatus] = useState("DISTRACTED");
  const [faceDetected, setFaceDetected] = useState(true);
  const [currentPitch, setCurrentPitch] = useState(-41.6);
  const [currentYaw, setCurrentYaw] = useState(-1.3);
  const [currentRoll, setCurrentRoll] = useState(0.5);
  const [currentEAR, setCurrentEAR] = useState(0.39);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSetPitchFocused = () => {
    // Logic to set current position as focused
    console.log("Setting pitch as focused");
  };

  const handleSetYawFocused = () => {
    // Logic to set current position as focused
    console.log("Setting yaw as focused");
  };

  const handleCalibrate = () => {
    // Logic to calibrate and set current as center
    console.log("Calibrating...");
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
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl">Attention Tracker</h2>
              <p className="text-xl text-muted-foreground mt-2">
                Track your focus and attention patterns
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Area - Split Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Side - Preview/Video and Status */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Your attention tracking feed will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                  <Eye className="h-16 w-16 text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Live Status */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className={`${
                    status === "FOCUSED" 
                      ? "text-green-600 dark:text-green-500" 
                      : "text-red-600 dark:text-red-500"
                  }`}>
                    {status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Face Detected:</span>
                    <span className="flex items-center gap-2">
                      {faceDetected ? "YES" : "NO"}
                      <span className={faceDetected ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
                        {faceDetected ? "✓" : "✗"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Pitch:</span>
                    <span className="flex items-center gap-2">
                      {currentPitch >= 0 ? "+" : ""}{currentPitch.toFixed(1)}
                      <span className={
                        currentPitch >= pitchMin && currentPitch <= pitchMax
                          ? "text-green-600 dark:text-green-500" 
                          : "text-red-600 dark:text-red-500"
                      }>
                        {currentPitch >= pitchMin && currentPitch <= pitchMax ? "✓" : "✗"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Yaw:</span>
                    <span className="flex items-center gap-2">
                      {currentYaw >= 0 ? "+" : ""}{currentYaw.toFixed(1)}
                      <span className={
                        currentYaw >= yawMin && currentYaw <= yawMax
                          ? "text-green-600 dark:text-green-500" 
                          : "text-red-600 dark:text-red-500"
                      }>
                        {currentYaw >= yawMin && currentYaw <= yawMax ? "✓" : "✗"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Roll:</span>
                    <span className="flex items-center gap-2">
                      {currentRoll >= 0 ? "+" : ""}{currentRoll.toFixed(1)}
                      <span className="text-green-600 dark:text-green-500">✓</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>EAR:</span>
                    <span className="flex items-center gap-2">
                      {currentEAR.toFixed(2)}
                      <span className={
                        currentEAR >= eyeThreshold
                          ? "text-green-600 dark:text-green-500" 
                          : "text-red-600 dark:text-red-500"
                      }>
                        {currentEAR >= eyeThreshold ? "✓" : "✗"}
                      </span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Configuration */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Adjust tracking settings and calibration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Select Camera */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Camera</label>
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a camera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camera1">Camera 1</SelectItem>
                    <SelectItem value="camera2">Camera 2</SelectItem>
                    <SelectItem value="camera3">Camera 3</SelectItem>
                    <SelectItem value="camera4">Camera 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Pitch (Up/Down) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MoveVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">Pitch (Up/Down)</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Min:</label>
                      <span className="text-sm font-medium">{pitchMin.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[pitchMin]}
                      onValueChange={(value) => setPitchMin(value[0])}
                      min={-90}
                      max={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Max:</label>
                      <span className="text-sm font-medium">{pitchMax.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[pitchMax]}
                      onValueChange={(value) => setPitchMax(value[0])}
                      min={0}
                      max={90}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleSetPitchFocused}
                  >
                    Set Current as Focused
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Calibration & Sensitivity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Calibration & Sensitivity</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm">Strictness (1=Loose, 20=Strict):</label>
                    <Slider
                      value={[strictness]}
                      onValueChange={(value) => setStrictness(value[0])}
                      min={1}
                      max={20}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-center text-sm font-medium">
                      Level: {strictness.toFixed(1)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleCalibrate}
                  >
                    Calibrate (Set Current as Center)
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Yaw (Left/Right) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="h-4 w-4" />
                  <span className="text-sm font-medium">Yaw (Left/Right)</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Min:</label>
                      <span className="text-sm font-medium">{yawMin.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[yawMin]}
                      onValueChange={(value) => setYawMin(value[0])}
                      min={-90}
                      max={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Max:</label>
                      <span className="text-sm font-medium">{yawMax.toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[yawMax]}
                      onValueChange={(value) => setYawMax(value[0])}
                      min={0}
                      max={90}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleSetYawFocused}
                  >
                    Set Current as Focused
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Eye Aspect Ratio */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Eye Aspect Ratio</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Threshold:</label>
                      <span className="text-sm font-medium">{eyeThreshold.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[eyeThreshold]}
                      onValueChange={(value) => setEyeThreshold(value[0])}
                      min={0.05}
                      max={0.5}
                      step={0.01}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      (Lower = Eyes more closed)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}