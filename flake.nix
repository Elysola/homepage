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
              playwright-driver.browsers
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

          # Keep the test runner and browsers on the same Playwright release.
          # `playwright-driver.browsers` contains Chromium and WebKit in the
          # immutable Nix store, so no `playwright install` download is needed.
          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

          # Nixpkgs packages WebKit for Ubuntu 24.04's Playwright platform.
          PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = pkgs.lib.optionalString pkgs.stdenv.hostPlatform.isLinux "ubuntu-24.04";
          __EGL_VENDOR_LIBRARY_FILENAMES = pkgs.lib.optionalString pkgs.stdenv.hostPlatform.isLinux "${pkgs.mesa}/share/glvnd/egl_vendor.d/50_mesa.json";

          shellHook = ''
            echo "Elysola Homepage — Nix development shell"
            echo "  bun:      $(bun --version)"
            echo "  node:     $(node --version)"
            echo "  wrangler: $(wrangler --version 2>/dev/null | head -1)"
            echo
            echo "First-time setup:"
            echo "  bun install"
            echo
            echo "Playwright Chromium and WebKit are provided by Nix."
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
