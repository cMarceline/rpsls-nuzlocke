{ pkgs, frontendFiles, ... }:

{
  services.nginx = {
    enable = true;
    recommendedProxySettings = true;

    virtualHosts."yourdomain.com" = { # Replace with your actual domain or IP
      forceSSL = false; # Set to true if you set up Let's Encrypt / ACME certificates
      
      # Serve the static frontend build directly via Nginx
      locations."/" = {
        root = "${frontendFiles}/var/www/buzzer-app";
        index = "index.html";
      };

      # Proxy User WebSockets (Port 8080)
      locations."/ws/user" = {
        proxyPass = "http://127.0.0.1:8080";
        proxyWebsockets = true; # Automatically configures Upgrade and Connection headers
        extraConfig = ''
          proxy_read_timeout 3600s;
          proxy_send_timeout 3600s;
        '';
      };

      # Proxy Admin WebSockets (Port 9090)
      locations."/ws/admin" = {
        proxyPass = "http://127.0.0.1:9090";
        proxyWebsockets = true;
        extraConfig = ''
          proxy_read_timeout 3600s;
          proxy_send_timeout 3600s;
        '';
      };
    };
  };
}
