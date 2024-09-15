{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python311Packages.jupyterlab
    pkgs.python311Packages.jupyter-core
    pkgs.python311Packages.pandas
    pkgs.python311Packages.numpy
    pkgs.python311Packages.matplotlib
    pkgs.python311Packages.notebook
    pkgs.python311Packages.pytesseract
    pkgs.python311Packages.pillow
    pkgs.python311Packages.
    pkgs.tesseract4
    pkgs.python311Packages.opencv4
    pkgs.python311Packages.spacy
    pkgs.python311Packages.tensorflow
]; shellHook = ''
    echo "Environment ready"
  '';
}