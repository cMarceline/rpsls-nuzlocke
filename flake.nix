{
  description = "Buzzer App Deployment Flake";

  outputs = { self, nixpkgs, ... }: 

    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      
      # Package the Frontend Static Files
      frontendFiles = pkgs.stdenv.mkDerivation {
        pname = "buzzer-frontend";
        version = "0.1.0";
        
        installPhase = ''
          mkdir -p $out/var/www/buzzer-site
          cp ./frontend/. $out/var/www/buzzer-site
        '';
      };

      runner = pkgs.writeShellScriptBin "buzzer-backend" ''
        export PATH="${pkgs.bun}/bin:$PATH"
        echo "Starting User & Admin WebSocket servers via Bun..."
        exec bun run ./backend/index.tsx
      '';
    in {
      
      # Reusable NixOS Module that stitches everything together
      nixosModules.buzzerApp = { config, lib, pkgs, ... }: {

        networking.firewall.allowedTCPPorts = [ 80 443 ];
        environment.systemPackages = with pkgs; [
          bun
        ];

        imports = [
          (import ./flake/systemd-daemon.nix { inherit pkgs; src = ./backend/.; })
          (import ./flake/nginx.nix { inherit pkgs; inherit frontendFiles; })
        ];
      };

      # Execute local development server via 'nix run'
      apps.${system}.default = {
        type = "app";
        program = "${runner}/bin/buzzer-backend";
      };

      packages.${system}.default = runner;

    };
}
