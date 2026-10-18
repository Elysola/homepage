{
  description = "Elysola Homepage";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            bun
            nodejs_22
            wrangler
          ];

          shellHook = ''
            echo "Elysola Homepage — dev shell"
            echo "  bun:    $(bun --version)"
            echo "  node:   $(node --version)"
            echo "  wrangler: $(wrangler --version 2>/dev/null | head -1)"
            echo ""
            echo "Commands:"
            echo "  bun install   — install dependencies"
            echo "  bun run dev   — start dev server"
            echo "  bun run build — build for production"
            echo "  bun run lint  — lint code"
            echo "  bun run format — format code"
          '';
        };
      }
    );
}
