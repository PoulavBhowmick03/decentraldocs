{ pkgs ? import <nixpkgs> {
  config = {
    allowUnfree = true;
    cudaSupport = true;
  };
} }:
  pkgs.mkShell {
    # nativeBuildInputs is usually what you want -- tools you need to run
    nativeBuildInputs = with pkgs.buildPackages; [
      python311
      cudaPackages_11.cudatoolkit
      python311Packages.torch
      python311Packages.pip
      python311Packages.torchvision
      python311Packages.torchaudio  
      cudaPackages_11.cudnn
    ];

    shellHook = ''
      echo "You are now using a NIX environment"
      export CUDA_PATH=${pkgs.cudatoolkit}
    '';
}