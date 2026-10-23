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
          packages = with pkgs;
            [
              bun
              nodejs_22
              wrangler
              git
              curl
              cacert
            ]
            ++ lib.optionals stdenv.hostPlatform.isLinux [
              alsa-lib
              at-spi2-atk
              cairo
              cups
              dbus
              expat
              fontconfig
              freetype
              glib
              gtk3
              libdrm
              libxkbcommon
              mesa
              nspr
              nss
              pango
              udev
              libX11
              libXcomposite
              libXdamage
              libXext
              libXfixes
              libXrandr
              libxcb
            ];

          # Downloaded Playwright browsers live in the repository cache rather
          # than an implicit user-global cache. This keeps `nix develop`
          # sessions and CI-style local runs consistent.
          PLAYWRIGHT_BROWSERS_PATH = ".cache/ms-playwright";

          shellHook = ''
            echo "Elysola Homepage — Nix development shell"
            echo "  bun:      $(bun --version)"
            echo "  node:     $(node --version)"
            echo "  wrangler: $(wrangler --version 2>/dev/null | head -1)"
            echo
            echo "First-time setup:"
            echo "  bun install"
            echo "  bunx playwright install chromium webkit"
            echo
            echo "Commands:"
            echo "  bun run dev        — start Nuxt development server"
            echo "  bun run typecheck  — type-check Vue and TypeScript"
            echo "  bun run lint       — lint the project"
            echo "  bun run build      — build for Cloudflare Pages"
            echo "  bun run test:e2e   — run Chromium and WebKit E2E tests"
          '';
        };
      }
    );
}
