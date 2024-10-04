#!/bin/bash

subj='//SKIP=skip/C=IN/ST=Country/L=City/O=Company/OU=Org'
red='\033[31m'      # red
yellow='\033[33m'   # yellow
green='\033[32m'    # green
blue='\033[34m'     # Blue
purple='\033[35m'   # Purple
cyan='\033[36m'     # Cyan
white='\033[37m'    # White


gencerts(){
certname=$1
pkname=$2
alias=$3
$(openssl genrsa -out $pkname'cert_sh_private.pem' 4096)
$(openssl req -new -sha256 -key $pkname'cert_sh_private.pem' -out $certname'cert_sh_private.csr' -subj $subj)
$(openssl x509 -req -sha256 -days 3650 -in $certname'cert_sh_private.csr' -signkey $pkname'cert_sh_private.pem' -out $certname'.crt')
$(openssl pkcs12 -export -out $pkname'cert_sh_private.p12' -name $alias -inkey $pkname'cert_sh_private.pem' -in $certname'.crt')
}

verify(){
pkname=$1
keytool -v -list -storetype pkcs12 -keystore $pkname'.p12'
}

echo -e "${purple}WELCOME TO KEY PAIR GENERATOR"
echo -e "${yellow} Please enter the name of the certificate required: "
read certname
echo -e "${green}Please enter the name of the Private Key p12 file required: "
read pkname
echo -e "${cyan}Please enter the ALIAS of the Private Key p12 file : "
read pkalias
echo -e "${white}Please wait while we generate your Key Pair"

gencerts $certname $pkname $pkalias
echo -e "${white}Now lets verify the private key :)"

tput bel    # Play a bell

verify $pkname