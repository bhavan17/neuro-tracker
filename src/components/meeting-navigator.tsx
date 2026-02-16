import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Brain, ArrowLeft, Navigation, User, LayoutDashboard, Sparkles } from "lucide-react";
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
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";

interface MeetingNavigatorProps {
  userName: string;
  userEmail: string;
  onBack: () => void;
  onViewDashboard: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export function MeetingNavigator({ 
  userName, 
  userEmail, 
  onBack, 
  onViewDashboard, 
  onViewProfile, 
  onLogout 
}: MeetingNavigatorProps) {
  const [isLiveTranscription, setIsLiveTranscription] = useState(true);
  const [aiModel, setAiModel] = useState("gpt-4");
  const [transcriptModel, setTranscriptModel] = useState("whisper-1");
  const [summarizationLevel, setSummarizationLevel] = useState<"light" | "medium" | "heavy">("medium");
  const [calendarTracking, setCalendarTracking] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSuggestLevel = () => {
    // Logic to suggest optimal summarization level
    console.log("Suggesting optimal level based on meeting patterns...");
    setSummarizationLevel("medium");
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
              <Navigation className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl">Meeting Navigator</h2>
              <p className="text-xl text-muted-foreground mt-2">
                Navigate and manage your meetings efficiently
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
          {/* Left Side - Live Preview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Your meeting navigation feed will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                <Navigation className="h-16 w-16 text-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Configuration */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Adjust meeting transcription and tracking settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transcription Mode Toggle */}
              <div className="space-y-3">
                <Label className="font-medium">Transcription Mode</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">
                      {isLiveTranscription ? "Live Transcription" : "Post Meeting Transcription"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isLiveTranscription 
                        ? "Real-time transcription during the meeting" 
                        : "Transcribe after the meeting ends"}
                    </div>
                  </div>
                  <Switch
                    checked={isLiveTranscription}
                    onCheckedChange={setIsLiveTranscription}
                  />
                </div>
              </div>

              <Separator />

              {/* AI Model Selection */}
              <div className="space-y-3">
                <Label className="font-medium">AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Most Accurate)</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Balanced)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Transcript Model Selection */}
              <div className="space-y-3">
                <Label className="font-medium">Transcript Model</Label>
                <Select value={transcriptModel} onValueChange={setTranscriptModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select transcript model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whisper-1">Whisper v1 (Recommended)</SelectItem>
                    <SelectItem value="whisper-2">Whisper v2 (Enhanced)</SelectItem>
                    <SelectItem value="whisper-large">Whisper Large (High Quality)</SelectItem>
                    <SelectItem value="assembly-ai">AssemblyAI</SelectItem>
                    <SelectItem value="deepgram">Deepgram Nova</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Summarization Levels */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Summarization Level</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSuggestLevel}
                    className="gap-1 h-8"
                  >
                    <Sparkles className="h-3 w-3" />
                    Suggest Level
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={summarizationLevel === "light" ? "default" : "outline"}
                    onClick={() => setSummarizationLevel("light")}
                    className="w-full"
                  >
                    Light
                  </Button>
                  <Button
                    variant={summarizationLevel === "medium" ? "default" : "outline"}
                    onClick={() => setSummarizationLevel("medium")}
                    className="w-full"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={summarizationLevel === "heavy" ? "default" : "outline"}
                    onClick={() => setSummarizationLevel("heavy")}
                    className="w-full"
                  >
                    Heavy
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
                  {summarizationLevel === "light" && "Brief overview with key points only"}
                  {summarizationLevel === "medium" && "Balanced summary with important details"}
                  {summarizationLevel === "heavy" && "Detailed summary with comprehensive coverage"}
                </div>
              </div>

              <Separator />

              {/* Calendar Tracking */}
              <div className="space-y-3">
                <Label className="font-medium">Calendar Integration</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <div className="font-medium">Enable Calendar Tracking</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically track and link meetings from your calendar
                    </div>
                  </div>
                  <Switch
                    checked={calendarTracking}
                    onCheckedChange={setCalendarTracking}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}