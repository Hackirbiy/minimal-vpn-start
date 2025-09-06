import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldCheck, Wifi, Globe, Clock, MapPin } from "lucide-react";

type VPNStatus = "disconnected" | "connecting" | "connected";

interface Server {
  id: string;
  country: string;
  city: string;
  flag: string;
  load: number;
}

const servers: Server[] = [
  { id: "us-ny", country: "États-Unis", city: "New York", flag: "🇺🇸", load: 23 },
  { id: "uk-london", country: "Royaume-Uni", city: "Londres", flag: "🇬🇧", load: 45 },
  { id: "fr-paris", country: "France", city: "Paris", flag: "🇫🇷", load: 12 },
  { id: "de-berlin", country: "Allemagne", city: "Berlin", flag: "🇩🇪", load: 34 },
  { id: "jp-tokyo", country: "Japon", city: "Tokyo", flag: "🇯🇵", load: 67 },
  { id: "ca-toronto", country: "Canada", city: "Toronto", flag: "🇨🇦", load: 28 },
];

export const VPNDashboard = () => {
  const [status, setStatus] = useState<VPNStatus>("disconnected");
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [connectionTime, setConnectionTime] = useState(0);
  const [currentIP, setCurrentIP] = useState("192.168.1.100");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "connected") {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setConnectionTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleConnect = () => {
    if (status === "disconnected") {
      setStatus("connecting");
      setCurrentIP("192.168.1.100");
      setTimeout(() => {
        setStatus("connected");
        setCurrentIP("185.230.126.23");
      }, 2000);
    } else {
      setStatus("disconnected");
      setCurrentIP("192.168.1.100");
      setConnectionTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected": return "text-vpn-connected";
      case "connecting": return "text-vpn-connecting";
      default: return "text-vpn-disconnected";
    }
  };

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "connected": return "default";
      case "connecting": return "secondary";
      default: return "destructive";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">SecureVPN</h1>
          </div>
          <Badge variant={getStatusBadgeVariant()} className="text-sm">
            {status === "connected" && "Connecté"}
            {status === "connecting" && "Connexion..."}
            {status === "disconnected" && "Déconnecté"}
          </Badge>
        </div>

        {/* Main Connection Panel */}
        <Card className="bg-gradient-card border-vpn-border p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className={`w-32 h-32 mx-auto rounded-full border-4 ${
                status === "connected" ? "border-vpn-connected bg-vpn-connected/10" :
                status === "connecting" ? "border-vpn-connecting bg-vpn-connecting/10 animate-pulse" :
                "border-vpn-disconnected bg-vpn-disconnected/10"
              } flex items-center justify-center transition-all duration-500`}>
                {status === "connected" ? 
                  <ShieldCheck className="w-16 h-16 text-vpn-connected" /> :
                  <Shield className={`w-16 h-16 ${getStatusColor()}`} />
                }
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {status === "connected" && "Votre connexion est sécurisée"}
                {status === "connecting" && "Connexion en cours..."}
                {status === "disconnected" && "Connexion non sécurisée"}
              </h2>
              <p className="text-muted-foreground">
                {status === "connected" && `Connecté à ${selectedServer.city}, ${selectedServer.country}`}
                {status === "connecting" && "Établissement de la connexion sécurisée"}
                {status === "disconnected" && "Votre trafic n'est pas protégé"}
              </p>
            </div>

            <Button
              onClick={handleConnect}
              size="lg"
              className={`w-48 h-14 text-lg font-semibold transition-all duration-300 ${
                status === "connected" ? "bg-vpn-disconnected hover:bg-vpn-disconnected/90" :
                "bg-gradient-primary hover:opacity-90"
              }`}
              disabled={status === "connecting"}
            >
              {status === "connected" ? "Déconnecter" : status === "connecting" ? "Connexion..." : "Se connecter"}
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Server Selection */}
          <Card className="bg-gradient-card border-vpn-border p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Sélection du serveur</h3>
              </div>
              
              <Select value={selectedServer.id} onValueChange={(value) => {
                const server = servers.find(s => s.id === value);
                if (server) setSelectedServer(server);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{server.flag}</span>
                        <div>
                          <div className="font-medium">{server.city}</div>
                          <div className="text-sm text-muted-foreground">{server.country}</div>
                        </div>
                        <Badge variant={server.load < 30 ? "default" : server.load < 60 ? "secondary" : "destructive"} className="ml-auto">
                          {server.load}%
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Serveur actuel: {selectedServer.flag} {selectedServer.city}</span>
              </div>
            </div>
          </Card>

          {/* Connection Stats */}
          <Card className="bg-gradient-card border-vpn-border p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Statistiques</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Adresse IP:</span>
                  <span className="font-mono text-foreground">{currentIP}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Statut:</span>
                  <span className={`font-medium ${getStatusColor()}`}>
                    {status === "connected" ? "Connecté" : status === "connecting" ? "Connexion..." : "Déconnecté"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Temps de connexion:
                  </span>
                  <span className="font-mono text-foreground">{formatTime(connectionTime)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Protocole:</span>
                  <span className="text-foreground">OpenVPN</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};