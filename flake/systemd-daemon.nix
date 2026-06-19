{ pkgs, src, ... }:

{
  # Open standard web ports in the firewall
  networking.firewall.allowedTCPPorts = [ 80 443 ];

  # Define the Backend Daemon via Systemd
  systemd.services.buzzer-backend = {
    description = "Buzzer App TypeScript Backend Server";
    after = [ "network.target" ];
    wantedBy = [ "multi-user.target" ];
    
    serviceConfig = {
      Type = "simple";
      WorkingDirectory = "${src}";
      ExecStart = "bun run index.tsx";      
      # Basic security sandboxing
      ProtectSystem = "full";
      NoNewPrivileges = true;
    };
  };
}
