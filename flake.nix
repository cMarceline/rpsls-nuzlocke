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
        src = ./frontend/.; 
        
        installPhase = ''
          mkdir -p $out/var/www/buzzer-site
          cp ${src} $out/var/www/buzzer-site
        '';
      };
    in {
      
      # Reusable NixOS Module that stitches everything together
      nixosModules.buzzerApp = { config, lib, pkgs, ... }: {
        imports = [
          (import ./flake/systemd-daemon.nix { inherit pkgs; src = ./backend/.; })
          (import ./flake/nginx.nix { inherit pkgs; inherit frontendFiles; })
        ];
      };

      # Example target system configuration
      nixosConfigurations.buzzerServer = nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          self.nixosModules.buzzerApp
        ];
      };
    };
}
