#!/usr/bin/env python3
# 
# pip install -r requirements.txt

# Import libraries
from OpenSSL import crypto, SSL
from secrets import randbelow

print("Please know, if you make a mistake, you must restart the program.")

def cert_gen(
    emailAddress=input("Email Address: "),
    commonName=input("Common Name: "),
    countryName=input("Country (2 characters): "),
    localityName=input("Locality Name: "),
    stateOrProvinceName=input("State: "),
    organizationName=input("Organization: "),
    organizationUnitName=input("Organization Unit: "),
    serialNumber=randbelow(1000000),
    validityStartInSeconds=0,
    validityEndInSeconds=10*365*24*60*60,
    KEY_FILE = "cert_js_private.key",
    CERT_FILE="cert_js_selfsigned.crt"):
    # verify generated cert:
    # openssl x509 -inform pem -in cert_js_selfsigned.crt -noout -text
    # create a key pair
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 4096)
    # create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = countryName
    cert.get_subject().ST = stateOrProvinceName
    cert.get_subject().L = localityName
    cert.get_subject().O = organizationName
    cert.get_subject().OU = organizationUnitName
    cert.get_subject().CN = commonName
    cert.get_subject().emailAddress = emailAddress
    cert.set_serial_number(serialNumber)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(validityEndInSeconds)
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha512')
    with open(CERT_FILE, "wt") as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert).decode("utf-8"))
    with open(KEY_FILE, "wt") as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k).decode("utf-8"))
    print("GENERATED")
    input("Press Enter to close program.")
cert_gen()