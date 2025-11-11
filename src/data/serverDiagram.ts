export const serverDiagram = `
flowchart TD
    %% === FLUX EXTERNES ===
    INET[🌐 Internet] 
    GH[🐙 GitHub]
    
    %% === PROXY ===
    NGINX[🔀 Nginx Proxy<br/>Serveur 1]
    
    %% === SERVEUR PRINCIPAL ===
    subgraph HOST [🖥️ Serveur 2: Docker Host]
        direction TB
        
        %% Services Web Exposés
        subgraph EXPOSED [🌍 Services Web - DMZ]
            direction LR
            RC[📧 Roundcube]
            AB[💰 Budget]
            PL[🎬 Plex]
            OS[📋 Overseerr]
            VW[🔐 Vault]
            NC[☁️ Nextcloud]
            P[👨‍💻 Portfolio]
            GF[📊 Grafana]
        end
        
        %% Services Backend
        subgraph BACKEND [⚙️ Services Backend]
            direction TB
            
            subgraph DATABASES [🗄️ Bases de Données]
                NCDB[📊 NC Database]
                OL[🤖 Ollama AI]
            end
            
            subgraph MEDIA [🎭 Média Stack]
                direction LR
                PR[🔍 Prowlarr] --> RD[🎬 Radarr]
                PR --> SN[📺 Sonarr] 
                RD --> QB[⬇️ qBittorrent]
                SN --> QB
            end
            
            subgraph MONITORING [📈 Monitoring]
                direction LR
                PROM[📊 Prometheus] --> CADV[📋 cAdvisor]
                PROM --> NE[🖥️ Node Exporter]
                PROM --> SC[💾 Scrutiny]
            end
        end
        
        %% Infrastructure
        subgraph HARDWARE [🔧 Infrastructure]
            direction TB
            M2[💽 M.2 SSD] --> DE[🐳 Docker]
            SATA[💿 SATA Cache] 
            POOL[🗃️ 8x HDD Pool]
            SNAP[🛡️ SnapRAID]
        end
    end
    
    %% === CONNEXIONS ===
    INET -->|HTTPS| NGINX
    GH -->|CI/CD| P
    
    NGINX --> RC & AB & PL & OS & VW & NC & P & GF
    
    NC -.-> NCDB
    OS -.-> RD & SN
    GF -.-> PROM
    
    QB --> SATA
    SATA -.-> POOL
    POOL --> SNAP
    NC & PL --> POOL
    
    %% === STYLES ===
    classDef external fill:#e3f2fd,stroke:#1976d2
    classDef proxy fill:#f3e5f5,stroke:#7b1fa2
    classDef web fill:#e8f5e8,stroke:#388e3c
    classDef backend fill:#fff3e0,stroke:#f57c00
    classDef storage fill:#fce4ec,stroke:#c2185b
    
    class INET,GH external
    class NGINX proxy
    class RC,AB,PL,OS,VW,NC,P,GF web
    class NCDB,OL,PR,RD,SN,QB,PROM,CADV,NE,SC backend
    class M2,DE,SATA,POOL,SNAP storage
`;