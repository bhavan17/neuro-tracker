import { useState, useMemo } from "react";
  import { motion } from "motion/react";
  import { Card } from "./ui/card";
  import { Button } from "./ui/button";
  import { ThemeToggle } from "./theme-toggle";
  import { Brain, ArrowLeft, Calendar as CalendarIcon, User, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";
  import { Avatar, AvatarFallback } from "./ui/avatar";
  import { Calendar } from "./ui/calendar";
  import { DayProps } from "react-day-picker";
  import { Checkbox } from "./ui/checkbox";
  
  interface CalendarPageProps {
    userName: string;
    userEmail: string;
    onBack: () => void;
    onViewDashboard: () => void;
    onViewProfile: () => void;
    onLogout: () => void;
  }

  type Priority = 'green' | 'orange' | 'red';
  
  export function CalendarPage({ 
    userName, 
    userEmail, 
    onBack, 
    onViewDashboard, 
    onViewProfile, 
    onLogout 
  }: CalendarPageProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [showGreen, setShowGreen] = useState(true);
    const [showOrange, setShowOrange] = useState(true);
    const [showRed, setShowRed] = useState(true);

    // Generate random priorities for dates
    const datePriorities = useMemo(() => {
      const priorities: Record<string, Priority> = {};
      const colors: Priority[] = ['green', 'orange', 'red'];
      
      // Generate priorities for the current month
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        // Randomly assign priority to about 60% of days
        if (Math.random() > 0.4) {
          const dateKey = `${year}-${month}-${day}`;
          priorities[dateKey] = colors[Math.floor(Math.random() * colors.length)];
        }
      }
      
      return priorities;
    }, [currentMonth]);

    // Filter priorities based on checkbox selection
    const filteredDatePriorities = useMemo(() => {
      const filtered: Record<string, Priority> = {};
      
      Object.entries(datePriorities).forEach(([dateKey, priority]) => {
        if (
          (priority === 'green' && showGreen) ||
          (priority === 'orange' && showOrange) ||
          (priority === 'red' && showRed)
        ) {
          filtered[dateKey] = priority;
        }
      });
      
      return filtered;
    }, [datePriorities, showGreen, showOrange, showRed]);

    // Generate upcoming events based on calendar priorities
    const upcomingEvents = useMemo(() => {
      const events: Array<{
        date: Date;
        title: string;
        time: string;
        priority: Priority;
        dayLabel: string;
      }> = [];

      const eventTitles = {
        green: [
          "Coffee Break",
          "Email Check-in",
          "Team Sync",
          "Quick Update",
          "Casual Meeting",
          "Status Review",
          "Brief Discussion"
        ],
        orange: [
          "Project Review",
          "Client Call",
          "Strategy Session",
          "Weekly Planning",
          "Department Meeting",
          "Progress Review",
          "Team Workshop"
        ],
        red: [
          "Board Meeting",
          "Client Presentation",
          "Important Deadline",
          "Executive Review",
          "Critical Decision",
          "Major Milestone",
          "Urgent Discussion"
        ]
      };

      const times = [
        "9:00 AM - 10:00 AM",
        "10:30 AM - 11:30 AM",
        "1:00 PM - 2:00 PM",
        "2:30 PM - 3:30 PM",
        "3:00 PM - 4:30 PM",
        "4:00 PM - 5:00 PM"
      ];

      // Generate events for dates with priorities in the next 14 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 14; i++) {
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + i);
        
        const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
        const priority = datePriorities[dateKey];

        if (priority) {
          // Get day label
          let dayLabel = "";
          if (i === 0) dayLabel = "Today";
          else if (i === 1) dayLabel = "Tomorrow";
          else dayLabel = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          // Randomly select title and time
          const titleOptions = eventTitles[priority];
          const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
          const time = times[Math.floor(Math.random() * times.length)];

          events.push({
            date: eventDate,
            title,
            time,
            priority,
            dayLabel
          });
        }
      }

      return events;
    }, [datePriorities]);

    const getPriorityColor = (date: Date): Priority | undefined => {
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      return filteredDatePriorities[dateKey];
    };
  
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };
  
    const goToPreviousMonth = () => {
      setCurrentMonth(prevMonth => {
        const newMonth = new Date(prevMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        return newMonth;
      });
    };
  
    const goToNextMonth = () => {
      setCurrentMonth(prevMonth => {
        const newMonth = new Date(prevMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        return newMonth;
      });
    };
  
    const formatMonthYear = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
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
                <CalendarIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl">Calendar</h2>
                <p className="text-xl text-muted-foreground mt-2">
                  Manage your schedule effectively
                </p>
              </div>
            </div>
          </motion.div>
  
          {/* Calendar Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-2 p-8">
              <div className="space-y-6">
                {/* Calendar Component */}
                <div className="flex justify-center gap-8 items-start">
                  <div className="rounded-2xl overflow-hidden border bg-card shadow-sm">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-6"
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      datePriorities={filteredDatePriorities}
                    />
                  </div>
                  
                  {/* Priority Legend */}
                  <div className="space-y-3 pt-6">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowGreen(!showGreen)}>
                      <Checkbox 
                        checked={showGreen}
                        onCheckedChange={setShowGreen}
                        id="green-priority"
                      />
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <label htmlFor="green-priority" className="text-sm text-muted-foreground cursor-pointer">Not Important</label>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowOrange(!showOrange)}>
                      <Checkbox 
                        checked={showOrange}
                        onCheckedChange={setShowOrange}
                        id="orange-priority"
                      />
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <label htmlFor="orange-priority" className="text-sm text-muted-foreground cursor-pointer">Important</label>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowRed(!showRed)}>
                      <Checkbox 
                        checked={showRed}
                        onCheckedChange={setShowRed}
                        id="red-priority"
                      />
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <label htmlFor="red-priority" className="text-sm text-muted-foreground cursor-pointer">Most Important</label>
                    </div>
                  </div>
                </div>
  
                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="mt-8 p-6 rounded-xl bg-muted/50 border">
                    <div className="text-sm text-muted-foreground mb-2">Selected Date</div>
                    <div className="font-medium text-2xl">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}
  
                {/* Upcoming Events Section */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-medium text-xl">Upcoming Events</h3>
                  <div className="space-y-3">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, index) => {
                        // Determine badge color and text color based on priority
                        const priorityStyles = {
                          green: {
                            badge: "bg-green-500/10 text-green-600 border-green-500/20",
                            indicator: "bg-green-500"
                          },
                          orange: {
                            badge: "bg-orange-500/10 text-orange-600 border-orange-500/20",
                            indicator: "bg-orange-500"
                          },
                          red: {
                            badge: "bg-red-500/10 text-red-600 border-red-500/20",
                            indicator: "bg-red-500"
                          }
                        };

                        const style = priorityStyles[event.priority];

                        return (
                          <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-1 h-12 rounded-full ${style.indicator} mt-1`}></div>
                                <div>
                                  <div className="font-medium">{event.title}</div>
                                  <div className="text-sm text-muted-foreground">{event.time}</div>
                                </div>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded border whitespace-nowrap ${style.badge}`}>
                                {event.dayLabel}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No upcoming events scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }