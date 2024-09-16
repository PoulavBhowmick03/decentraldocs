{
  description = "A Python 3.11 environment with CUDA support.";

  # Specify the inputs
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  # Define the outputs
  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { system = system; };

    # Define the Python package
    lt = pkgs.python311Packages.buildPythonPackage {
      pname = "en_core_web_sm";
      version = "3.0.0";
      src = pkgs.fetchurl {
        url = "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.0.0/en_core_web_sm-3.0.0.tar.gz";
        hash = "sha256-BnOzzkoooZ6Z3A/D+Pf+Z7k2xBdJ5rcPd47F+fePOmY";
      };
      buildInputs = with pkgs.python311Packages; [ pipBuildHook ];
      propagatedBuildInputs = with pkgs.python311Packages; [ spacy ];
    };

  in {
    # Define the development shell
    devShell.${system} = pkgs.mkShell {
      buildInputs = [
        pkgs.cudatoolkit_11
        (pkgs.python311.withPackages (ps: with ps; [
          spacy
          lt
          pandas
          numpy
          matplotlib
          opencv4
          pytesseract
          pillow
          flask
          faker
          scikit-learn
          torch
          torchvision
          torchaudio
          pycuda
        ]))
      ];
    };
  };
}
