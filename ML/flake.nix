{
  description = "A Python 3.11 environment.";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        system = system;
      };
      lt = pkgs.python311Packages.buildPythonPackage {
        pname = "en_core_web_sm";
        version = "3.0.0";
        src = pkgs.fetchurl {
          url = "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.0.0/en_core_web_sm-3.0.0.tar.gz";
          hash = "sha256-BnOzzkoooZ6Z3A/D+Pf+Z7k2xBdJ5rcPd47F+fePOmY";
        };
        buildInputs = with pkgs.python311Packages; [ pipBuildHook ];
        dependencies = with pkgs.python311Packages; [ spacy ];
      };
    in
    {
      devShell.${system} = with pkgs; mkShell {
        buildInputs = [
          (python311.withPackages (ps: with ps; [
            spacy
            lt
            pandas
            numpy
            matplotlib
            opencv4
            pytesseract
            pillow
            flask
          ]))
        ];
      };
    };
}
