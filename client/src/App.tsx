import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LiveDataProvider } from "@/hooks/useLiveResults";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Calendari from "@/pages/Calendari";
import Probabilitats from "@/pages/Probabilitats";
import Seguiment from "@/pages/Seguiment";
import Grups from "@/pages/Grups";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/calendari" component={Calendari} />
      <Route path="/probabilitats" component={Probabilitats} />
      <Route path="/seguiment" component={Seguiment} />
      <Route path="/grups" component={Grups} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LiveDataProvider>
          <TooltipProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </TooltipProvider>
        </LiveDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
