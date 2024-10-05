/*
 TBD
*/

$(document).ready(function() {
    //Load token data values so you dont have to retype every time
    loadSettings();
  });
  
  $(window).on('unload', function() {
    saveSettings();
    loadSettings();
  });
  
  function loadSettings() {
    if (localStorage.serial != "") {
      $('#serial').val(localStorage.serial);
      $('#name').val(localStorage.name);
      $('#upn').val(localStorage.upn);
    }
  }
  
  function saveSettings() {
    localStorage.serial = $('#serial').val();
    localStorage.name = $('#name').val();
    localStorage.upn = $('#upn').val();
  }
  
  var base32_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  
  function inputHex() {
  
    var strHex = prompt("Please enter the seed in hex format. String of HEX type must be in byte increments ", "");
    if (strHex != null) {
      $('#secret').val(hex2base32(strHex));
    }
  
  }
  
  function hex2base32(hex) {
  
    var binary = new Array();
    for (var i = 0; i < hex.length / 2; i++) {
      var h = hex.substr(i * 2, 2);
      binary[i] = parseInt(h, 16);
    }
    return binary_to_base32(binary);
  }
  
  function binary_to_base32(input) {
    var ret = new Array();
    var ret_len = 0;
    var i = 0;
  
    var unpadded_length = input.length;
    while (input.length % 5) {
      input[input.length] = 0;
    }
  
    for (i = 0; i < input.length; i += 5) {
      ret += base32_chars.charAt((input[i] >> 3));
      ret += base32_chars.charAt(((input[i] & 0x07) << 2) | ((input[i + 1] & 0xc0) >> 6));
      if (i + 1 >= unpadded_length) {
        ret += "======"
        break;
      }
      ret += base32_chars.charAt(((input[i + 1] & 0x3e) >> 1));
      ret += base32_chars.charAt(((input[i + 1] & 0x01) << 4) | ((input[i + 2] & 0xf0) >> 4));
      if (i + 2 >= unpadded_length) {
        ret += "===="
        break;
      }
      ret += base32_chars.charAt(((input[i + 2] & 0x0f) << 1) | ((input[i + 3] & 0x80) >> 7));
      if (i + 3 >= unpadded_length) {
        ret += "==="
        break;
      }
      ret += base32_chars.charAt(((input[i + 3] & 0x7c) >> 2));
      ret += base32_chars.charAt(((input[i + 3] & 0x03) << 3) | ((input[i + 4] & 0xe0) >> 5));
      if (i + 4 >= unpadded_length) {
        ret += "="
        break;
      }
      ret += base32_chars.charAt(((input[i + 4] & 0x1f)));
    }
    return ret;
  }
  
  function download() {
    var text = document.getElementById("AzureCSV").value;
    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], {
      type: "text/plain"
    });
    var anchor = document.createElement("a");
    anchor.download = "MFA-tokens.csv";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return false;
  }
  
  function dec2hex(s) {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
  }
  
  function hex2dec(s) {
    return parseInt(s, 16);
  }
  
  function base32tohex(base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";
  
    for (var i = 0; i < base32.length; i++) {
      var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      bits += leftpad(val.toString(2), 5, '0');
    }
  
    for (var i = 0; i + 4 <= bits.length; i += 4) {
      var chunk = bits.substr(i, 4);
      hex = hex + parseInt(chunk, 2).toString(16);
    }
    return hex;
  
  }
  
  function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
      str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
  }
  
  function randombase32() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  
    for (var i = 0; i < 32; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  if ($('#secret').val() == "") {
    $('#secret').val(randombase32());
  }
  
  function updateOtp() {
  
    var key = base32tohex($('#secret').val());
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
  
    // updated for jsSHA v2.0.0 - http://caligatio.github.io/jsSHA/
    var shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(key, "HEX");
    shaObj.update(time);
    var hmac = shaObj.getHMAC("HEX");
    $('#QR').html('');
    $('#QR').qrcode({
      text: 'otpauth://totp/user@host.com?secret=' + $('#secret').val(),
      size: 300,
    });
  
    $('#secretHex').text(key);
    $('#secretHexLength').text((key.length * 4) + ' bits');
    $('#epoch').text(time);
  
    $('#hmac').empty();
  
    if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
      $('#hmac').append($('<span/>').addClass('label important').append(hmac));
    } else {
      var offset = hex2dec(hmac.substring(hmac.length - 1));
      var part1 = hmac.substr(0, offset * 2);
      var part2 = hmac.substr(offset * 2, 8);
      var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
      if (part1.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part1));
      $('#hmac').append($('<span/>').addClass('label label-primary').append(part2));
      if (part3.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part3));
    }
  
    var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
    otp = (otp).substr(otp.length - 6, 6);
  
    $('#otp').html("&nbsp;" + otp + "&nbsp;");
    //Update previous and next OTPs
    var otptable = '<table class="table table-striped table-sm table-bordered" style="width:100%;font-size:small">';
    otptable = otptable + '<tr><td><b>Skew</b></td><td><b>OTP</b></td></tr>';
    var i = 0;
    for (i = -$('#skew').val() * 30; i <= $('#skew').val() * 30; i += 30) {
      if (i == 0) {
        otptable = otptable + '<tr><td><b>' + i + ' sec.</b></td><td><b>&#9205;' + updateOtp2(i) + '&#9204;</b></td></tr>'
      } else {
        otptable = otptable + '<tr><td>' + i + ' sec.</td><td>' + updateOtp2(i) + '</td></tr>';
      }
    }
  
    otptable = otptable + '</table>';
  
    $('#otp2').html(otptable);
  
  }
  
  function updateOtp2(val) {
  
    var key = base32tohex($('#secret').val());
    var epoch = Math.round(new Date().getTime() / 1000.0) + val;
    var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
  
    // updated for jsSHA v2.0.0 - http://caligatio.github.io/jsSHA/
    var shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(key, "HEX");
    shaObj.update(time);
    var hmac = shaObj.getHMAC("HEX");
  
    $('#secretHex').text(key);
    $('#secretHexLength').text((key.length * 4) + ' bits');
  
    $('#hmac').empty();
  
    if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
      $('#hmac').append($('<span/>').addClass('label important').append(hmac));
    } else {
      var offset = hex2dec(hmac.substring(hmac.length - 1));
      var part1 = hmac.substr(0, offset * 2);
      var part2 = hmac.substr(offset * 2, 8);
      var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
      if (part1.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part1));
      $('#hmac').append($('<span/>').addClass('label label-primary').append(part2));
      if (part3.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part3));
    }
  
    var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
    otp = (otp).substr(otp.length - 6, 6);
  
    return otp;
  }
  
  function timer() {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var countDown = 30 - (epoch % 30);
    if (epoch % 30 == 0) updateOtp();
    if (countDown < 10) {
      sSec = "0" + countDown;
    } else {
      sSec = countDown;
    }
    $('#updatingIn').text(sSec);
  
  }
  $(function() {
    updateOtp();
  
    $('#update').click(function(event) {
      updateOtp();
      event.preventDefault();
    });
  
    $('#secret').keyup(function() {
      updateOtp();
    });
  
    setInterval(timer, 1000);
  });
  
  function addCSV() {
    // upn,serial_number,secret_key,timeinterval,manufacturer,model
    // beat@lab.org.in,1234567,1234567890abcdef1234567890abcdef,60,Contoso,HardwareKey
    document.frmConvert.AzureCSV.value = document.frmConvert.AzureCSV.value + "\n" + document.frmConvert.upn.value + "," + document.frmConvert.serial.value + ',' + document.frmConvert.secret.value + ",30," + document.frmConvert.name.value;
  
  }