# Token2 TOTP Toolset - local

Fully client-side version of Token2 TOTP Toolset (Token2 TOTP Toolset - local), which can be run locally without accessing any libraries/resources on the Internet (including the QR image generation).

## Features
* convert hex seed to base32 format
* generate QR image based on hex or base32 seed key values
* generate random seed values (i.e. for Token2 programmable tokens)
* verify the time drift with customizable skew value
* create CSV for Azure MFA import

## Following libraries were used

jQuery 3.7.1 | (c) JS Foundation and other contributors | jquery.org/license 

jQuery-qrcode v0.14.0 - https://larsjung.de/jquery-qrcode/ 

jsSHA (c) Brian Turek 2008-2017 http://caligatio.github.com/jsSHA/
