import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldCheck, Wifi, Globe, Clock, MapPin, Cpu, HardDrive, Thermometer, Network, Activity, Settings, Power, RotateCcw } from "lucide-react";

type VPNStatus = "disconnected" | "connecting" | "connected";

interface Server {
  id: string;
  country: string;
  city: string;
  flag: string;
  load: number;
}

interface SystemMetrics {
  cpuTemp: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkSpeed: number;
  uptime: number;
}

const servers: Server[] = [
  { id: "local", country: "Local Pi", city: "Raspberry Pi", flag: "🏠", load: 15 },
  { id: "fr-paris", country: "France", city: "Paris", flag: "🇫🇷", load: 23 },
  { id: "fr-marseille", country: "France", city: "Marseille", flag: "🇫🇷", load: 18 },
  { id: "uk-london", country: "Royaume-Uni", city: "Londres", flag: "🇬🇧", load: 45 },
  { id: "de-berlin", country: "Allemagne", city: "Berlin", flag: "🇩🇪", load: 34 },
  { id: "de-frankfurt", country: "Allemagne", city: "Francfort", flag: "🇩🇪", load: 42 },
  { id: "es-madrid", country: "Espagne", city: "Madrid", flag: "🇪🇸", load: 28 },
  { id: "it-milan", country: "Italie", city: "Milan", flag: "🇮🇹", load: 31 },
  { id: "nl-amsterdam", country: "Pays-Bas", city: "Amsterdam", flag: "🇳🇱", load: 38 },
  { id: "be-brussels", country: "Belgique", city: "Bruxelles", flag: "🇧🇪", load: 22 },
  { id: "ch-zurich", country: "Suisse", city: "Zurich", flag: "🇨🇭", load: 19 },
  { id: "se-stockholm", country: "Suède", city: "Stockholm", flag: "🇸🇪", load: 27 },
  { id: "no-oslo", country: "Norvège", city: "Oslo", flag: "🇳🇴", load: 24 },
  { id: "pl-warsaw", country: "Pologne", city: "Varsovie", flag: "🇵🇱", load: 33 },
  { id: "pt-lisbon", country: "Portugal", city: "Lisbonne", flag: "🇵🇹", load: 26 },
  { id: "ie-dublin", country: "Irlande", city: "Dublin", flag: "🇮🇪", load: 29 },
  { id: "us-ny", country: "États-Unis", city: "New York", flag: "🇺🇸", load: 67 },
  { id: "us-la", country: "États-Unis", city: "Los Angeles", flag: "🇺🇸", load: 58 },
  { id: "us-chicago", country: "États-Unis", city: "Chicago", flag: "🇺🇸", load: 52 },
  { id: "ca-toronto", country: "Canada", city: "Toronto", flag: "🇨🇦", load: 41 },
  { id: "ca-montreal", country: "Canada", city: "Montréal", flag: "🇨🇦", load: 36 },
  { id: "mx-mexico", country: "Mexique", city: "Mexico", flag: "🇲🇽", load: 44 },
  { id: "br-saopaulo", country: "Brésil", city: "São Paulo", flag: "🇧🇷", load: 49 },
  { id: "ar-buenos", country: "Argentine", city: "Buenos Aires", flag: "🇦🇷", load: 39 },
  { id: "jp-tokyo", country: "Japon", city: "Tokyo", flag: "🇯🇵", load: 55 },
  { id: "kr-seoul", country: "Corée du Sud", city: "Séoul", flag: "🇰🇷", load: 47 },
  { id: "sg-singapore", country: "Singapour", city: "Singapour", flag: "🇸🇬", load: 51 },
  { id: "hk-hongkong", country: "Hong Kong", city: "Hong Kong", flag: "🇭🇰", load: 53 },
  { id: "in-mumbai", country: "Inde", city: "Mumbai", flag: "🇮🇳", load: 62 },
  { id: "ae-dubai", country: "Émirats", city: "Dubaï", flag: "🇦🇪", load: 35 },
  { id: "il-telaviv", country: "Israël", city: "Tel Aviv", flag: "🇮🇱", load: 32 },
  { id: "tr-istanbul", country: "Turquie", city: "Istanbul", flag: "🇹🇷", load: 46 },
  { id: "za-johannesburg", country: "Afrique du Sud", city: "Johannesburg", flag: "🇿🇦", load: 43 },
  { id: "au-sydney", country: "Australie", city: "Sydney", flag: "🇦🇺", load: 48 },
  { id: "nz-auckland", country: "Nouvelle-Zélande", city: "Auckland", flag: "🇳🇿", load: 37 },
];

export const VPNDashboard = () => {
  const [status, setStatus] = useState<VPNStatus>("disconnected");
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [connectionTime, setConnectionTime] = useState(0);
  const [currentIP, setCurrentIP] = useState("192.168.1.100");
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuTemp: 45.2,
    cpuUsage: 12,
    memoryUsage: 340,
    diskUsage: 65,
    networkSpeed: 2.3,
    uptime: 172800 // 2 jours en secondes
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === "connected") {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setConnectionTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    // Simulation des métriques système qui se mettent à jour
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuTemp: 40 + Math.random() * 20, // 40-60°C
        cpuUsage: Math.floor(Math.random() * 30), // 0-30%
        memoryUsage: 300 + Math.floor(Math.random() * 200), // 300-500MB
        diskUsage: 60 + Math.floor(Math.random() * 20), // 60-80%
        networkSpeed: Math.random() * 5, // 0-5 MB/s
        uptime: prev.uptime + 5
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = () => {
    if (status === "disconnected") {
      setStatus("connecting");
      setCurrentIP("192.168.1.100");
      setTimeout(() => {
        setStatus("connected");
        if (selectedServer.id === "local") {
          setCurrentIP("10.8.0.1"); // IP VPN locale du Pi
        } else {
          setCurrentIP("185.230.126.23"); // IP externe
        }
      }, 2000);
    } else {
      setStatus("disconnected");
      setCurrentIP("192.168.1.100");
      setConnectionTime(0);
    }
  };

  const handleReboot = () => {
    alert("Redémarrage du Raspberry Pi...");
  };

  const handleShutdown = () => {
    alert("Arrêt du Raspberry Pi...");
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}j ${hours}h ${minutes}m`;
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
    <div className="min-h-screen bg-gradient-hero p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-foreground">Pi VPN Server</h1>
              <p className="text-sm text-muted-foreground">Raspberry Pi 4B • 4GB RAM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant()} className="text-sm">
              {status === "connected" && "Connecté"}
              {status === "connecting" && "Connexion..."}
              {status === "disconnected" && "Déconnecté"}
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReboot}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={handleShutdown}>
                <Power className="w-4 h-4" />
              </Button>
            </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* System Metrics - Prend 1 colonne */}
          <Card className="bg-gradient-card border-vpn-border p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Système</h3>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Thermometer className="w-4 h-4" />
                      CPU Temp
                    </span>
                    <span className={`text-sm font-medium ${systemMetrics.cpuTemp > 70 ? 'text-destructive' : 'text-foreground'}`}>
                      {systemMetrics.cpuTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <Progress value={(systemMetrics.cpuTemp / 80) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Cpu className="w-4 h-4" />
                      CPU
                    </span>
                    <span className="text-sm font-medium text-foreground">{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RAM</span>
                    <span className="text-sm font-medium text-foreground">{systemMetrics.memoryUsage}MB</span>
                  </div>
                  <Progress value={(systemMetrics.memoryUsage / 1000) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <HardDrive className="w-4 h-4" />
                      Disque
                    </span>
                    <span className="text-sm font-medium text-foreground">{systemMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-foreground">{formatUptime(systemMetrics.uptime)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Network className="w-4 h-4" />
                    Réseau
                  </span>
                  <span className="text-sm font-medium text-foreground">{systemMetrics.networkSpeed.toFixed(1)} MB/s</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Server Selection - Prend 1 colonne */}
          <Card className="bg-gradient-card border-vpn-border p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Serveur</h3>
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
                          <div className="font-medium text-sm">{server.city}</div>
                          <div className="text-xs text-muted-foreground">{server.country}</div>
                        </div>
                        <Badge variant={server.load < 30 ? "default" : server.load < 60 ? "secondary" : "destructive"} className="ml-auto text-xs">
                          {server.load}%
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Actuel: {selectedServer.flag} {selectedServer.city}</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Adresse IP:</span>
                  <span className="text-xs font-mono text-foreground">{currentIP}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Statut:</span>
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {status === "connected" ? "Connecté" : status === "connecting" ? "Connexion..." : "Déconnecté"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Session:
                  </span>
                  <span className="text-xs font-mono text-foreground">{formatTime(connectionTime)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Protocole:</span>
                  <span className="text-sm text-foreground">OpenVPN</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Connection Panel - Prend 1 colonne */}
          <Card className="bg-gradient-card border-vpn-border p-4 sm:p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border-4 ${
                  status === "connected" ? "border-vpn-connected bg-vpn-connected/10" :
                  status === "connecting" ? "border-vpn-connecting bg-vpn-connecting/10 animate-pulse" :
                  "border-vpn-disconnected bg-vpn-disconnected/10"
                } flex items-center justify-center transition-all duration-500`}>
                  {status === "connected" ? 
                    <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-vpn-connected" /> :
                    <Shield className={`w-8 h-8 sm:w-10 sm:h-10 ${getStatusColor()}`} />
                  }
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {status === "connected" && "Connexion sécurisée"}
                  {status === "connecting" && "Connexion..."}
                  {status === "disconnected" && "Hors ligne"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {status === "connected" && `Via ${selectedServer.city}`}
                  {status === "connecting" && "Établissement du tunnel"}
                  {status === "disconnected" && "Trafic non protégé"}
                </p>
              </div>

              <Button
                onClick={handleConnect}
                size="lg"
                className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                  status === "connected" ? "bg-vpn-disconnected hover:bg-vpn-disconnected/90" :
                  "bg-gradient-primary hover:opacity-90"
                }`}
                disabled={status === "connecting"}
              >
                {status === "connected" ? "Déconnecter" : status === "connecting" ? "Connexion..." : "Connecter"}
              </Button>

              {selectedServer.id === "local" && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-primary font-medium">
                    🏠 Mode serveur local - Le Pi agit comme serveur VPN
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};