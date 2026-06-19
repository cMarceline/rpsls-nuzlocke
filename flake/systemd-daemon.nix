{ pkgs, src, ... }:

{
  # Open standard web ports in the firewall
  networking.firewall.allowedTCPPorts = [ 80 443 ];

  # Ensure required runtime packages are available for the backend
  environment.systemPackages = with pkgs; [
    bun
  ];

  # Define the Backend Daemon via Systemd
  systemd.services.buzzer-backend = {
    description = "Buzzer App TypeScript Backend Server";
    after = [ "network.target" ];
    wantedBy = [ "multi-user.target" ];
    
    serviceConfig = {
      Type = "simple";
      WorkingDirectory = "${src}";
      ExecStart = "bun run index.tsx";
      Restart = "on-failure";
      RestartSec = "5s";
      
      # Basic security sandboxing
      ProtectSystem = "full";
      NoNewPrivileges = true;
    };
  };
}
